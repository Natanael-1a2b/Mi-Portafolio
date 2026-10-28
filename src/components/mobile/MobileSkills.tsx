import { skills, skillCategories } from '../../data/skills'
import type { Skill } from '../../data/skills'
import { SectionTitle } from '../ui/SectionTitle'
import { asset } from '../../utils/asset'
import { useMemo, useState } from 'react'
import { useFadeIn } from '../../hooks/useFadeIn'

const svgIcons: Record<string, React.ReactNode> = {
  robot: (
    <svg aria-hidden="true" width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
      <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866Z" />
    </svg>
  ),
  diagram: (
    <svg aria-hidden="true" width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z" />
    </svg>
  ),
  lightning: (
    <svg aria-hidden="true" width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z" />
    </svg>
  ),
}

function SkillIcon({ skill, size = 20 }: { skill: Skill; size?: number }) {
  if (skill.iconType === 'svg') {
    return <span className="mobile-skill-svg-icon" style={{ color: skill.color }}>{svgIcons[skill.icon] || null}</span>
  }
  const src = skill.iconType === 'local' ? asset(skill.icon) : skill.icon
  return <img src={src} alt="" width={size} height={size} loading="lazy" />
}

export function MobileSkills() {
  const ref = useFadeIn<HTMLElement>()
  const groups = useMemo(
    () =>
      skillCategories
        .map(cat => ({ category: cat, skills: skills.filter(s => s.category === cat.id) }))
        .filter(g => g.skills.length > 0),
    []
  )
  const [openId, setOpenId] = useState<string | null>(groups[0]?.category.id ?? null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id))
    setSelectedId(null)
  }

  return (
    <section id="habilidades" className="mobile-section mobile-skills mobile-fade-in" ref={ref}>
      <div className="mobile-container">
        <SectionTitle
          badge="CAPACIDADES"
          title="Mis "
          gradientTitle="Habilidades"
        />

        <div className="mobile-skills-accordion">
          {groups.map(({ category, skills: groupSkills }) => {
            const isOpen = openId === category.id
            const selected = groupSkills.find(s => s.id === selectedId)
            return (
              <div key={category.id} className={`mobile-skill-group${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="mobile-skill-group-header"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? `mskills-${category.id}` : undefined}
                  onClick={() => toggle(category.id)}
                >
                  <img className="mobile-skill-group-emblem" src={asset(category.illustration)} alt="" width={48} height={48} />
                  <span className="mobile-skill-group-text">
                    <span className="mobile-skill-group-label">{category.label}</span>
                    <span className="mobile-skill-group-count">{groupSkills.length} tecnologías</span>
                  </span>
                  <span className="mobile-skill-group-chevron" aria-hidden="true" />
                </button>

                {isOpen && (
                  <div className="mobile-skill-group-body" id={`mskills-${category.id}`}>
                    <p>{category.description}</p>
                    <div className="mobile-skill-chips">
                      {groupSkills.map(skill => {
                        const isSel = selectedId === skill.id
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            className={`mobile-skill-chip${isSel ? ' is-selected' : ''}`}
                            style={{ '--chip-bg': `${skill.color}1A`, '--chip-border': `${skill.color}AA` } as React.CSSProperties}
                            aria-pressed={isSel}
                            onClick={() => setSelectedId(prev => (prev === skill.id ? null : skill.id))}
                          >
                            <SkillIcon skill={skill} />
                            <span>{skill.name}</span>
                          </button>
                        )
                      })}
                    </div>

                    {selected && (
                      <div
                        className="mobile-skill-detail"
                        style={{ '--chip-border': `${selected.color}55` } as React.CSSProperties}
                        aria-live="polite"
                      >
                        <SkillIcon skill={selected} size={28} />
                        <div>
                          <strong>{selected.name}</strong>
                          <span>{selected.description}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
