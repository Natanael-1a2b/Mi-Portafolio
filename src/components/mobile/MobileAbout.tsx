import { aboutContent, personalInfo } from '../../data/personal'
import { SectionTitle } from '../ui/SectionTitle'

export function MobileAbout() {
  return (
    <section id="sobre-mi" className="mobile-section mobile-about">
      <div className="mobile-container">
        <SectionTitle 
          badge="CONÓCEME"
          title="Sobre "
          gradientTitle="Mí"
        />
        
        <div className="mobile-about-content">
          <div className="mobile-about-text">
            {aboutContent.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>

          <div className="mobile-info-card">
            <h3>Información Personal</h3>
            <div className="mobile-info-list">
              <div className="mobile-info-item">
                <span className="mobile-info-label">Nombre</span>
                <span className="mobile-info-value">{personalInfo.name}</span>
              </div>
              <div className="mobile-info-item">
                <span className="mobile-info-label">Email</span>
                <a href={`mailto:${personalInfo.email}`} className="mobile-info-value">{personalInfo.email}</a>
              </div>
              <div className="mobile-info-item">
                <span className="mobile-info-label">Teléfono</span>
                <span className="mobile-info-value">{personalInfo.phone}</span>
              </div>
              <div className="mobile-info-item">
                <span className="mobile-info-label">LinkedIn</span>
                <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" className="mobile-info-value">Ver Perfil</a>
              </div>
              <div className="mobile-info-item">
                <span className="mobile-info-label">GitHub</span>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="mobile-info-value">Ver Repositorios</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
