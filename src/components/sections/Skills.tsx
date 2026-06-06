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
      gsap.fromTo('.skills-empty-state',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          delay: 0.5,
          scrollTrigger: { trigger: '.skills-bento-section', start: 'top 70%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="habilidades" ref={sectionRef} className="skills-bento-section">
      <SectionAtmosphere variant="minimal" glowPosition="center" />
      
      <div className="container relative z-10" style={{ position: 'relative', zIndex: 10 }}>
        <SectionTitle title="Habilidades" />
        
        <BentoGrid skills={skills} />
      </div>
    </section>
  )
}
