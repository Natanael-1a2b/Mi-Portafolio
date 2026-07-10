import { experiences } from '../../data/experience'
import { SectionTitle } from '../ui/SectionTitle'
import { LiveBadge } from '../ui/LiveBadge'

export function MobileExperience() {
  return (
    <section id="experiencia" className="mobile-section mobile-experience">
      <div className="mobile-container">
        <SectionTitle 
          badge="TRAYECTORIA"
          title="Experiencia "
          gradientTitle="Laboral"
        />
        
        <div className="mobile-timeline">
          {experiences.map((exp) => (
            <div key={exp.id} className="mobile-timeline-item">
              <div className="mobile-timeline-dot"></div>
              
              <div className="mobile-exp-card">
                <div className="mobile-exp-header">
                  <span className="mobile-exp-date">
                    {exp.startDate} — {exp.endDate}
                  </span>
                  {exp.endDate.toLowerCase().includes('actual') && <LiveBadge />}
                </div>
                
                <h3 className="mobile-exp-role">{exp.position}</h3>
                <h4 className="mobile-exp-company">{exp.company}</h4>
                
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="mobile-exp-highlights">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}

                {exp.metrics && exp.metrics.length > 0 && (
                  <div className="mobile-exp-metrics">
                    {exp.metrics.map(m => (
                      <div key={m.id} className="mobile-metric-item">
                        <strong>{m.value}</strong>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mobile-exp-techs">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="mobile-tech-badge">{tech}</span>
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
