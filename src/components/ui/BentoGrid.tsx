import { useState, useRef, useEffect, useMemo } from 'react'
import type { Skill } from '../../data/skills'
import { skillCategories } from '../../data/skills'
import { BentoCell } from './BentoCell'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  skills: Skill[]
}

export function BentoGrid({ skills }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePreferredMotion()

  const groupedSkills = useMemo(() => {
    return skillCategories
      .map(cat => ({
        category: cat,
        skills: skills.filter(s => s.category === cat.id),
      }))
      .filter(g => g.skills.length > 0)
  }, [skills])

  useEffect(() => {
    if (prefersReduced || !gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.bento-category-header',
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo('.bento-category-row .bento-cell',
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [prefersReduced])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setSelectedId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="bento-categories-wrapper" ref={gridRef}>
      {groupedSkills.map(group => (
        <div key={group.category.id} className="bento-category-group">
          <h3
            className="bento-category-header"
            style={{ color: group.category.accent }}
          >
            {group.category.label}
          </h3>
          <div className="bento-category-row">
            {group.skills.map(skill => (
              <BentoCell
                key={skill.id}
                skill={skill}
                isSelected={selectedId === skill.id}
                onSelect={() =>
                  setSelectedId(selectedId === skill.id ? null : skill.id)
                }
                showCategory={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
