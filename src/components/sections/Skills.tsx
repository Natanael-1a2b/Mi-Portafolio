import { skills } from '../../data/skills'
import { BentoGrid } from '../ui/BentoGrid'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { SectionTitle } from '../ui/SectionTitle'

// Las animaciones de esta sección viven en BentoGrid
export function Skills() {
  return (
    <section id="habilidades" className="skills-bento-section">
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
