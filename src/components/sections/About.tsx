import { useEffect, useRef, type ReactNode } from 'react'
import { aboutContent, personalInfo } from '../../data/personal'
import { SectionTitle } from '../ui/SectionTitle'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface InfoItem {
  label: string
  value: string
  href?: string
  external?: boolean
  icon: ReactNode
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top 85%',
        },
      })

      tl.fromTo(
        '.about-left',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
      )
        .fromTo(
          '.about-timeline-item',
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
          '-=0.3',
        )
        .fromTo(
          '.about-right',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
          '-=0.35',
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const infoItems: InfoItem[] = [
    {
      label: 'Nombre',
      value: personalInfo.name,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: 'Teléfono',
      value: personalInfo.phone,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L8.09 9.63a16 16 0 0 0 6.28 6.28l1.19-1.19a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      value: 'Ver Perfil Profesional',
      href: personalInfo.linkedIn,
      external: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.64h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.08V21h-4v-5.62c0-1.34-.03-3.07-1.87-3.07-1.88 0-2.17 1.46-2.17 2.97V21h-4V9z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      value: 'Ver Repositorios',
      href: personalInfo.github,
      external: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.08 1.83 2.82 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.46c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 12 .5z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="sobre-mi" ref={sectionRef} className="section-alt about-section premium-glass">
      {/* 1. Fondo & Atmósfera */}
      <SectionAtmosphere />

      <div className="container">
        {/* 2. Título Principal con Halo */}
        <div className="about-title-wrapper">
          <div className="title-halo"></div>
          <SectionTitle 
            badge="CONÓCEME"
            title="Sobre "
            gradientTitle="Mí"
            subtitle="Un poco de mi historia y mi pasión por el código."
          />
        </div>
        <div className="about-grid">
          <div className="about-left">
            <div className="about-timeline">
              {aboutContent.paragraphs.map((p, i) => (
                <div className="about-timeline-item" key={i}>
                  <span className="about-timeline-dot" aria-hidden="true"></span>
                  <p dangerouslySetInnerHTML={{ __html: p }} />
                </div>
              ))}
            </div>
          </div>

          <div className="about-right">
            <div className="info-card">
              <div className="info-card-glow" aria-hidden="true"></div>
              <div className="info-card-header">
                <div className="info-card-avatar" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3>Información Personal</h3>
                  <span className="info-card-rule" aria-hidden="true"></span>
                </div>
              </div>

              <div className="info-list">
                {infoItems.map(item => (
                  <div className="info-item" key={item.label}>
                    <span className="info-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div className="info-content">
                      <strong>{item.label}:</strong>
                      {item.href ? (
                        <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
                          {item.value}
                        </a>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
