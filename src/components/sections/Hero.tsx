import { useEffect, useRef, useCallback } from 'react'
import { heroContent, personalInfo } from '../../data/personal'
import { skills } from '../../data/skills'
import { asset } from '../../utils/asset'
import { MagneticButton } from '../ui/MagneticButton'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'

import { SectionAtmosphere } from '../ui/SectionAtmosphere'

export function Hero() {
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  const bottomTechs = skills.filter(s => ['react', 'dotnet', 'sqlserver', 'supabase', 'git'].includes(s.id))

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

      tl.fromTo('.hero-badge-top',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.1 }
      )
        .fromTo('.hero-text h1',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 }, '-=0.4'
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
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.2)' }, '-=0.8'
        )
        .fromTo('.neon-ring',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.5 }, '-=1'
        )
        .fromTo('.floating-badge',
          { y: 20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 }, '-=0.8'
        )
        .fromTo('.tech-container',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }, '-=0.4'
        )
        .fromTo('.stats-container',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }, '-=0.6'
        )

      // Float animations
      const isMobile = window.innerWidth <= 768;
      const f1 = isMobile ? -4 : -10;
      const f2 = isMobile ? -6 : -15;
      const f3 = isMobile ? -5 : -12;
      const f4 = isMobile ? -3 : -8;

      gsap.to('.floating-badge.badge-1', { y: f1, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0 })
      gsap.to('.floating-badge.badge-2', { y: f2, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 })
      gsap.to('.floating-badge.badge-3', { y: f3, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 })
      gsap.to('.floating-badge.badge-4', { y: f4, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 })

    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="inicio" ref={sectionRef} className="hero">
      <SectionAtmosphere variant="hero" />
      <div className="container">
        <div className="hero-grid">
          <div className="hero-badge-top">
            INGENIERO DE SOFTWARE
          </div>

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
                Hablemos de tu proyecto <span style={{ marginLeft: '8px' }}>→</span>
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

            <div className="tech-container">
              <span className="tech-label">TECNOLOGÍAS CON LAS QUE TRABAJO</span>
              <div className="tech-logos">
                {bottomTechs.map(tech => (
                  <div key={tech.id} className="tech-logo-item">
                    <img src={asset(tech.icon)} alt={tech.name} />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-right-col">
            <div className="hero-img-wrapper">
              <div className="hero-img">
                <div className="neon-ring"></div>
                <img src={asset('/assets/images/hero-profile-nobg.png')} alt="Claudio Natanael Beltre" />

                <div className="floating-badge badge-1 glass-panel">
                  <div className="badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                  </div>
                  <div className="badge-info">
                    <strong>Backend</strong>
                    <span className="badge-subtext"><span className="status-dot" style={{ backgroundColor: '#10b981' }}></span> APIs robustas</span>
                  </div>
                </div>
                <div className="floating-badge badge-2 glass-panel">
                  <div className="badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div className="badge-info">
                    <strong>Frontend</strong>
                    <span className="badge-subtext"><span className="status-dot" style={{ backgroundColor: '#3b82f6' }}></span> UI/UX intuitivas</span>
                  </div>
                </div>
                <div className="floating-badge badge-3 glass-panel">
                  <div className="badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 12 12 17 22 12"></polyline>
                      <polyline points="2 17 12 22 22 17"></polyline>
                    </svg>
                  </div>
                  <div className="badge-info">
                    <strong>Arquitectura</strong>
                    <span className="badge-subtext"><span className="status-dot" style={{ backgroundColor: '#a855f7' }}></span> Escalable</span>
                  </div>
                </div>
                <div className="floating-badge badge-4 glass-panel">
                  <div className="badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                      <rect x="9" y="9" width="6" height="6"></rect>
                      <line x1="9" y1="1" x2="9" y2="4"></line>
                      <line x1="15" y1="1" x2="15" y2="4"></line>
                      <line x1="9" y1="20" x2="9" y2="23"></line>
                      <line x1="15" y1="20" x2="15" y2="23"></line>
                      <line x1="20" y1="9" x2="23" y2="9"></line>
                      <line x1="20" y1="14" x2="23" y2="14"></line>
                      <line x1="1" y1="9" x2="4" y2="9"></line>
                      <line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                  </div>
                  <div className="badge-info">
                    <strong>IA & Agents</strong>
                    <span className="badge-subtext"><span className="status-dot" style={{ backgroundColor: '#f59e0b' }}></span> Soluciones inteligentes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-container glass-panel">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Commits este año</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Proyectos completados</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Compromiso</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
