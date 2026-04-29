import { useState, useEffect, useRef, useCallback } from 'react'
import { projects } from '../../data/projects'
import { asset } from '../../utils/asset'
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
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 85%' },
        })

        tl.fromTo(card, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        if (img) tl.fromTo(img, { scale: 1.05 }, { scale: 1, duration: 0.6 }, '-=0.4')
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
      card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-5px)`
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
    <section id="proyectos" ref={sectionRef} className="section-alt">
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
                <img src={asset(proj.image)} alt={proj.title} loading="lazy" />
              </div>
              <div className="project-content">
                <h3>{proj.title}</h3>
                <p>{proj.shortDescription}</p>
                <div className="project-badges">
                  {proj.badges.map((b) => (
                    <span key={b} className="badge">{b}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: 'auto' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setSelected(proj)}>
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
