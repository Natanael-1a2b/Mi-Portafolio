import { useEffect, useRef } from 'react'
import { experiences } from '../../data/experience'
import { SectionTitle } from '../ui/SectionTitle'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      // Animate the timeline line drawing in
      gsap.from('.timeline-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.timeline', start: 'top 80%' },
      })

      // Stagger each entry
      gsap.utils.toArray<HTMLElement>('.timeline-entry').forEach((entry, i) => {
        gsap.from(entry, {
          opacity: 0,
          x: i % 2 === 0 ? -40 : 40,
          y: 20,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: entry, start: 'top 85%' },
        })
      })

      // Pulse dots
      gsap.utils.toArray<HTMLElement>('.timeline-dot').forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.4,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: dot, start: 'top 85%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="experiencia" ref={sectionRef} className="section-alt">
      <div className="container">
        <SectionTitle title="Experiencia Laboral" />
        <div className="timeline">
          <div className="timeline-line" />
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className={`timeline-entry ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
            >
              <div className="timeline-dot" />
              <div className="timeline-card glass-card">
                <span className="timeline-date">{exp.startDate} — {exp.endDate}</span>
                <h3 className="timeline-company">{exp.company}</h3>
                <h4 className="timeline-position">{exp.position}</h4>
                <p className="timeline-desc">{exp.description}</p>
                <div className="timeline-techs">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="badge">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
