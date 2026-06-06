import { useState, useRef, useEffect } from 'react'
import { certifications } from '../../data/certifications'
import { asset } from '../../utils/asset'
import { SectionTitle } from '../ui/SectionTitle'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'

gsap.registerPlugin(ScrollTrigger)

export function Certifications() {
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.cert-thumb-grid',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, clearProps: "all", scrollTrigger: { trigger: '.cert-split-layout', start: 'top 85%', once: true } }
      )
      gsap.fromTo('.cert-preview',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, clearProps: "all", scrollTrigger: { trigger: '.cert-split-layout', start: 'top 85%', once: true } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const activeCert = certifications[current]

  return (
    <section id="certificaciones" ref={sectionRef} style={{ background: 'rgba(10,10,18,0.5)', position: 'relative' }}>
      <SectionAtmosphere variant="minimal" withScanLines={true} glowPosition="none" />
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionTitle title="Certificaciones" />
        
        <div className="cert-split-layout">
          {/* Left Column: Interactive Thumbnail Grid */}
          <div className="cert-thumb-grid">
            {certifications.map((cert, i) => (
              <div
                key={cert.id}
                className={`cert-thumb-item ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
              >
                <img src={asset(cert.image)} alt={cert.title} loading="lazy" decoding="async" />
                <div className="cert-thumb-overlay">
                  Ver Certificado
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Preview Panel */}
          <div className="cert-preview">
            <div className="cert-preview-img-wrapper">
              <img
                src={asset(activeCert.image)}
                alt={activeCert.title}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="cert-preview-info">
              <h3>{activeCert.title}</h3>
              <p>{activeCert.issuer}</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}
