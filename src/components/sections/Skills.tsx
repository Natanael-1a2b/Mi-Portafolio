import { useState } from 'react'
import { skills } from '../../data/skills'
import { SectionTitle } from '../ui/SectionTitle'
import { useWebGLSupport } from '../../hooks/useWebGLSupport'
import type { Skill } from '../../data/skills'

interface Props {
  onSkillSelect?: (skill: Skill | null) => void
  selectedSkill?: Skill | null
}

export function Skills({ onSkillSelect, selectedSkill: externalSelected }: Props) {
  const [internalSelected, setInternalSelected] = useState<Skill | null>(null)
  const webglSupported = useWebGLSupport()

  const selected = externalSelected !== undefined ? externalSelected : internalSelected
  const setSelected = onSkillSelect || setInternalSelected

  // Category labels for fallback grid
  const categories = [
    { id: 'backend' as const, label: 'Backend', color: 'var(--primary)' },
    { id: 'frontend' as const, label: 'Frontend', color: 'var(--text-main)' },
    { id: 'tools' as const, label: 'Herramientas & DevOps', color: 'var(--accent)' },
    { id: 'ia' as const, label: 'IA & Automatización', color: 'var(--secondary)' },
  ]

  const renderIcon = (skill: Skill) => {
    if (skill.iconType === 'svg') {
      // Inline SVG icons for IA category
      const iconMap: Record<string, React.ReactNode> = {
        robot: (
          <svg width="50" height="50" viewBox="0 0 16 16" fill={skill.color}>
            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866Z" />
          </svg>
        ),
        diagram: (
          <svg width="50" height="50" viewBox="0 0 16 16" fill={skill.color}>
            <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z" />
          </svg>
        ),
        lightning: (
          <svg width="50" height="50" viewBox="0 0 16 16" fill={skill.color}>
            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z" />
          </svg>
        ),
      }
      return iconMap[skill.icon] || null
    }
    return <img src={skill.icon} alt={skill.name} />
  }

  return (
    <section id="habilidades" className="skills-section" style={{ background: 'rgba(10,10,18,0.5)' }}>
      <div className="container">
        <SectionTitle title="Habilidades" />

        {webglSupported ? (
          <>
            <div className="skills-canvas-wrapper" id="skills-canvas-mount" />
            <div className="skills-info-panel">
              {selected ? (
                <>
                  {selected.iconType !== 'svg' && (
                    <img src={selected.icon} alt={selected.name} className="skill-icon" />
                  )}
                  <h4>{selected.name}</h4>
                  <p>{selected.description}</p>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>
                  Interactúa con el teclado 3D para explorar mis habilidades
                </p>
              )}
            </div>
          </>
        ) : (
          /* Fallback: HTML skill cards */
          categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: '2rem' }}>
              <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700, color: cat.color }}>
                {cat.label}
              </h4>
              <div className="skills-fallback">
                {skills
                  .filter((s) => s.category === cat.id)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="skill-card-fallback"
                      onClick={() => setSelected(skill === selected ? null : skill)}
                      style={{ cursor: 'pointer', borderColor: selected?.id === skill.id ? skill.color : undefined }}
                    >
                      {renderIcon(skill)}
                      <h5>{skill.name}</h5>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
