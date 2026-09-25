import { useEffect, useMemo, useRef, useState } from 'react'
import { experiences } from '../../data/experience'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../../utils/asset'
import { skills } from '../../data/skills'
import { LiveBadge } from '../ui/LiveBadge'
import { SectionTitle } from '../ui/SectionTitle'

gsap.registerPlugin(ScrollTrigger)

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const MONTHS_SHORT = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const MONTHS_CAP = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

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

function techIcon(tech: string) {
  const s = findSkillByName(tech)
  return techIconMap[tech.toLowerCase()] || (s && s.iconType === 'local' ? asset(s.icon) : s?.icon)
}

const isCurrent = (end: string) => end.toLowerCase().includes('actual')

/** "Marzo 2026" -> índice absoluto de mes (año*12 + mes). "Actualidad" -> mes actual. */
function toMonthIndex(date: string): number {
  if (isCurrent(date)) {
    const now = new Date()
    return now.getFullYear() * 12 + now.getMonth()
  }
  const [m, y] = date.toLowerCase().split(' ')
  return (parseInt(y) || new Date().getFullYear()) * 12 + Math.max(0, MONTHS.indexOf(m))
}

const fmtShort = (idx: number) => `${MONTHS_CAP[idx % 12]} ${Math.floor(idx / 12)}`

