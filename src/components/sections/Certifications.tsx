import { useState, useEffect, useRef } from 'react'
import { certifications } from '../../data/certifications'
import { SectionTitle } from '../ui/SectionTitle'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Certifications() {
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()
  const total = certifications.length

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.cert-carousel', {
        scale: 0.9, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: '.cert-carousel', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  return (
    <section id="certificaciones" ref={sectionRef} style={{ background: 'rgba(10,10,18,0.5)' }}>
      <div className="container">
        <SectionTitle title="Certificaciones" />
        <div className="cert-carousel">
          <div className="cert-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {certifications.map((cert) => (
              <div key={cert.id} className="cert-slide">
                <img src={cert.image} alt={cert.title} loading="lazy" />
                <div className="cert-caption">
                  <h5>{cert.title}</h5>
                  <p>{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="cert-btn prev" onClick={prev} aria-label="Anterior">‹</button>
          <button className="cert-btn next" onClick={next} aria-label="Siguiente">›</button>
        </div>
        <div className="cert-dots">
          {certifications.map((_, i) => (
            <button
              key={i}
              className={`cert-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Certificación ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
