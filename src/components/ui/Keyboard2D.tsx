import { useMemo, useState } from 'react'
import { skills, skillCategories } from '../../data/skills'
import type { Skill } from '../../data/skills'
import { asset } from '../../utils/asset'

interface Props {
  onSkillSelect: (skill: Skill | null) => void
  selectedSkill: Skill | null
}

export function Keyboard2D({ onSkillSelect, selectedSkill }: Props) {
  const visibleSkills = skills

  // Group by category for the control panel layout
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {}
    visibleSkills.forEach(skill => {
      const cat = skill.category || 'tools'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(skill)
    })
    return groups
  }, [visibleSkills])

  const handleSelect = (skill: Skill) => {
    if (selectedSkill?.id === skill.id) {
      onSkillSelect(null)
    } else {
      onSkillSelect(skill)
    }
  }

  return (
    <div className="keyboard-2d-wrapper">
      <div className="keyboard-2d-chassis">
        {skillCategories.map(cat => {
          const categorySkills = groupedSkills[cat.id]
          if (!categorySkills || categorySkills.length === 0) return null
          
          return (
            <div key={cat.id} className="control-panel-section">
              <div className="control-panel-label" style={{ color: cat.color }}>
                {cat.label.toUpperCase()}
              </div>
              <div className="keyboard-2d-grid">
                {categorySkills.map((skill) => (
                  <Key2D
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkill?.id === skill.id}
                    onSelect={() => handleSelect(skill)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Key2D({ skill, isSelected, onSelect }: { skill: Skill, isSelected: boolean, onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const baseColor = skill.color
  const activeColor = hovered || isSelected ? '#ffffff' : baseColor

  const renderIcon = () => {
    if (skill.iconType === 'svg') {
      const iconMap: Record<string, React.ReactNode> = {
        robot: (
          <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z" />
            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866Z" />
          </svg>
        ),
        diagram: (
          <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z" />
          </svg>
        ),
        lightning: (
          <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z" />
          </svg>
        ),
      }
      return <div style={{ color: activeColor }}>{iconMap[skill.icon] || null}</div>
    }

    if (imageError) {
      return (
        <span style={{ fontSize: '18px', fontWeight: '800', color: activeColor }}>
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
          width: '32px',
          height: '32px',
          objectFit: 'contain',
        }}
      />
    )
  }

  const styleVars = {
    '--key-color': baseColor,
    '--key-color-alpha': `${baseColor}66`,
    '--key-glow': `0 0 20px ${baseColor}44`,
    '--key-glow-inset': `${baseColor}88`,
    '--key-bg-active': `${baseColor}22`,
  } as React.CSSProperties

  return (
    <div 
      className={`key-2d ${isSelected ? 'active' : ''}`}
      style={styleVars}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {renderIcon()}
      <span className="key-2d-label" style={{ color: isSelected || hovered ? '#fff' : 'var(--text-muted)' }}>
        {skill.name}
      </span>
    </div>
  )
}
