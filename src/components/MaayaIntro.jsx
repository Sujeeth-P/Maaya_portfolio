import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const LETTERS = ['M', 'A', 'A', 'Y', 'A', 'Y']
const SLICE_COUNT = 7
const NUM_POINTS = 12

// ─────────────────────────────────────────────────────────────────────────────
// This constant MUST match the spacer height in App.jsx.
// It is the total virtual scroll distance that drives the wave 0 → 1.
// ─────────────────────────────────────────────────────────────────────────────
export const INTRO_SCROLL_HEIGHT = 1700   // px

const LERP_SPEED = 0.55   // viscous lag factor (higher = more direct tracking)

// Progress threshold at which hero starts fading in (0–1)
const HERO_FADE_IN_START = 0.5

/**
 * MaayaIntro
 * ----------
 * A fixed overlay that reads window.scrollY to drive the wave wipe animation.
 * No wheel event accumulation — the browser's native scroll IS the scrub.
 *
 * Props
 *  onComplete   — called once when wave wipe first reaches 100%
 *  onProgress   — called every frame with current waveProgress (0–1)
 */
export default function MaayaIntro({ onComplete, onProgress }) {
    const containerRef = useRef(null)
    const pinkLayerRef = useRef(null)
    const wrapRef = useRef(null)
    const lettersBoxRef = useRef(null)
    const hintRef = useRef(null)
    const hintLabelRef = useRef(null)
    const path0Ref = useRef(null)
    const path1Ref = useRef(null)

    const s = useRef({
        waveProgress: 0,      // actual rendered progress (lerped)
        targetProgress: 0,      // desired progress (from scrollY)
        ptStagger: [],     // fixed random stagger per point
        rafId: null,
        readyToScroll: false,  // true after entry anim completes
        wipeEverDone: false,  // true once wipe-out has hit 1 (fires onComplete)
        overlayHidden: false,  // tracks whether overlay is currently opacity-0
        lastReportedProgress: -1, // tracks last value sent to onProgress
    })

    // ── Wave geometry ─────────────────────────────────────────────────────────
    const computePoints = useCallback((pathIdx, progress) => {
        const { ptStagger } = s.current
        const lead = pathIdx === 0 ? 0.08 : 0
        
        // Push the entire wave down by 15% when at the very top (progress 0)
        // so it rests completely hidden off-screen until the user begins to scroll.
        // It smoothly transitions into a normal wave by progress 0.03.
        const sleepOffset = Math.max(0, (0.03 - progress) / 0.03) * 15

        return Array.from({ length: NUM_POINTS }, (_, j) => {
            const stag   = ptStagger[j]
            const localP = Math.max(0, Math.min(1, (progress + lead - stag) / (1 - 0.08)))
            return 100 - localP * 100 + sleepOffset
        })
    }, [])

    const renderWave = useCallback((progress) => {
        const paths = [path0Ref.current, path1Ref.current]
        paths.forEach((path, i) => {
            if (!path) return
            const pts = computePoints(i, progress)
            const n = pts.length
            let d = `M 0 ${pts[0]} C`
            for (let j = 0; j < n - 1; j++) {
                const p = (j + 1) / (n - 1) * 100
                const cp = p - (1 / (n - 1) * 100) / 2
                d += ` ${cp} ${pts[j]} ${cp} ${pts[j + 1]} ${p} ${pts[j + 1]}`
            }
            d += ` V 100 H 0`
            path.setAttribute('d', d)
        })
    }, [computePoints])

    useEffect(() => {
        const st = s.current
        const container = containerRef.current
        const pinkLayer = pinkLayerRef.current
        const lettersBox = lettersBoxRef.current
        const hint = hintRef.current
        const hintLabel = hintLabelRef.current

        if (!container || !pinkLayer || !lettersBox) return

        // Generate unique stagger offsets for wave shape
        st.ptStagger = Array.from({ length: NUM_POINTS }, () => Math.random() * 0.08)
        renderWave(0)

        // ── Progress reporting ────────────────────────────────────────────────
        // Fires onProgress every time waveProgress changes meaningfully.
        function reportProgress(p) {
            if (!onProgress) return
            // Only report if changed by more than 0.005 to avoid noise
            if (Math.abs(p - st.lastReportedProgress) > 0.005) {
                st.lastReportedProgress = p
                onProgress(p)
            }
        }

        // ── Overlay show / hide ───────────────────────────────────────────────
        function syncOverlayOpacity() {
            const scrolledPast = st.targetProgress >= 0.99
            const waveReady = st.waveProgress >= 0.97

            // Smoothly cross-fade the entire overlay out as the user scrolls
            const fadeStart = 0.2
            const fadeEnd = 0.9
            let currentOpa = 1
            if (st.waveProgress > fadeStart) {
                currentOpa = 1 - Math.min(1, (st.waveProgress - fadeStart) / (fadeEnd - fadeStart))
            }
            container.style.opacity = currentOpa

            if (scrolledPast && waveReady && !st.overlayHidden) {
                // ── Wipe-out complete ──
                st.overlayHidden = true
                container.style.pointerEvents = 'none'

                if (!st.wipeEverDone) {
                    st.wipeEverDone = true
                    requestAnimationFrame(() => {
                        if (window.scrollY > INTRO_SCROLL_HEIGHT) {
                            window.scrollTo({ top: INTRO_SCROLL_HEIGHT, behavior: 'instant' })
                        }
                        onComplete && onComplete()
                    })
                }

            } else if (!scrolledPast && st.overlayHidden) {
                // ── User scrolled back into spacer zone ──
                st.overlayHidden = false
                container.style.pointerEvents = 'auto'
            }
        }

        // ── LERP loop ─────────────────────────────────────────────────────────
        function startRaf() {
            if (st.rafId) return
            function tick() {
                const diff = st.targetProgress - st.waveProgress
                if (Math.abs(diff) < 0.0006) {
                    st.waveProgress = st.targetProgress
                    renderWave(st.waveProgress)
                    reportProgress(st.waveProgress)
                    syncOverlayOpacity()
                    st.rafId = null
                    return
                }
                st.waveProgress += diff * LERP_SPEED
                renderWave(st.waveProgress)
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

        // ── Entry animation ───────────────────────────────────────────────────
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
        tl.to(wrapRef.current, { scale: 1.55, y: '-4vh', duration: 0.7, ease: 'power2.inOut' }, 1.1)
        tl.to(pinkLayer, { backgroundColor: '#0A0A0A', duration: 0.6, ease: 'power2.inOut' }, 1.15)
        tl.to(letterEls, { color: '#0D9E75', duration: 0.4, stagger: 0.04 }, 1.2)
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9999, overflow: 'hidden', opacity: 0,
                background: '#0A0A0A',
            }}
        >
            {/* Dark bg behind — remains as wave wipes upward */}
            <div style={{ position: 'absolute', inset: 0, background: '#0A0A0A', zIndex: 0 }} />

            {/* Pink layer */}
            <div
                ref={pinkLayerRef}
                style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#0D9E75',
                }}
            >
                {/* Scan lines */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)',
                }} />

                {/* Letters */}
                <div ref={wrapRef} style={{ position: 'relative', transformOrigin: 'center center' }}>
                    <div ref={lettersBoxRef} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.8vw, 12px)' }}>
                        {LETTERS.map((letter, li) => (
                            <div key={li} className="intro-letter" style={{
                                position: 'relative',
                                fontSize: 'clamp(70px,13vw,150px)',
                                fontFamily: "'Rubik Mono One', monospace",
                                fontWeight: 400, color: '#0A0A0A', lineHeight: 1,
                                userSelect: 'none', height: '1.05em',
                                flexShrink: 0, overflow: 'hidden',
                            }}>
                                {/* This invisible span dictates the exact natural width for this specific letter */}
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

            {/* Wave SVG — wipes from bottom to top */}
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}
            >
                <defs>
                    <linearGradient id="mi-g0" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#085041" />
                        <stop offset="100%" stopColor="#0A0A0A" />
                    </linearGradient>
                    <linearGradient id="mi-g1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0D9E75" />
                        <stop offset="100%" stopColor="#085041" />
                    </linearGradient>
                </defs>
                <path ref={path0Ref} fill="url(#mi-g0)" />
                <path ref={path1Ref} fill="url(#mi-g1)" />
            </svg>

            {/* Scroll hint */}
            <div ref={hintRef} style={{
                position: 'absolute', bottom: '6vh', left: '50%', transform: 'translateX(-50%)',
                zIndex: 8, opacity: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '7px', pointerEvents: 'none',
            }}>
                <span ref={hintLabelRef} style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: '9px', fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(13,158,117,0.85)',
                }}>Scroll to enter</span>
                <svg width="16" height="22" viewBox="0 0 20 28" fill="none">
                    <rect x="1" y="1" width="18" height="22" rx="9" stroke="rgba(13,158,117,0.4)" strokeWidth="1.5" />
                    <rect x="9" y="5" width="2" height="6" rx="1" fill="rgba(13,158,117,0.85)">
                        <animate attributeName="y" values="5;11;5" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>
        </div>
    )
}   