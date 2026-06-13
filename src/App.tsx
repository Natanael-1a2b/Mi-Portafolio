import { lazy, Suspense } from 'react'
import { Navbar } from './components/sections/Navbar'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Projects } from './components/sections/Projects'
import { Certifications } from './components/sections/Certifications'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'

const GitHubStats = lazy(() => import('./components/sections/GitHubStats').then(m => ({ default: m.GitHubStats })))

export default function App() {
  return (
    <>
      <div className="dom-overlay" id="main-content">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Suspense fallback={<div className="gh-section-skeleton" />}>
          <GitHubStats />
        </Suspense>
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
