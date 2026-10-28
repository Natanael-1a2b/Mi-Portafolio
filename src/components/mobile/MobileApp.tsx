import { MobileNavbar } from './MobileNavbar'
import { MobileHero } from './MobileHero'
import { MobileAbout } from './MobileAbout'
import { MobileSkills } from './MobileSkills'
import { MobileExperience } from './MobileExperience'
import { MobileProjects } from './MobileProjects'
import { MobileGitHubStats } from './MobileGitHubStats'
import { MobileCertifications } from './MobileCertifications'
import { MobileContact } from './MobileContact'
import { MobileFooter } from './MobileFooter'

export default function MobileApp() {
  return (
    <div className="mobile-app dom-overlay">
      {/* La navegación va primero en el DOM (visualmente sigue fija abajo) */}
      <MobileNavbar />
      <main id="main-content" tabIndex={-1}>
        <MobileHero />
        <MobileAbout />
        <MobileSkills />
        <MobileExperience />
        <MobileProjects />
        <MobileGitHubStats />
        <MobileCertifications />
        <MobileContact />
      </main>
      <MobileFooter />
    </div>
  )
}
