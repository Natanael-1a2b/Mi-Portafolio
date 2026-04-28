import { useState, useEffect, useRef, useCallback } from 'react'
import { projects } from '../../data/projects'
import { SectionTitle } from '../ui/SectionTitle'
import { ProjectModal } from '../ui/ProjectModal'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import { useIsMobile } from '../../hooks/useIsMobile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()
  const isMobile = useIsMobile(992)

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        const img = card.querySelector('.project-img img')
        const title = card.querySelector('h3')
        const desc = card.querySelector('p')
        const badges = card.querySelector('.project-badges')
        const btn = card.querySelector('.btn')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 80%' },
        })

        tl.from(card, { y: 40, opacity: 0, duration: 0.5 })
        if (img) tl.from(img, { scale: 1.2, duration: 0.6 }, '-=0.3')
        if (title) tl.from(title, { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
        if (desc) tl.from(desc, { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
        if (badges) tl.from(badges, { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
        if (btn) tl.from(btn, { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const handleTilt = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-10px)`
    },
    [isMobile],
  )

  const handleTiltReset = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
    e.currentTarget.style.transition = 'transform 0.4s ease'
  }, [])

  const handleTiltEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) e.currentTarget.style.transition = 'none'
  }, [isMobile])

  return (
    <section id="proyectos" ref={sectionRef}>
      <div className="container">
        <SectionTitle title="Proyectos Destacados" />
        <div className="projects-grid">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="project-card"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
              onMouseEnter={handleTiltEnter}
            >
              <div className="project-img">
                <img src={proj.image} alt={proj.title} loading="lazy" />
              </div>
              <div className="project-content">
                <h3>{proj.title}</h3>
                <p>{proj.shortDescription}</p>
                <div className="project-badges">
                  {proj.badges.map((b) => (
                    <span key={b} className="badge">{b}</span>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                  <button className="btn btn-primary" onClick={() => setSelected(proj)}>
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
