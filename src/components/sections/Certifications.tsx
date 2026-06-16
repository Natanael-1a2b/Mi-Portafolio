import { useState, useRef, useEffect } from 'react'
import { certifications } from '../../data/certifications'
import { asset } from '../../utils/asset'
import { SectionTitle } from '../ui/SectionTitle'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

gsap.registerPlugin(ScrollTrigger)

export function Certifications() {
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.cert-carousel-wrapper',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, clearProps: "all", scrollTrigger: { trigger: '.cert-carousel-wrapper', start: 'top 85%', once: true } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const activeCert = certifications[current]

  return (
    <section id="certificaciones" ref={sectionRef} style={{ background: 'rgba(10,10,18,0.5)', position: 'relative' }}>
      <SectionAtmosphere />
      <div className="container">
        <SectionTitle 
          badge="LOGROS"
          title="Mis "
          gradientTitle="Certificaciones"
          subtitle="Validaciones de mis conocimientos y habilidades."
        />
        
        <div className="cert-carousel-wrapper">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 40,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
            className="cert-swiper"
            aria-label="Galería de certificaciones"
          >
            {certifications.map((cert) => (
              <SwiperSlide key={cert.id} className="cert-slide">
                <img 
                  src={asset(cert.image)} 
                  alt={cert.title} 
                  loading="lazy" 
                  decoding="async" 
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="cert-info-below">
            <h3>{activeCert?.title}</h3>
            <p>{activeCert?.issuer}</p>
          </div>
        </div>
        
      </div>
    </section>
  )
}
