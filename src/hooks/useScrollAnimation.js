import { useEffect } from 'react'

/**
 * A lightweight hook that uses IntersectionObserver to add the
 * 'visible' class to elements matching the given selector once
 * they enter the viewport.
 */
export function useScrollAnimation(selector, threshold = 0.12) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold }
    )

    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [selector, threshold])
}
