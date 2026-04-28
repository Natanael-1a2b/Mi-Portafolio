import { Suspense, useState, useEffect, useRef, lazy } from 'react'
import { Navbar } from './components/sections/Navbar'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Projects } from './components/sections/Projects'
import { Certifications } from './components/sections/Certifications'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { useWebGLSupport } from './hooks/useWebGLSupport'
import type { Skill } from './data/skills'

const Scene = lazy(() =>
  import('./components/canvas/Scene').then((m) => ({ default: m.Scene })),
)

export default function App() {
  const webglSupported = useWebGLSupport()
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  // Observe skills section to show/hide keyboard
  useEffect(() => {
    if (!webglSupported) return
    const target = document.getElementById('skills-canvas-mount')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setShowKeyboard(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [webglSupported])

  return (
    <>
      {/* 3D Background Canvas */}
      {webglSupported && (
        <div className="canvas-container">
          <Suspense fallback={null}>
            <Scene
              showKeyboard={showKeyboard}
              onSkillSelect={setSelectedSkill}
              selectedSkill={selectedSkill}
            />
          </Suspense>
        </div>
      )}

      {/* DOM Overlay */}
      <div className="dom-overlay" ref={skillsRef}>
        <Navbar />
        <Hero />
        <About />
        <Skills onSkillSelect={setSelectedSkill} selectedSkill={selectedSkill} />
        <Projects />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
