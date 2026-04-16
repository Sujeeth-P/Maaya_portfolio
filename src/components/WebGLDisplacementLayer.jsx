import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * WebGLDisplacementLayer
 * ─────────────────────
 * A full-screen, pointer-events:none fixed canvas rendered with mix-blend-mode:screen.
 *
 * When `activeSectionId` changes (fired by IntersectionObserver in App.jsx), it
 * plays a brief low-intensity displacement ripple:
 *   uProgress  0 → 1 → 0  over ~1.3 s  (bell-curve envelope via sin)
 *
 * The shader renders a fBM-animated iridescent teal shimmer that brightens the
 * incoming section through the screen blend.  Intensity is kept very low (~8%)
 * so it reads as a morphing "energy wave" rather than an obtrusive overlay.
 */

// ── Shared vertex shader ─────────────────────────────────────────────────────
const VERT_SRC = /* glsl */`
attribute vec2 aPos;
varying   vec2 vUv;
void main(){
  vUv         = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

// ── Ripple fragment shader ────────────────────────────────────────────────────
const FRAG_SRC = /* glsl */`
precision mediump float;
varying vec2  vUv;
uniform float uProgress;   /* 0 → 1, driven by GSAP (bell envelope applied in shader) */
uniform float uTime;
uniform vec2  uResolution;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(
    mix(hash(i),           hash(i+vec2(1,0)), f.x),
    mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x),
    f.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<3;i++){ v+=a*noise(p); p=p*2.1+vec2(1.7,9.2); a*=0.5; }
  return v;
}

void main(){
  /* early-out when idle to save GPU */
  if(uProgress < 0.001){ gl_FragColor = vec4(0.0); return; }

  float aspect = uResolution.x / uResolution.y;

  /* sin envelope → bell curve peaking at uProgress = 0.5 */
  float env = sin(uProgress * 3.14159);

  /* two independent fBM layers, time-animated */
  vec2 p = vec2(vUv.x * aspect, vUv.y) * 3.5 + uTime * 1.4;
  float n1 = fbm(p)           - 0.5;   /* roughly [-0.5, 0.5] */
  float n2 = fbm(p + vec2(5.2,1.3)) - 0.5;

  /* soft vignette — fade toward edges so centres get more shimmer */
  vec2 uv2 = abs(vUv * 2.0 - 1.0);
  float vig = 1.0 - max(uv2.x, uv2.y);
  vig = smoothstep(0.05, 0.55, vig);

  /* final colour: teal tinted by noise, very low intensity */
  float intensity = env * vig * 0.10;
  vec3  teal      = vec3(0.051, 0.620, 0.459);  /* #0D9E75 */
  vec3  col       = teal * (0.6 + n1 * 0.4) * intensity;
  float a         = clamp(intensity * 0.7, 0.0, 1.0);

  gl_FragColor = vec4(col, a);
}`

export default function WebGLDisplacementLayer({ activeSectionId }) {
    const canvasRef   = useRef(null)
    const glDataRef   = useRef({ gl: null, prog: null, ready: false, startTime: Date.now() })
    /* uProgress proxy — tweened by GSAP, read by the RAF loop */
    const progressRef = useRef({ value: 0 })
    const rafRef      = useRef(null)
    const tlRef       = useRef(null)

    // ── WebGL initialisation ──────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
        if (!gl) return

        function compile(type, src) {
            const s = gl.createShader(type)
            gl.shaderSource(s, src)
            gl.compileShader(s)
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error('[DisplacementLayer]', gl.getShaderInfoLog(s))
                gl.deleteShader(s)
                return null
            }
            return s
        }

        const vert = compile(gl.VERTEX_SHADER,   VERT_SRC)
        const frag = compile(gl.FRAGMENT_SHADER, FRAG_SRC)
        if (!vert || !frag) return

        const prog = gl.createProgram()
        gl.attachShader(prog, vert)
        gl.attachShader(prog, frag)
        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('[DisplacementLayer link]', gl.getProgramInfoLog(prog))
            return
        }
        gl.useProgram(prog)

        // Fullscreen quad
        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
            gl.STATIC_DRAW)
        const aPosLoc = gl.getAttribLocation(prog, 'aPos')
        gl.enableVertexAttribArray(aPosLoc)
        gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0, 0, 0, 0)

        // Cache uniform locations
        const uLoc = {
            uProgress:   gl.getUniformLocation(prog, 'uProgress'),
            uTime:       gl.getUniformLocation(prog, 'uTime'),
            uResolution: gl.getUniformLocation(prog, 'uResolution'),
        }

        glDataRef.current = { gl, prog, ready: true, startTime: Date.now(), uLoc }

        // Canvas resize
        function resize() {
            const w = Math.round(canvas.clientWidth  * devicePixelRatio)
            const h = Math.round(canvas.clientHeight * devicePixelRatio)
            canvas.width  = w
            canvas.height = h
            gl.viewport(0, 0, w, h)
            if (uLoc.uResolution) gl.uniform2f(uLoc.uResolution, w, h)
        }
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)
        resize()

        // ── RAF loop ──────────────────────────────────────────────────────────
        let running = true
        function loop() {
            if (!running) return
            const { ready, startTime: st, uLoc: u } = glDataRef.current
            if (ready) {
                const time = (Date.now() - st) / 1000
                gl.uniform1f(u.uTime,     time)
                gl.uniform1f(u.uProgress, progressRef.current.value)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }
            rafRef.current = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            running = false
            cancelAnimationFrame(rafRef.current)
            ro.disconnect()
            gl.deleteProgram(prog)
            gl.deleteBuffer(buf)
            glDataRef.current.ready = false
        }
    }, [])

    // ── Trigger ripple when active section changes ─────────────────────────────
    useEffect(() => {
        if (!activeSectionId) return

        if (tlRef.current) tlRef.current.kill()
        progressRef.current.value = 0

        tlRef.current = gsap.to(progressRef.current, {
            value:    1,
            duration: 1.3,
            ease:     'sine.inOut',
            /* No onComplete needed — the shader handles the 0→1→0 envelope */
        })
    }, [activeSectionId])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position:       'fixed',
                inset:          0,
                width:          '100%',
                height:         '100%',
                zIndex:         50,
                pointerEvents:  'none',
                display:        'block',
                mixBlendMode:   'screen',
            }}
        />
    )
}
