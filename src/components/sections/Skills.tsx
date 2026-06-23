import { skills } from '../../data/skills'
import { BentoGrid } from '../ui/BentoGrid'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { SectionTitle } from '../ui/SectionTitle'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      // Elementos internos animados por BentoGrid
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="habilidades" ref={sectionRef} className="skills-bento-section">
      <SectionAtmosphere />
      
      <div className="container">
        <SectionTitle 
          badge="CAPACIDADES"
          title="Mis "
          gradientTitle="Habilidades"
          subtitle="Tecnologías y herramientas que domino."
        />
        
        <BentoGrid skills={skills} />
      </div>
    </section>
  )
}
