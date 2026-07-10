import { useState } from 'react'
import { projects } from '../../data/projects'
import { SectionTitle } from '../ui/SectionTitle'
import { ProjectModal } from '../ui/ProjectModal'
import { asset } from '../../utils/asset'
import type { Project } from '../../data/projects'
import { useFadeIn } from '../../hooks/useFadeIn'

export function MobileProjects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const ref = useFadeIn<HTMLElement>()

  return (
    <section id="proyectos" className="mobile-section mobile-projects mobile-fade-in" ref={ref}>
      <div className="mobile-container">
        <SectionTitle 
          badge="PORTAFOLIO"
          title="Proyectos "
          gradientTitle="Destacados"
        />
        
        <div className="mobile-projects-carousel hide-scrollbar">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className={`mobile-project-card ${proj.id === 'cine-match' || proj.id === 'jovenes-involucrados-2026' ? 'center-img' : ''}`}
              onClick={() => setSelected(proj)}
            >
              <div className="mobile-project-img">
                <img 
                  src={asset(proj.image)} 
                  alt={proj.title}
                  loading="lazy"
                />
                {proj.repoUrl && proj.repoUrl !== '#' && (
                  <div className="mobile-live-indicator">
                    <span className="live-dot"></span>
                    En producción
                  </div>
                )}
              </div>
              
              <div className="mobile-project-content">
                <h3>{proj.title}</h3>
                <p>{proj.shortDescription}</p>
                <div className="mobile-project-badges">
                  {proj.badges.map((b) => (
                    <span key={b} className="mobile-badge">{b}</span>
                  ))}
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
