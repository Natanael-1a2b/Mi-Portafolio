import { useState, useRef, useEffect, useMemo } from 'react'
import type { Skill } from '../../data/skills'
import { skillCategories } from '../../data/skills'
import { CategoryCard } from './CategoryCard'
import { SkillDetailCard } from './SkillDetailCard'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  skills: Skill[]
}

export function BentoGrid({ skills }: Props) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
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
      gsap.fromTo('.category-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(prev => prev?.id === skill.id ? null : skill)
  }

  const handleCloseDetail = () => {
    setSelectedSkill(null)
  }

  return (
    <div ref={gridRef}>
      <div className="skills-category-grid">
        {groupedSkills.map(group => (
          <CategoryCard
            key={group.category.id}
            category={group.category}
            skills={group.skills}
            selectedSkillId={selectedSkill?.id ?? null}
            onSelectSkill={handleSelectSkill}
          />
        ))}
      </div>

      {selectedSkill && (
        <SkillDetailCard
          skill={selectedSkill}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
