import { useState, useCallback, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Why from './components/Why.jsx'
import Testimonials from './components/Testimonials.jsx'
import FAQ from './components/FAQ.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import Modal from './components/Modal.jsx'
import ThankYou from './components/ThankYou.jsx'
import MaayaIntro, { INTRO_SCROLL_HEIGHT } from './components/MaayaIntro.jsx'
import WebGLDisplacementLayer from './components/WebGLDisplacementLayer.jsx'

/**
 * ── Unified scroll architecture ───────────────────────────────────────────
 *
 * The page has ONE scroll axis shared by both the intro and the hero:
 *
 *   scrollY = 0 … INTRO_SCROLL_HEIGHT   →  intro overlay visible, wave animates
 *   scrollY ≥ INTRO_SCROLL_HEIGHT       →  hero & rest of page shown
 *
 * Hero fade-in behaviour:
 *   - waveProgress < 0.5  → hero invisible (opacity 0, pointer-events none)
 *   - waveProgress 0.5→1  → hero fades in (opacity 0 → 1) through the wave
 *   - waveProgress = 1    → hero fully visible, scroll unlocked
 *
 * Scroll lock:
 *   - After the wipe-out completes (heroReady = true), the page snaps to
 *     INTRO_SCROLL_HEIGHT and briefly prevents over-scrolling so the user
 *     "lands" on the hero cleanly before being free to scroll further.
 * ──────────────────────────────────────────────────────────────────────────
 */

// waveProgress threshold at which hero starts fading in
const HERO_FADE_START = 0.2
const HERO_FADE_END = 0.9

export default function App() {
  // heroReady: true once wipe-out completes for the first time
  const [heroReady, setHeroReady] = useState(false)

  // heroOpacity: driven by waveProgress, starts fading at HERO_FADE_START
  const [heroOpacity, setHeroOpacity] = useState(0)

  // scrollLocked: briefly true after wipe-out to let hero settle
  const scrollLockRef = useRef(false)
  const scrollLockTimerRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  // ── WebGL section displacement ────────────────────────────────────────────
  // activeSectionId changes every time a new section enters the viewport,
  // triggering a ripple burst in WebGLDisplacementLayer.
  const [activeSectionId, setActiveSectionId] = useState(null)
  // Stable ref so the IO callback always has the current heroReady value
  const heroReadyRef = useRef(false)

  // ── Progress handler — called every frame from MaayaIntro ────────────────
  // Drives the hero opacity proportionally from HERO_FADE_START → HERO_FADE_END
  const handleProgress = useCallback((progress) => {
    if (progress < HERO_FADE_START) {
      setHeroOpacity(0)
    } else if (progress > HERO_FADE_END) {
      setHeroOpacity(1)
    } else {
      const t = (progress - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START)
      setHeroOpacity(t)
    }
  }, [])

  // ── Complete handler — wipe-out first reached 100% ────────────────────────
  // Locks scroll momentarily so user lands cleanly on hero.
  const handleComplete = useCallback(() => {
    setHeroReady(true)
    setHeroOpacity(1)

    // Briefly lock scroll position at the hero boundary
    if (!scrollLockRef.current) {
      scrollLockRef.current = true

      // Snap to exact boundary position
      window.scrollTo({ top: INTRO_SCROLL_HEIGHT, behavior: 'instant' })

      // Prevent scroll for a short window so the hero entrance feels intentional
      const lockHandler = (e) => {
        // Allow scrolling DOWN only after a short grace period
        e.preventDefault()
      }

      window.addEventListener('wheel', lockHandler, { passive: false })
      window.addEventListener('touchmove', lockHandler, { passive: false })

      scrollLockTimerRef.current = setTimeout(() => {
        window.removeEventListener('wheel', lockHandler)
        window.removeEventListener('touchmove', lockHandler)
        scrollLockRef.current = false
      }, 600) // 600ms grace window — enough to feel intentional, short enough not to frustrate
    }
  }, [])

  // Sync heroReadyRef whenever heroReady changes
  useEffect(() => { heroReadyRef.current = heroReady }, [heroReady])

  // ── IntersectionObserver — fires WebGL ripple on each section entry ────────
  // Only activates after the intro wipe-out completes (heroReady = true).
  // threshold: 0.22 fires when ~22% of the section is in view, giving a
  // slightly-early trigger that feels natural while scrolling at normal speed.
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!heroReadyRef.current) return          // skip during intro
          if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
            // Append timestamp to force re-trigger if same section re-enters
            setActiveSectionId(`${entry.target.id}-${Date.now()}`)
          }
        })
      },
      { threshold: [0.18] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])   // mount-once; heroReadyRef is a stable mutable ref

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = () => {
    closeModal()
    setShowThankYou(true)
    window.scrollTo(0, 0)
  }

  const handleReturn = () => {
    setShowThankYou(false)
    window.scrollTo(0, 0)
  }

  if (showThankYou) {
    return <ThankYou onReturn={handleReturn} />
  }

  return (
    <>
      {/* ── WebGL displacement ripple — fires on each section entry ─────── */}
      {/* Fixed, pointer-events:none, mix-blend-mode:screen.                  */}
      {/* Must sit below the intro overlay (z=9999) so it doesn't obscure it */}
      <WebGLDisplacementLayer activeSectionId={activeSectionId} />

      {/* ── Fixed intro overlay ─────────────────────────────────────────── */}
      {/* Always mounted. Self-manages opacity via scrollY. */}
      <MaayaIntro
        onComplete={handleComplete}
        onProgress={handleProgress}
      />

      {/* ── Scroll spacer ───────────────────────────────────────────────── */}
      {/*
        This div is the "scroll track" for the intro.
        The intro overlay (position:fixed) sits on top of it.
        Scrolling through this spacer drives the wave animation.
        The hero section begins below it in normal document flow.
      */}
      <div style={{ height: INTRO_SCROLL_HEIGHT }} aria-hidden="true" />

      {/* ── Main page content ───────────────────────────────────────────── */}
      {/*
        Rendered in normal document flow, starting at the bottom of the spacer.

        Hero fade-in:
          - opacity driven by waveProgress via heroOpacity (0 → 1 from 50% wave)
          - visibility:hidden until wave starts (heroOpacity = 0) prevents
            GSAP animations firing on hidden content
          - pointer-events:none until heroReady so overlay still captures clicks

        Scroll lock:
          - After wipe-out completes, the page is briefly locked so the hero
            enters cleanly rather than the user flying past it.
      */}
      <div
        style={{
          // Show/hide: use visibility so layout is preserved but GSAP doesn't
          // animate invisible elements before the wave reveals them
          visibility: heroOpacity > 0 ? 'visible' : 'hidden',

          // Smooth fade — driven by waveProgress from 50% onward
          opacity: heroOpacity,

          // Smooth CSS transition for the opacity change (supplement GSAP-driven hero anims)
          transition: heroOpacity > 0 && heroOpacity < 1
            ? 'opacity 0.08s linear'  // tight during wave scrub
            : heroReady
              ? 'opacity 0.5s ease'   // smooth settle when done
              : 'none',

          // Block clicks until the overlay is fully gone
          pointerEvents: heroReady ? 'auto' : 'none',
        }}
      >
        <Navbar onOpenModal={openModal} />

        <main>
          <Hero onOpenModal={openModal} heroReady={heroReady} />
          <Services onOpenModal={openModal} />
          <Process />
          <Why onOpenModal={openModal} />
          <Testimonials />
          <FAQ />
          <FinalCTA onOpenModal={openModal} />
        </main>

        <Footer />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}