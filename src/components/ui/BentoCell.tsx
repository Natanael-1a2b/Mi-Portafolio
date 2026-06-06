import { useRef, useState } from 'react'
import type { Skill } from '../../data/skills'
import { skillCategories } from '../../data/skills'
import { asset } from '../../utils/asset'

interface Props {
  skill: Skill
  isSelected: boolean
  onSelect: () => void
}

export function BentoCell({ skill, isSelected, onSelect }: Props) {
  const [imageError, setImageError] = useState(false)
  const cellRef = useRef<HTMLDivElement>(null)

  const category = skillCategories.find(c => c.id === skill.category)
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  const renderIcon = (large = false) => {
    const size = large ? 48 : 40
    if (skill.iconType === 'svg') {
      const iconMap: Record<string, React.ReactNode> = {
        robot: (
          <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866Z" />
          </svg>
        ),
        diagram: (
          <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z" />
          </svg>
        ),
        lightning: (
          <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z" />
          </svg>
        ),
        code: (
          <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
          </svg>
        ),
      }
      return <div style={{ color: skill.color }}>{iconMap[skill.icon] || null}</div>
    }

    if (imageError) {
      return (
        <span style={{ fontSize: large ? '32px' : '18px', fontWeight: '800', color: skill.color }}>
          {skill.name.charAt(0)}
        </span>
      )
    }

    const imgSrc = skill.iconType === 'local' ? asset(skill.icon) : skill.icon
    return (
      <img
        src={imgSrc}
        alt={skill.name}
        onError={() => setImageError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          ...(skill.id === 'vercel' && { borderRadius: '12px' }),
        }}
      />
    )
  }

  const styleVars = {
    '--cell-gradient-from': skill.color,
    '--cell-gradient-to': `${skill.color}00`,
    '--cell-glow-color': `${skill.color}60`,
    '--cell-bg-hover': `${skill.color}10`,
  } as React.CSSProperties

  const handleChipClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent collapsing when clicking a link
  }

  return (
    <div
      ref={cellRef}
      className={`bento-cell ${isSelected ? 'expanded' : ''}`}
      data-size={skill.size}
      style={styleVars}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      aria-label={`${skill.name} - ${category?.label || skill.category}`}
      onKeyDown={handleKeyDown}
    >
      <div className="bento-cell-inner">
        {!isSelected ? (
          <div className="bento-cell-collapsed">
            <div className="bento-cell-icon">{renderIcon(false)}</div>
          </div>
        ) : (
          <div className="bento-cell-expanded-content">
            <div className="bento-cell-header">
              <div className="bento-cell-icon-large">{renderIcon(true)}</div>
              <div>
                <h3 className="bento-cell-title">{skill.name}</h3>
                <span className="bento-cell-category-large" style={{ color: category?.accent }}>
                  {category?.label || skill.category}
                </span>
              </div>
            </div>
            
            <p className="bento-cell-desc">
              {skill.detailedDescription}
            </p>

            {skill.relatedProjectIds && skill.relatedProjectIds.length > 0 && (
              <div className="bento-cell-projects">
                <span className="bento-cell-projects-title">En proyectos:</span>
                <div className="bento-cell-chips">
                  {skill.relatedProjectIds.map(id => (
                    <a key={id} href="#proyectos" className="bento-cell-chip" onClick={handleChipClick}>
                      {id.replace('-', ' ')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
