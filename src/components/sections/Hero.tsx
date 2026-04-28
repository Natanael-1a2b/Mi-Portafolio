import { useEffect, useRef, useCallback } from 'react'
import { heroContent, personalInfo } from '../../data/personal'
import { MagneticButton } from '../ui/MagneticButton'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'

export function Hero() {
  const subtitleRef = useRef<HTMLSpanElement>(null)
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

  return (
    <section id="inicio" className="hero">
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
              <MagneticButton as="a" className="btn btn-primary" href="#contacto">
                Contáctame
              </MagneticButton>
              <MagneticButton
                as="a"
                className="btn btn-outline"
                href={personalInfo.cvPath}
                download
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
            <img src={personalInfo.profileImage} alt="Claudio Natanael Beltre" />
          </div>
        </div>
      </div>
    </section>
  )
}
