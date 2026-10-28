import { useState, useMemo, useRef, useEffect, type KeyboardEvent } from 'react'
import type { Skill } from '../../data/skills'
import { skillCategories } from '../../data/skills'
import { SkillDetailCard } from './SkillDetailCard'
import { asset } from '../../utils/asset'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CategoryId = typeof skillCategories[number]['id']

interface Props {
  skills: Skill[]
}

// Íconos SVG inline usados por skills con iconType 'svg' (mismos paths que TechChip)
const svgIcons: Record<string, React.ReactNode> = {
  lightning: (
    <svg aria-hidden="true" width={30} height={30} viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z" />
    </svg>
  ),
  diagram: (
    <svg aria-hidden="true" width={30} height={30} viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z" />
    </svg>
  ),
}

function SkillIcon({ skill }: { skill: Skill }) {
  if (skill.iconType === 'svg') {
    return <span style={{ color: skill.color, display: 'flex' }}>{svgIcons[skill.icon] ?? null}</span>
  }
  const src = skill.iconType === 'local' ? asset(skill.icon) : skill.icon
  return <img src={src} alt="" width={30} height={30} loading="lazy" />
}

export function SkillsExplorer({ skills }: Props) {
  const groups = useMemo(
    () =>
      skillCategories
        .map(cat => ({ category: cat, skills: skills.filter(s => s.category === cat.id) }))
        .filter(g => g.skills.length > 0),
    [skills]
  )

  const [activeId, setActiveId] = useState<CategoryId>(groups[0]?.category.id ?? 'backend')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const prefersReduced = usePreferredMotion()

  const active = groups.find(g => g.category.id === activeId) ?? groups[0]

  // Entrada al hacer scroll (igual que BentoGrid)
  useEffect(() => {
    if (prefersReduced || !rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.skills-tab', '.skills-panel'],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [prefersReduced])

  // Transición suave al cambiar de categoría
  useEffect(() => {
    if (prefersReduced || !listRef.current) return
    gsap.fromTo(
      listRef.current.children,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
    )
  }, [activeId, prefersReduced])

  const selectCategory = (id: CategoryId) => {
    setActiveId(id)
    setSelectedSkill(null)
  }

  // Navegación con flechas entre pestañas (patrón WAI-ARIA tabs)
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const last = groups.length - 1
    let next = index
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    selectCategory(groups[next].category.id)
    tabRefs.current[next]?.focus()
  }

  if (!active) return null

  const panelVars = {
    '--card-gradient-from': active.category.gradientFrom,
    '--card-gradient-to': active.category.gradientTo,
    '--card-accent': active.category.accent,
  } as React.CSSProperties

  return (
    <div ref={rootRef}>
      <div className="skills-explorer">
        <div className="skills-tabs" role="tablist" aria-label="Categorías de habilidades" aria-orientation="vertical">
          {groups.map((g, i) => {
            const isActive = g.category.id === active.category.id
            return (
              <button
                key={g.category.id}
                ref={el => { tabRefs.current[i] = el }}
                type="button"
                role="tab"
                id={`skills-tab-${g.category.id}`}
                aria-selected={isActive}
                aria-controls="skills-panel"
                tabIndex={isActive ? 0 : -1}
                className={`skills-tab${isActive ? ' is-active' : ''}`}
                onClick={() => selectCategory(g.category.id)}
                onKeyDown={e => onTabKeyDown(e, i)}
              >
                <img className="skills-tab-emblem" src={asset(g.category.illustration)} alt="" width={52} height={52} />
                <span className="skills-tab-text">
                  <span className="skills-tab-label">
                    <span className="skills-tab-label-full">{g.category.label}</span>
                    <span className="skills-tab-label-short">{g.category.shortLabel}</span>
                  </span>
                  <span className="skills-tab-count">{g.skills.length} tecnologías</span>
                </span>
              </button>
            )
          })}
        </div>

        <div
          className="skills-panel"
          id="skills-panel"
          role="tabpanel"
          aria-labelledby={`skills-tab-${active.category.id}`}
          style={panelVars}
        >
          <div className="skills-panel-inner">
            <img className="skills-panel-emblem" src={asset(active.category.illustration)} alt="" width={112} height={112} />
            <span className="skills-panel-count">{active.skills.length} tecnologías</span>
            <h3 className="category-title">{active.category.label}</h3>
            <p className="category-desc">{active.category.description}</p>

            <div className="skills-list" ref={listRef}>
              {active.skills.map(skill => {
                const isSelected = selectedSkill?.id === skill.id
                const itemVars = {
                  '--item-color': skill.color,
                  '--item-color-alpha': `${skill.color}AA`,
                  '--item-bg': `${skill.color}14`,
                  '--item-glow': `${skill.color}40`,
                } as React.CSSProperties
                return (
                  <button
                    key={skill.id}
                    type="button"
                    className={`skills-item${isSelected ? ' is-selected' : ''}`}
                    style={itemVars}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedSkill(prev => (prev?.id === skill.id ? null : skill))}
                  >
                    <span className="skills-item-icon"><SkillIcon skill={skill} /></span>
                    <span className="skills-item-text">
                      <span className="skills-item-name">{skill.name}</span>
                      <span className="skills-item-desc">{skill.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedSkill && (
        <SkillDetailCard skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  )
}
