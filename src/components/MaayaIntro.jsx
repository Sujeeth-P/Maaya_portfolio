import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LETTERS    = ['M', 'A', 'A', 'Y', 'A', 'Y']
const SLICE_COUNT = 7

// ─────────────────────────────────────────────────────────────────────────────
// This constant MUST match the spacer height in App.jsx.
// ─────────────────────────────────────────────────────────────────────────────
export const INTRO_SCROLL_HEIGHT = 1700   // px

const LERP_SPEED = 0.55

// ── WebGL shader sources ──────────────────────────────────────────────────────

const VERT_SRC = `
attribute vec2 aPos;
varying   vec2 vUv;
void main() {
  vUv         = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

// fBM-displaced wipe. vUv.y = 0 → screen bottom, 1 → screen top.
// Wave sweeps bottom-to-top as uProgress goes 0 → 1.
const FRAG_SRC = `
precision mediump float;
varying vec2  vUv;
uniform float uProgress;
uniform float uTime;
uniform vec2  uResolution;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(
    mix(hash(i),hash(i+vec2(1,0)),f.x),
    mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),
    f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=0.5;}
  return v;
}

void main(){
  vec2  uv     = vUv;
  float aspect = (uResolution.y > 0.0) ? (uResolution.x / uResolution.y) : 1.0;

  float n = fbm(vec2(uv.x * aspect, uv.y) * 2.0 + uTime * 0.2) * 0.07 - 0.035;

  /* threshold slides from -0.12 (off bottom) to 1.05 (off top) */
  float threshold = mix(-0.12, 1.05, uProgress) + n;

  /* 1 below threshold (opaque), 0 above (transparent) */
  float alpha = 1.0 - smoothstep(threshold - 0.018, threshold + 0.018, uv.y);

  float waveFrac = clamp(uv.y / max(abs(threshold), 0.001), 0.0, 1.0);
  vec3 colA = vec3(0.031, 0.278, 0.204);  /* #084734 */
  vec3 colB = vec3(0.051, 0.420, 0.290);  /* mid forest green */
  vec3 colC = vec3(0.808, 0.945, 0.482);  /* #CEF17B */
  vec3 col  = mix(
    colA,
    mix(colB, colC, smoothstep(0.4, 1.0, waveFrac)),
    smoothstep(0.0, 0.5, waveFrac)
  );

  gl_FragColor = vec4(col, alpha);
}`

/**
 * MaayaIntro
 * ----------
 * Fixed overlay driven by window.scrollY.
 * The SVG wave is replaced by a WebGL canvas with fBM displacement.
 * All letter / GSAP animation logic is IDENTICAL to the original.
 *
 * Props
 *   onComplete  — called once when wipe-out first reaches 100 %
 *   onProgress  — called every frame with waveProgress (0–1)
 */
export default function MaayaIntro({ onComplete, onProgress }) {
    const containerRef  = useRef(null)
    const pinkLayerRef  = useRef(null)
    const wrapRef       = useRef(null)
    const lettersBoxRef = useRef(null)
    const hintRef       = useRef(null)
    const hintLabelRef  = useRef(null)
    const waveCanvasRef = useRef(null)

    const s = useRef({
        waveProgress:         0,
        targetProgress:       0,
        rafId:                null,
        readyToScroll:        false,
        wipeEverDone:         false,
        overlayHidden:        false,
        lastReportedProgress: -1,
    })

    useEffect(() => {
        const st         = s.current
        const container  = containerRef.current
        const pinkLayer  = pinkLayerRef.current
        const lettersBox = lettersBoxRef.current
        const hint       = hintRef.current
        const hintLabel  = hintLabelRef.current
        const canvas     = waveCanvasRef.current

        if (!container || !pinkLayer || !lettersBox || !canvas) return

        // ── WebGL — wrapped in try/catch so any failure is non-fatal ──────────
        let gl      = null
        let program = null
        let glReady = false
        let uLoc    = {}
        let canvasW = 0
        let canvasH = 0
        const startTime = Date.now()

        try {
            gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
        } catch (_) { /* swallow */ }

        if (gl) {
            try {
                const compile = (type, src) => {
                    const s = gl.createShader(type)
                    gl.shaderSource(s, src)
                    gl.compileShader(s)
                    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                        console.warn('[MaayaIntro shader]', gl.getShaderInfoLog(s))
                        return null
                    }
                    return s
                }

                const vert = compile(gl.VERTEX_SHADER,   VERT_SRC)
                const frag = compile(gl.FRAGMENT_SHADER, FRAG_SRC)

                if (vert && frag) {
                    program = gl.createProgram()
                    gl.attachShader(program, vert)
                    gl.attachShader(program, frag)
                    gl.linkProgram(program)

                    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                        gl.useProgram(program)

                        // Fullscreen quad
                        const buf = gl.createBuffer()
                        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
                        gl.bufferData(gl.ARRAY_BUFFER,
                            new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
                            gl.STATIC_DRAW)

                        const aLoc = gl.getAttribLocation(program, 'aPos')
                        gl.enableVertexAttribArray(aLoc)
                        gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0)

                        gl.enable(gl.BLEND)
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
                        gl.clearColor(0, 0, 0, 0)

                        // Cache uniform locations once
                        uLoc = {
                            uProgress:   gl.getUniformLocation(program, 'uProgress'),
                            uTime:       gl.getUniformLocation(program, 'uTime'),
                            uResolution: gl.getUniformLocation(program, 'uResolution'),
                        }

                        glReady = true
                    } else {
                        console.warn('[MaayaIntro link]', gl.getProgramInfoLog(program))
                    }
                }
            } catch (err) {
                console.warn('[MaayaIntro WebGL setup]', err)
                glReady = false
            }
        }

        // ── Canvas resize: always sync dimensions, re-set viewport ────────────
        // uResolution is sent every draw call (not here) to avoid timing issues.
        function resizeCanvas() {
            const w = Math.round(canvas.offsetWidth  * devicePixelRatio) || 1
            const h = Math.round(canvas.offsetHeight * devicePixelRatio) || 1
            canvas.width  = w
            canvas.height = h
            canvasW = w
            canvasH = h
            if (gl && glReady) {
                gl.viewport(0, 0, w, h)
            }
        }

        const ro = new ResizeObserver(resizeCanvas)
        ro.observe(canvas)
        resizeCanvas()

        // ── Draw one frame (progress + time + resolution set every call) ──────
        // Sending uResolution here avoids any stale-uniform issues after resize.
        function drawWave() {
            if (!gl || !glReady || !program) return
            try {
                gl.useProgram(program)
                gl.uniform1f(uLoc.uProgress,   st.waveProgress)
                gl.uniform1f(uLoc.uTime,       (Date.now() - startTime) / 1000)
                gl.uniform2f(uLoc.uResolution, canvasW, canvasH)
                gl.viewport(0, 0, canvasW, canvasH)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            } catch (err) {
                console.warn('[MaayaIntro drawWave]', err)
            }
        }

        // Initial draw — should be fully transparent at progress = 0
        drawWave()

        // ── Progress reporting ────────────────────────────────────────────────
        function reportProgress(p) {
            if (!onProgress) return
            if (Math.abs(p - st.lastReportedProgress) > 0.005) {
                st.lastReportedProgress = p
                onProgress(p)
            }
        }

        // ── Overlay opacity cross-fade ────────────────────────────────────────
        function syncOverlayOpacity() {
            const scrolledPast = st.targetProgress >= 0.99
            const waveReady    = st.waveProgress   >= 0.97

            const fadeStart  = 0.2
            const fadeEnd    = 0.9
            let   opa        = 1
            if (st.waveProgress > fadeStart) {
                opa = 1 - Math.min(1,
                    (st.waveProgress - fadeStart) / (fadeEnd - fadeStart))
            }
            container.style.opacity = opa

            if (scrolledPast && waveReady && !st.overlayHidden) {
                st.overlayHidden = true
                container.style.pointerEvents = 'none'
                if (!st.wipeEverDone) {
                    st.wipeEverDone = true
                    requestAnimationFrame(() => {
                        if (window.scrollY > INTRO_SCROLL_HEIGHT)
                            window.scrollTo({ top: INTRO_SCROLL_HEIGHT, behavior: 'instant' })
                        onComplete && onComplete()
                    })
                }
            } else if (!scrolledPast && st.overlayHidden) {
                st.overlayHidden = false
                container.style.pointerEvents = 'auto'
            }
        }

        // ── lerp / RAF loop ───────────────────────────────────────────────────
        function startRaf() {
            if (st.rafId) return
            function tick() {
                const diff = st.targetProgress - st.waveProgress
                if (Math.abs(diff) < 0.0006) {
                    st.waveProgress = st.targetProgress
                    drawWave()
                    reportProgress(st.waveProgress)
                    syncOverlayOpacity()
                    st.rafId = null
                    return
                }
                st.waveProgress += diff * LERP_SPEED
                drawWave()
                reportProgress(st.waveProgress)
                syncOverlayOpacity()
                st.rafId = requestAnimationFrame(tick)
            }
            st.rafId = requestAnimationFrame(tick)
        }

        // ── Scroll listener ───────────────────────────────────────────────────
        function onScroll() {
            if (!st.readyToScroll) return
            const raw = window.scrollY / INTRO_SCROLL_HEIGHT
            st.targetProgress = Math.min(1, Math.max(0, raw))
            if (raw > 0.03) {
                gsap.to(hint, { opacity: 0, duration: 0.15 })
            } else {
                if (hintLabel) hintLabel.textContent = 'Scroll to enter'
                gsap.to(hint, { opacity: 1, duration: 0.5 })
            }
            startRaf()
        }

        window.addEventListener('scroll', onScroll, { passive: true })

        // ── Entry animation (IDENTICAL to original) ───────────────────────────
        const letterEls = Array.from(lettersBox.querySelectorAll('.intro-letter'))
        if (letterEls.length === 0) return

        gsap.set(container, { opacity: 1 })

        letterEls.forEach((el) => {
            gsap.set(el, { opacity: 0, y: 50, scale: 0.7 })
            el.querySelectorAll('.intro-slice').forEach((slice, si) => {
                gsap.set(slice, { x: (si % 2 === 0 ? 1 : -1) * (SLICE_COUNT - si) * 20 })
            })
        })

        const tl = gsap.timeline()
        tl.to(letterEls, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: 'back.out(1.3)' }, 0.05)
        letterEls.forEach((el, li) => {
            el.querySelectorAll('.intro-slice').forEach((slice, si) => {
                tl.to(slice, { x: 0, duration: 0.42, ease: 'power2.inOut' }, 0.4 + li * 0.05 + si * 0.022)
            })
        })
        tl.to(wrapRef.current,  { scale: 1.55, y: '-4vh', duration: 0.7,  ease: 'power2.inOut' }, 1.1)
        tl.to(pinkLayer,        { backgroundColor: '#084734', duration: 0.6, ease: 'power2.inOut' }, 1.15)
        tl.to(letterEls,        { color: '#E5FCCD', duration: 0.4, stagger: 0.04 }, 1.2)
        tl.call(() => {
            st.readyToScroll = true
            if (hintLabel) hintLabel.textContent = 'Scroll to enter'
            gsap.to(hint, { opacity: 1, duration: 0.5, ease: 'power2.out' })
            onScroll()
        }, null, 2.2)

        return () => {
            tl.kill()
            if (st.rafId) cancelAnimationFrame(st.rafId)
            window.removeEventListener('scroll', onScroll)
            ro.disconnect()
            try { if (gl && program) gl.deleteProgram(program) } catch (_) {}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9999, overflow: 'hidden', opacity: 0,
                background: '#084734',
            }}
        >
            {/* Dark bg */}
            <div style={{ position: 'absolute', inset: 0, background: '#084734', zIndex: 0 }} />

            {/* Teal layer + letters */}
            <div
                ref={pinkLayerRef}
                style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#CEF17B',
                }}
            >
                {/* Scan lines overlay */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)',
                }} />

                {/* MAAYAY letters */}
                <div ref={wrapRef} style={{ position: 'relative', transformOrigin: 'center center' }}>
                    <div ref={lettersBoxRef} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px,0.8vw,12px)' }}>
                        {LETTERS.map((letter, li) => (
                            <div key={li} className="intro-letter" style={{
                                position: 'relative',
                                fontSize: 'clamp(70px,13vw,150px)',
                                fontFamily: "'Rubik Mono One', monospace",
                                fontWeight: 400, color: '#084734', lineHeight: 1,
                                userSelect: 'none', height: '1.05em',
                                flexShrink: 0, overflow: 'hidden',
                            }}>
                                <span style={{ opacity: 0, pointerEvents: 'none' }}>{letter}</span>
                                {Array.from({ length: SLICE_COUNT }).map((_, si) => {
                                    const pct = 100 / SLICE_COUNT
                                    return (
                                        <div key={si} className="intro-slice" style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            clipPath: `inset(${(si * pct).toFixed(2)}% 0% ${(100 - (si + 1) * pct).toFixed(2)}% 0%)`,
                                            willChange: 'transform', display: 'flex', alignItems: 'flex-start',
                                        }}>
                                            {letter}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── WebGL displacement wave canvas ────────────────────────────────
                Replaces the old SVG wave. z=5 puts it above pinkLayer (z=2)
                but below the scroll hint (z=8). At progress=0 the shader
                outputs alpha=0 everywhere → fully transparent, letters visible.
             ── */}
            <canvas
                ref={waveCanvasRef}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    zIndex: 5, pointerEvents: 'none',
                    display: 'block',
                }}
            />

            {/* Scroll hint */}
            <div ref={hintRef} style={{
                position: 'absolute', bottom: '6vh', left: '50%', transform: 'translateX(-50%)',
                zIndex: 8, opacity: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '7px', pointerEvents: 'none',
            }}>
                <span ref={hintLabelRef} style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#FAFAF7',
                }}>Scroll to enter</span>
                <svg width="16" height="22" viewBox="0 0 20 28" fill="none">
                    <rect x="1" y="1" width="18" height="22" rx="9" stroke="rgba(206,241,123,0.5)" strokeWidth="1.5" />
                    <rect x="9" y="5" width="2" height="6" rx="1" fill="rgba(8,71,52,0.8)">
                        <animate attributeName="y"       values="5;11;5" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0;1"  dur="1.5s" repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>
        </div>
    )
}