import { useState, useEffect, useRef } from 'react'
import { SectionTitle } from '../ui/SectionTitle'
import { Keyboard2D } from '../ui/Keyboard2D'
import type { Skill } from '../../data/skills'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categoryLabels: Record<string, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  tools: 'Herramientas & DevOps',
  ia: 'IA',
}

export function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.skills-canvas-wrapper',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.skills-layout', start: 'top 80%' } }
      )
      gsap.fromTo('.skills-info-panel',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: '.skills-layout', start: 'top 80%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])
  return (
    <section id="habilidades" ref={sectionRef} className="skills-section">
      <div className="container">
        <SectionTitle title="Habilidades" />

        <div className="skills-layout">
          {/* 2D Pseudo-3D Keyboard */}
          <div className="skills-canvas-wrapper">
            <Keyboard2D onSkillSelect={setSelectedSkill} selectedSkill={selectedSkill} />
          </div>

          {/* Info Panel — DOM-based */}
          <div className={`skills-info-panel ${selectedSkill ? 'active' : ''}`}>
            <div className="skills-info-glow" style={{ background: selectedSkill?.color || 'transparent' }} />
            <div className="skills-info-content">
              <h3
                className="skills-info-title"
                style={{
                  color: selectedSkill?.color || '#fff',
                  textShadow: selectedSkill ? `0 0 30px ${selectedSkill.color}40` : 'none',
                }}
              >
                {selectedSkill ? selectedSkill.name : 'Tech Stack'}
              </h3>
              <p className="skills-info-desc">
                {selectedSkill ? selectedSkill.description : '💡 Haz clic en una tecnología o habilidad para ver sus detalles.'}
              </p>
              {selectedSkill?.category && (
                <span
                  className="skills-info-badge"
                  style={{
                    color: selectedSkill.color,
                    borderColor: `${selectedSkill.color}40`,
                    background: `${selectedSkill.color}10`,
                  }}
                >
                  {categoryLabels[selectedSkill.category] || selectedSkill.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
