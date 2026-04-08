import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STEPS } from '../data/index.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * LAYOUT — matches lenis.dev reference:
 *
 *   [01]
 *      [02]
 *         [03]
 *            [04]
 *               [05]  ← fully visible, front of deck
 *
 * Cards are positioned with CSS (left / top absolute).
 * GSAP only translates X: card flies in from right → settles at x:0.
 * Section is pinned via ScrollTrigger while all cards reveal.
 * Card 01 reveals FIRST, Card 05 reveals LAST (front of deck).
 *
 * Key fix vs previous version:
 *   - Wrapper is centered with margin:auto, NOT sized to boxW (caused overflow)
 *   - Section clips overflow:hidden so cards enter cleanly from right
 *   - STEP_X / STEP_Y tuned so full deck fits inside ~900px at 1280 viewport
 */

const CARD_W  = 370   // card width  px
const CARD_H  = 360   // card height px
const STEP_X  = 250   // each card shifts right by this
const STEP_Y  = 49    // each card shifts down  by this
const TOTAL   = STEPS.length  // 5

// Full bounding box
const BOX_W = CARD_W + (TOTAL - 1) * STEP_X   // 380 + 440 = 820
const BOX_H = CARD_H + (TOTAL - 1) * STEP_Y   // 380 + 220 = 600

export default function Process() {
  const sectionRef = useRef(null)
  const cardsRef   = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    // Kill stale triggers (React StrictMode runs effects twice)
    ScrollTrigger.getAll()
      .filter(t => t.vars?.id === 'process-pin')
      .forEach(t => t.kill())

    const tl = gsap.timeline({
      scrollTrigger: {
        id:            'process-pin',
        trigger:       section,
        start:         'top top',          // pin when section reaches viewport top
        end:           `+=${TOTAL * 100}%`,// pin for 5 × 100vh of scroll travel
        pin:           true,
        scrub:         1.2,                // smooth scrub tied to scroll
        anticipatePin: 1,
      },
    })

    STEPS.forEach((_, i) => {
      const card = cardsRef.current[i]
      if (!card) return

      // Start: hidden, off-screen to the right
      gsap.set(card, {
        xPercent: 150,   // relative so it works at any viewport width
        opacity:  0,
        zIndex:   i + 1, // card 0 = z:1 (back), card 4 = z:5 (front)
      })

      // Slide into resting position (xPercent → 0 means x:0, natural CSS left)
      // Slot i → card 0 first, card 4 last
      tl.to(
        card,
        {
          xPercent: 0,
          opacity:  1,
          duration: 1,
          ease:     'power2.out',
        },
        i   // timeline position: card 0 at t=0, card 4 at t=4
      )
    })

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.vars?.id === 'process-pin')
        .forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{
        background:    '#F4F1E8',
        minHeight:     '100vh',
        overflow:      'hidden',       // clips cards flying in from right
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent:'center',
        padding:       'clamp(40px,6vw,80px) clamp(16px,4vw,48px)',
      }}
    >
      {/* ── Heading block ── */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,4vw,56px)', width: '100%' }}>
        <h2
          className="font-display font-extrabold text-[#0A0A0A]"
          style={{
            fontSize:      'clamp(28px,3.5vw,48px)',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
            marginBottom:  12,
          }}
        >
          How we work
        </h2>
        <p
          style={{
            color:          '#8A8880',
            fontSize:       11,
            fontWeight:     400,
            letterSpacing:  '0.12em',
            textTransform:  'uppercase',
          }}
        >
          Scroll to reveal each step ↓
        </p>
      </div>

      {/*
        ── Card stack wrapper ──
        Fixed size (BOX_W × BOX_H) centered with margin auto.
        All cards are position:absolute inside it.
        Card i sits at left: i*STEP_X, top: i*STEP_Y.
        GSAP animates xPercent: 150 → 0 so each card slides into that spot.
      */}
      <div
        style={{
          position: 'relative',
          width:    BOX_W,
          height:   BOX_H,
          // Center the stack — it overflows the left edge slightly on small screens,
          // but section overflow:hidden + x-scroll disabled in body handles this.
          margin:   '0 auto',
          flexShrink: 0,
        }}
      >
        {STEPS.map((step, i) => (
          <div
            key={i}
            ref={el => (cardsRef.current[i] = el)}
            style={{
              position:   'absolute',
              left:       i * STEP_X,
              top:        i * STEP_Y,
              width:      CARD_W,
              height:     CARD_H,
              background: '#FAFAF7',
              border:     '1.5px solid rgba(10,10,10,0.13)',
              boxShadow:  '0 4px 32px rgba(10,10,10,0.06)',
              willChange: 'transform, opacity',
            }}
          >
            {/* ── Large teal number — top-left ── */}
            <span
              className="font-display font-extrabold select-none"
              style={{
                position:      'absolute',
                top:           22,
                left:          26,
                fontSize:      'clamp(60px,7vw,92px)',
                lineHeight:    1,
                color:         '#0D9E75',
                letterSpacing: '-0.04em',
              }}
            >
              {step.num}
            </span>

            {/* ── Title + desc — bottom-left ── */}
            <div
              style={{
                position: 'absolute',
                bottom:   26,
                left:     26,
                right:    26,
              }}
            >
              <p
                className="font-display font-extrabold uppercase text-[#0A0A0A]"
                style={{
                  fontSize:      'clamp(13px,1.6vw,20px)',
                  letterSpacing: '-0.01em',
                  lineHeight:    1.05,
                  marginBottom:  7,
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  fontSize:   12,
                  color:      '#8A8880',
                  fontWeight: 300,
                  lineHeight: 1.65,
                }}
              >
                {step.desc}
              </p>
            </div>

            {/* ── Progress dots — bottom-right ── */}
            <div
              style={{
                position: 'absolute',
                bottom:   26,
                right:    26,
                display:  'flex',
                gap:      5,
              }}
            >
              {/* {STEPS.map((_, di) => (
                <div
                  key={di}
                  style={{
                    width:           6,
                    height:          6,
                    borderRadius:    '50%',
                    backgroundColor: di === i
                      ? '#0D9E75'
                      : 'rgba(10,10,10,0.12)',
                    transition: 'background-color 0.3s',
                  }}
                />
              ))} */}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}