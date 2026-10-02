import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { projects } from '../../data/projects'
import { asset } from '../../utils/asset'
import { SectionTitle } from '../ui/SectionTitle'
import { ProjectModal } from '../ui/ProjectModal'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import { useIsMobile } from '../../hooks/useIsMobile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

// Filas visibles antes de mostrar el botón "Ver más"
const VISIBLE_ROWS = 2

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [cols, setCols] = useState(3)
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const prefersReduced = usePreferredMotion()
  const isMobile = useIsMobile(992)

  // Las columnas cambian por breakpoint (1 a 4), así que se leen de la cuadrícula real
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const measure = () => {
      const count = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length
      setCols(Math.max(1, count))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  const limit = cols * VISIBLE_ROWS
  const hasMore = projects.length > limit
  const visibleProjects = expanded || !hasMore ? projects : projects.slice(0, limit)
  const limitRef = useRef(limit)
  limitRef.current = limit

  // Aparición de los proyectos que se agregan al expandir (solo al expandir, no al redimensionar)
  useEffect(() => {
    if (!expanded || prefersReduced || !gridRef.current) return
    const extra = Array.from(gridRef.current.children).slice(limitRef.current)
    if (extra.length === 0) return
    const tween = gsap.fromTo(extra,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, clearProps: 'all' }
    )
    return () => { tween.kill() }
  }, [expanded, prefersReduced])

  const toggleExpanded = () => {
    if (expanded) {
      // Al contraer, volver al inicio de la sección para no quedar perdido más abajo
      sectionRef.current?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
    }
    setExpanded(e => !e)
  }

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-card',
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          stagger: 0.15, 
          clearProps: "all", 
          scrollTrigger: { trigger: '.projects-grid', start: 'top 85%', once: true } 
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const handleTilt = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xPct = (x / rect.width) - 0.5
      const yPct = (y / rect.height) - 0.5
      card.style.transform = `perspective(1000px) rotateX(${yPct * -6}deg) rotateY(${xPct * 6}deg) translateY(-5px)`
      
      const glare = card.querySelector('.project-glare') as HTMLElement
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`
      }
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
    <section id="proyectos" ref={sectionRef} className="section-alt" style={{ position: 'relative' }}>
      <SectionAtmosphere />
      <div className="container">
        <SectionTitle 
          badge="PORTAFOLIO"
          title="Proyectos "
          gradientTitle="Destacados"
          subtitle="Una selección de mis mejores trabajos."
        />
        <div className="projects-grid" id="projects-grid" ref={gridRef}>
          {visibleProjects.map((proj) => (
            <div
              key={proj.id}
              className="project-card"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
              onMouseEnter={handleTiltEnter}
              onClick={() => setSelected(proj)}
            >
              <div className="project-glare"></div>
              <div className="project-img">
                {proj.repoUrl && proj.repoUrl !== '#' && (
                  <div className="live-indicator">
                    <span className="live-dot"></span>
                    En Producción
                  </div>
                )}
                <img src={asset(proj.image)} alt="" className="project-img-blur" aria-hidden="true" width={600} height={400} loading="lazy" />
                <img 
                  src={asset(proj.image)} 
                  alt={proj.title} 
                  width={600} 
                  height={400}
                  className={`project-img-main ${proj.id === 'cine-match' || proj.id === 'jovenes-involucrados-2026' ? 'mobile-zoom' : ''}`} 
                  loading="lazy" 
                  decoding="async" 
                />
                <div className="project-overlay-btn">
                  <span>Ver Proyecto</span>
                </div>
              </div>
              <div className="project-content">
                <h3>{proj.title}</h3>
                <p>{proj.shortDescription}</p>
                <div className="project-badges">
                  {proj.badges.map((b) => (
                    <span key={b} className="badge">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="projects-more">
            <button
              type="button"
              className="btn btn-outline"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              aria-controls="projects-grid"
            >
              {expanded ? 'Ver menos' : `Ver más proyectos (${projects.length - limit})`}
              <svg className={`projects-more-icon ${expanded ? 'is-open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
