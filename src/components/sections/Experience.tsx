import { useEffect, useRef } from 'react'
import { experiences } from '../../data/experience'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../../utils/asset'
import { skills } from '../../data/skills'
import { LiveBadge } from '../ui/LiveBadge'

gsap.registerPlugin(ScrollTrigger)

function findSkillByName(name: string) {
  const n = name.toLowerCase()
  return skills.find(s =>
    s.name.toLowerCase() === n ||
    s.id.toLowerCase() === n ||
    s.name.toLowerCase().includes(n)
  )
}

const techIconMap: Record<string, string> = {
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
}

function getDurationText(startDate: string, endDate: string): string {
  if (endDate.toLowerCase().includes('actual')) return 'Actual'
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const startParts = startDate.toLowerCase().split(' ')
  const endParts = endDate.toLowerCase().split(' ')
  const startMonth = months.indexOf(startParts[0]) + 1
  const startYear = parseInt(startParts[1]) || 2026
  const endMonth = months.indexOf(endParts[0]) + 1
  const endYear = parseInt(endParts[1]) || 2026
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1
  if (totalMonths <= 1) return '1 mes'
  return `${totalMonths} meses`
}

function MetricIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'users':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'layers':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 12 12 17 22 12" />
          <polyline points="2 17 12 22 22 17" />
        </svg>
      )
    case 'check-circle':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    default:
      return null
  }
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.timeline-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.timeline', start: 'top 80%' },
      })
      gsap.utils.toArray<HTMLElement>('.timeline-entry').forEach((entry, i) => {
        gsap.from(entry, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          y: 20,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: entry, start: 'top 85%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('.timeline-dot').forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.4,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: dot, start: 'top 85%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="experiencia" ref={sectionRef} className="experience-section section-alt" style={{ position: 'relative' }}>
      <SectionAtmosphere variant="dark" withDots={true} glowPosition="split" particles={5} />
      <div className="container">
        {/* Title */}
        <div className="exp-title-wrapper">
          <div className="exp-title-badge">TRAYECTORIA</div>
          <h2 className="exp-section-title">
            Experiencia <span className="exp-title-gradient">Laboral</span>
          </h2>
          <p className="exp-subtitle">Mi trayectoria profesional.</p>
        </div>

        <div className="timeline">
          <div className="timeline-line" />
          {experiences.map((exp, i) => (
            <div key={exp.id} className={`timeline-entry ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}>
              <div className="timeline-dot" />
              <div className={`timeline-connector ${i % 2 === 0 ? 'connector-right' : 'connector-left'}`} />
              
              <div className={`timeline-card glass-card ${exp.id === 'spn-software' ? 'card-purple' : ''}`}>
                {/* Date Row */}
                <div className="exp-date-row">
                  <span className="exp-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {exp.startDate} — {exp.endDate}
                  </span>
                  {exp.endDate.toLowerCase().includes('actual') ? (
                    <LiveBadge />
                  ) : (
                    <span className="badge-status badge-duration">
                      {getDurationText(exp.startDate, exp.endDate)}
                    </span>
                  )}
                </div>

                {/* Header: Logo + Company */}
                <div className="exp-header">
                  <img src={asset(exp.logo || '')} alt={`${exp.company}`} className="exp-logo" />
                  <div className="exp-header-content">
                    <h3 className="exp-company">{exp.company}</h3>
                    <p className="exp-position">{exp.position}</p>
                  </div>
                </div>

                {/* Highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="exp-section">
                    <ul className="exp-highlights">
                      {exp.highlights.map((h) => (
                        <li key={h}>
                          <span className="hl-check">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                <div className="exp-section">
                  <span className="exp-section-label">Tecnologías</span>
                  <div className="exp-techs">
                    {exp.technologies.map((tech) => {
                      const s = findSkillByName(tech)
                      const iconSrc = techIconMap[tech.toLowerCase()] || (s && s.iconType === 'local' ? asset(s.icon) : s?.icon)
                      return (
                        <div className="tech-logo-item" key={tech}>
                          {iconSrc && <img src={iconSrc} alt={tech} width={22} height={22} />}
                          <span>{tech}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Metrics */}
                {exp.metrics && exp.metrics.length > 0 && (
                  <div className="exp-section">
                    <div className="exp-metrics-row">
                      {exp.metrics.map((m, idx) => (
                        <div key={m.id} className="metric-item">
                          {m.icon && (
                            <span className="metric-icon">
                              <MetricIcon icon={m.icon} />
                            </span>
                          )}
                          <div className="metric-text">
                            <span className="metric-value">{m.value}</span>
                            <span className="metric-label">{m.label}</span>
                          </div>
                          {idx < exp.metrics!.length - 1 && <span className="metric-divider" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}

