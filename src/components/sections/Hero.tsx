import { useEffect, useRef, useCallback } from 'react'
import { heroContent, personalInfo } from '../../data/personal'
import { asset } from '../../utils/asset'
import { MagneticButton } from '../ui/MagneticButton'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'

export function Hero() {
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  const runTypingEffect = useCallback(() => {
    if (prefersReduced || !subtitleRef.current) return

    const phrases = heroContent.typingPhrases
    let phraseIdx = 0
    let charIdx = 0
    let isDeleting = false
    let timeout: ReturnType<typeof setTimeout>

    const type = () => {
      const current = phrases[phraseIdx]
      if (!subtitleRef.current) return

      if (!isDeleting) {
        subtitleRef.current.textContent = current.slice(0, charIdx + 1)
        charIdx++
        if (charIdx === current.length) {
          isDeleting = true
          timeout = setTimeout(type, 2000)
          return
        }
        timeout = setTimeout(type, 60)
      } else {
        subtitleRef.current.textContent = current.slice(0, charIdx - 1)
        charIdx--
        if (charIdx === 0) {
          isDeleting = false
          phraseIdx = (phraseIdx + 1) % phrases.length
          timeout = setTimeout(type, 400)
          return
        }
        timeout = setTimeout(type, 30)
      }
    }

    timeout = setTimeout(type, 500)
    return () => clearTimeout(timeout)
  }, [prefersReduced])

  useEffect(() => {
    const cleanup = runTypingEffect()
    return cleanup
  }, [runTypingEffect])

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.fromTo('.hero-text h1', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, delay: 0.1 }
      )
      .fromTo('.subtitle', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6 }, '-=0.6'
      )
      .fromTo('.hero-text p', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, '-=0.4'
      )
      .fromTo('.hero-btns a', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, '-=0.6'
      )
      .fromTo('.hero-img', 
        { scale: 0.85, opacity: 0, rotation: -3 }, 
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.2)' }, '-=0.8'
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="inicio" ref={sectionRef} className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <h1>
              {heroContent.title}{' '}
              <span className="highlight">{heroContent.titleHighlight}</span>
            </h1>
            <div className="subtitle">
              {prefersReduced ? (
                heroContent.subtitle
              ) : (
                <>
                  <span ref={subtitleRef}></span>
                  <span className="typing-cursor" />
                </>
              )}
            </div>
            <p>{heroContent.description}</p>
            <div className="hero-btns">
              <MagneticButton as="a" className="btn btn-primary" href="#contacto" strength={0.1}>
                Contáctame
              </MagneticButton>
              <MagneticButton
                as="a"
                className="btn btn-outline"
                href={asset(personalInfo.cvPath)}
                download
                strength={0.1}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
                Descargar CV
              </MagneticButton>
            </div>
          </div>
          <div className="hero-img">
            <img src={asset(personalInfo.profileImage)} alt="Claudio Natanael Beltre" />
          </div>
        </div>
      </div>
    </section>
  )
}
