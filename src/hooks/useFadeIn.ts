import { useEffect, useRef } from 'react'

/**
 * Lightweight fade-in hook using IntersectionObserver.
 * Adds the class `is-visible` to the element when it enters the viewport.
 * Animates only once and respects `prefers-reduced-motion`.
 */
export function useFadeIn<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip animation if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px' // Se activa cuando la sección sube un 20% dentro del viewport
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
