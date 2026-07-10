import { heroContent, personalInfo } from '../../data/personal'
import { skills } from '../../data/skills'
import { asset } from '../../utils/asset'
import { MagneticButton } from '../ui/MagneticButton'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'

export function MobileHero() {
  const bottomTechs = skills.filter(s => ['react', 'dotnet', 'sqlserver', 'supabase', 'git'].includes(s.id))

  return (
    <section id="inicio" className="mobile-hero">
      <SectionAtmosphere variant="hero" />
      <div className="mobile-container">
        
        <div className="mobile-hero-img">
          <div className="neon-ring"></div>
          <img src={asset('/assets/images/hero-profile-nobg.webp')} alt="Claudio Natanael Beltre" width={240} height={320} loading="eager" />
        </div>

        <div className="mobile-hero-text">
          <div className="mobile-hero-badge">INGENIERO DE SOFTWARE</div>
          
          <h1>
            {heroContent.title}<br/>
            <span className="highlight">{heroContent.titleHighlight}</span>
          </h1>
          
          <div className="mobile-subtitle">{heroContent.subtitle}</div>
          
          <p>{heroContent.description}</p>
          
          <div className="mobile-hero-btns">
            <MagneticButton as="a" className="btn btn-primary" href="#contacto">
              Hablemos de tu proyecto <span className="hero-arrow">→</span>
            </MagneticButton>
            <MagneticButton as="a" className="btn btn-outline" href={asset(personalInfo.cvPath)} download>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ marginRight: '8px' }}>
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
              Descargar CV
            </MagneticButton>
          </div>
        </div>


        <div className="mobile-tech-stack">
          <span>Stack Principal</span>
          <div className="mobile-tech-logos">
            {bottomTechs.map(tech => (
              <div key={tech.id} className="mobile-tech-item">
                <img src={asset(tech.icon)} alt={tech.name} width={20} height={20} />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mobile-stats">
          <div className="mobile-stat-item">
            <strong>500+</strong>
            <span>Commits este año</span>
          </div>
          <div className="mobile-stat-divider"></div>
          <div className="mobile-stat-item">
            <strong>10+</strong>
            <span>Proyectos completados</span>
          </div>
          <div className="mobile-stat-divider"></div>
          <div className="mobile-stat-item">
            <strong>4</strong>
            <span>Apps en producción</span>
          </div>
        </div>

      </div>
    </section>
  )
}
