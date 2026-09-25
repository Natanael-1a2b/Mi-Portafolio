import { useMemo, useState } from 'react'
import { experiences } from '../../data/experience'
import { skills } from '../../data/skills'
import { asset } from '../../utils/asset'
import { SectionTitle } from '../ui/SectionTitle'
import { LiveBadge } from '../ui/LiveBadge'
import { useFadeIn } from '../../hooks/useFadeIn'

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const MONTHS_CAP = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTHS_INITIAL = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

const techIconMap: Record<string, string> = {
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
}

function techIcon(tech: string) {
  const n = tech.toLowerCase()
  const s = skills.find(s => s.name.toLowerCase() === n || s.id.toLowerCase() === n || s.name.toLowerCase().includes(n))
  return techIconMap[n] || (s && s.iconType === 'local' ? asset(s.icon) : s?.icon)
}

const isCurrent = (end: string) => end.toLowerCase().includes('actual')

function toMonthIndex(date: string): number {
  if (isCurrent(date)) {
    const now = new Date()
    return now.getFullYear() * 12 + now.getMonth()
  }
  const [m, y] = date.toLowerCase().split(' ')
  return (parseInt(y) || new Date().getFullYear()) * 12 + Math.max(0, MONTHS.indexOf(m))
}

const fmtShort = (idx: number) => `${MONTHS_CAP[idx % 12]} ${Math.floor(idx / 12)}`
const shortName = (company: string) => company.match(/\(([^)]+)\)/)?.[1] ?? company

export function MobileExperience() {
  const ref = useFadeIn<HTMLElement>()
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(experiences.map((e, i) => [e.id, i === 0]))
  )
  const toggle = (id: string) => setOpen(o => ({ ...o, [id]: !o[id] }))

  const data = useMemo(() => {
    const items = experiences.map(exp => {
      const start = toMonthIndex(exp.startDate)
      const end = toMonthIndex(exp.endDate)
      const total = end - start + 1
      return { exp, start, end, current: isCurrent(exp.endDate), duration: total <= 1 ? '1 mes' : `${total} meses` }
    })
    // En móvil mostramos solo el año más reciente para que quepa sin scroll
    const year = Math.floor(Math.max(...items.map(i => i.end)) / 12)
    const origin = year * 12
    const now = new Date()
    const todayPct = now.getFullYear() === year
      ? ((now.getMonth() + now.getDate() / 31) / 12) * 100
      : null

    let overlap: string | null = null
    for (let a = 0; a < items.length && !overlap; a++) {
      for (let b = a + 1; b < items.length && !overlap; b++) {
        const s = Math.max(items[a].start, items[b].start)
        const e = Math.min(items[a].end, items[b].end)
        if (s <= e) overlap = `${MONTHS_CAP[s % 12]} – ${MONTHS_CAP[e % 12]} en paralelo`
      }
    }
    return { items, year, origin, todayPct, overlap }
  }, [])

  const { items, year, origin, todayPct, overlap } = data

  return (
    <section id="experiencia" className="mobile-section mobile-experience mobile-fade-in" ref={ref}>
      <div className="mobile-container">
        <SectionTitle badge="TRAYECTORIA" title="Experiencia " gradientTitle="Laboral" />

        <div className="mxp">
          {/* Cronología */}
          <div className="mxp-gantt">
            <div className="mxp-gantt-head">
              <span className="mxp-label">{year}</span>
              {overlap && (
                <span className="mxp-overlap">
                  <span className="mxp-overlap-swatch" aria-hidden="true" />
                  {overlap}
                </span>
              )}
            </div>

            <div className="mxp-gantt-body">
              <div className="mxp-months" aria-hidden="true">
                {MONTHS_INITIAL.map((m, i) => <span key={i}>{m}</span>)}
              </div>

              <div className="mxp-tracks">
                {items.map(({ exp, start, end, duration }) => {
                  const s = Math.max(start, origin) - origin + 1
                  const e = Math.min(end, origin + 11) - origin + 2
                  if (e <= 1) return null
                  return (
                    <div className="mxp-track" key={exp.id}>
                      <button
                        type="button"
                        className={`mxp-bar ${exp.accent === 'purple' ? 'is-purple' : ''} ${isCurrent(exp.endDate) ? 'is-current' : ''}`}
                        style={{ gridColumn: `${s} / ${e}` }}
                        onClick={() => toggle(exp.id)}
                        aria-controls={`mxp-panel-${exp.id}`}
                        aria-expanded={!!open[exp.id]}
                      >
                        <span className="mxp-bar-label">
                          {shortName(exp.company)} <span>· {duration}</span>
                        </span>
                        <span className="mxp-bar-fill" aria-hidden="true" />
                      </button>
                    </div>
                  )
                })}
                {todayPct !== null && <div className="mxp-today" style={{ left: `${todayPct}%` }} aria-hidden="true" />}
              </div>
              {todayPct !== null && <span className="mxp-today-label" style={{ left: `${todayPct}%` }} aria-hidden="true">HOY</span>}
            </div>
          </div>

          {/* Acordeón */}
          {items.map(({ exp, start, end, current, duration }) => {
            const isOpen = !!open[exp.id]
            return (
              <div key={exp.id} className={`mxp-row ${exp.accent === 'purple' ? 'is-purple' : ''} ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="mxp-row-head"
                  onClick={() => toggle(exp.id)}
                  aria-expanded={isOpen}
                  aria-controls={`mxp-panel-${exp.id}`}
                >
                  <span className="mxp-row-meta">
                    <span className="mxp-row-range">{fmtShort(start)} — {current ? 'Actualidad' : fmtShort(end)}</span>
                    {current ? <LiveBadge /> : <span className="mxp-duration">{duration}</span>}
                  </span>
                  <span className="mxp-row-title">
                    <img src={asset(exp.logo || '')} alt="" className="mxp-logo" />
                    <span className="mxp-row-text">
                      <span className="mxp-position">{exp.position}</span>
                      <span className="mxp-company">{exp.company}</span>
                    </span>
                    <span className="mxp-chevron" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </span>
                </button>

                <div className="mxp-panel" id={`mxp-panel-${exp.id}`} role="region" aria-hidden={!isOpen}>
                  <div className="mxp-panel-inner">
                    <div className="mxp-panel-body">
                      <p className="mxp-desc">{exp.description}</p>

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mxp-highlights">
                          {exp.highlights.map(h => (
                            <li key={h}>
                              <span className="mxp-check" aria-hidden="true">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="mxp-metrics">
                          {exp.metrics.map(m => (
                            <div key={m.id} className="mxp-metric">
                              <strong>{m.value}</strong>
                              <span>{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mxp-chips">
                        {exp.technologies.map(t => {
                          const src = techIcon(t)
                          return (
                            <span key={t} className="mxp-chip">
                              {src && <img src={src} alt="" width={14} height={14} />}
                              {t}
                            </span>
                          )
                        })}
                      </div>
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