function durationText(start: number, end: number) {
  const total = end - start + 1
  return total <= 1 ? '1 mes' : `${total} meses`
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
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(experiences.map((e, i) => [e.id, i === 0]))
  )
  const toggle = (id: string) => setOpen(o => ({ ...o, [id]: !o[id] }))

  const timeline = useMemo(() => {
    const items = experiences.map(exp => {
      const start = toMonthIndex(exp.startDate)
      const end = toMonthIndex(exp.endDate)
      return { exp, start, end, current: isCurrent(exp.endDate), duration: durationText(start, end) }
    })
    const minYear = Math.floor(Math.min(...items.map(i => i.start)) / 12)
    const maxYear = Math.floor(Math.max(...items.map(i => i.end)) / 12)
    const origin = minYear * 12
    const totalCols = (maxYear - minYear + 1) * 12
    const now = new Date()
    const todayPct = ((now.getFullYear() * 12 + now.getMonth() - origin + now.getDate() / 31) / totalCols) * 100

    // Primer tramo donde dos roles coinciden
    let overlap: string | null = null
    for (let a = 0; a < items.length && !overlap; a++) {
      for (let b = a + 1; b < items.length && !overlap; b++) {
        const s = Math.max(items[a].start, items[b].start)
        const e = Math.min(items[a].end, items[b].end)
        if (s <= e) overlap = `${MONTHS_CAP[s % 12]} – ${fmtShort(e)}: roles en paralelo`
      }
    }

    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
    return { items, origin, totalCols, todayPct, overlap, years }
  }, [])

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.xp-bar', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.xp-gantt', start: 'top 80%' },
      })
      gsap.from('.xp-today', {
        opacity: 0,
        duration: 0.4,
        delay: 0.5,
        scrollTrigger: { trigger: '.xp-gantt', start: 'top 80%' },
      })
      gsap.utils.toArray<HTMLElement>('.xp-row').forEach(row => {
        gsap.from(row, {
          opacity: 0,
          y: 24,
          duration: 0.45,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const { items, origin, totalCols, todayPct, overlap, years } = timeline

  return (
    <section id="experiencia" ref={sectionRef} className="experience-section section-alt" style={{ position: 'relative' }}>
      <SectionAtmosphere />
      <div className="container">
        <SectionTitle
          badge="TRAYECTORIA"
          title="Experiencia "
          gradientTitle="Laboral"
          subtitle="Mi trayectoria profesional."
        />

        <div className="xp-wrap">
          {/* Cronología */}
          <div className="xp-gantt glass-card">
            <div className="xp-gantt-head">
              <span className="exp-section-label">Línea de tiempo · {years.join(' – ')}</span>
              {overlap && <span className="xp-gantt-note">{overlap}</span>}
            </div>

            <div className="xp-gantt-body" style={{ ['--cols' as string]: totalCols }}>
              <div className="xp-months">
                {Array.from({ length: totalCols }, (_, i) => (
                  <span key={i} className={i % 12 === 0 && years.length > 1 ? 'is-year' : ''}>
                    {i % 12 === 0 && years.length > 1 ? `${MONTHS_SHORT[0]} ${origin / 12 + i / 12}` : MONTHS_SHORT[i % 12]}
                  </span>
                ))}
              </div>

              <div className="xp-tracks">
                {items.map(({ exp, start, end, current, duration }) => (
                  <div className="xp-track" key={exp.id}>
                    <button
                      type="button"
                      className={`xp-bar ${exp.id === 'spn-software' ? 'is-purple' : ''} ${current ? 'is-current' : ''}`}
                      style={{ gridColumn: `${start - origin + 1} / ${end - origin + 2}` }}
                      onClick={() => toggle(exp.id)}
                      aria-controls={`xp-panel-${exp.id}`}
                      aria-expanded={!!open[exp.id]}
                    >
                      <img src={asset(exp.logo || '')} alt="" />
                      <span className="xp-bar-name">{exp.company.match(/\(([^)]+)\)/)?.[1] ?? exp.company}</span>
                      <span className="xp-bar-dur">· {duration}</span>
                    </button>
                  </div>
                ))}
                <div className="xp-today" style={{ left: `${todayPct}%` }} aria-hidden="true" />
              </div>
              <span className="xp-today-label" style={{ left: `${todayPct}%` }} aria-hidden="true">HOY</span>
            </div>
          </div>

          {/* Acordeón */}
          {items.map(({ exp, start, end, current, duration }) => {
            const isOpen = !!open[exp.id]
            const purple = exp.id === 'spn-software'
            return (
              <div key={exp.id} className={`xp-row glass-card ${purple ? 'is-purple' : ''} ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="xp-row-head"
                  onClick={() => toggle(exp.id)}
                  aria-expanded={isOpen}
                  aria-controls={`xp-panel-${exp.id}`}
                >
                  <span className="xp-row-date">
                    <span className="xp-row-range">{fmtShort(start)} — {current ? 'Actualidad' : fmtShort(end)}</span>
                    {current ? <LiveBadge /> : <span className="badge-status badge-duration">{duration}</span>}
                  </span>

                  <span className="xp-row-title">
                    <img src={asset(exp.logo || '')} alt={exp.company} className="exp-logo" />
                    <span className="xp-row-text">
                      <span className="xp-row-position">{exp.position}</span>
                      <span className="xp-row-company">{exp.company}</span>
                    </span>
                  </span>

                  <span className="xp-row-techs" aria-hidden="true">
                    {exp.technologies.map(t => {
                      const src = techIcon(t)
                      return src ? <img key={t} src={src} alt="" title={t} /> : null
                    })}
                  </span>

                  <span className="xp-chevron" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                <div className="xp-panel" id={`xp-panel-${exp.id}`} role="region" aria-hidden={!isOpen}>
                  <div className="xp-panel-inner">
                    <div className="xp-panel-grid">
                      <div className="xp-panel-main">
                        <p className="xp-desc">{exp.description}</p>

                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="exp-highlights">
                            {exp.highlights.map(h => (
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
                        )}

                        <div className="xp-chips">
                          {exp.technologies.map(t => {
                            const src = techIcon(t)
                            return (
                              <span className="xp-chip" key={t}>
                                {src && <img src={src} alt="" width={16} height={16} />}
                                {t}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="xp-metrics">
                          {exp.metrics.map(m => (
                            <div key={m.id} className="xp-metric">
                              {m.icon && <span className="metric-icon"><MetricIcon icon={m.icon} /></span>}
                              <span className="metric-label">{m.label}</span>
                              <span className="metric-value">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
