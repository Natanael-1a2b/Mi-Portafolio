import { useState } from 'react'
import { certifications } from '../../data/certifications'
import { SectionTitle } from '../ui/SectionTitle'
import { asset } from '../../utils/asset'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation, Keyboard, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useFadeIn } from '../../hooks/useFadeIn'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'

export function MobileCertifications() {
  const prefersReduced = usePreferredMotion()
  const [current, setCurrent] = useState(0)
  const activeCert = certifications[current]
  const ref = useFadeIn<HTMLElement>()

  return (
    <section id="certificaciones" className="mobile-section mobile-certs mobile-fade-in" ref={ref}>
      <div className="mobile-container">
        <SectionTitle 
          badge="LOGROS"
          title="Mis "
          gradientTitle="Certificaciones"
        />
        
        <div className="mobile-cert-carousel-wrapper">
          <Swiper
            // Swiper no cambia de efecto en caliente: la key lo vuelve a montar si cambia la preferencia
            key={prefersReduced ? 'slide' : 'coverflow'}
            effect={prefersReduced ? 'slide' : 'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            coverflowEffect={{
              rotate: 40,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            // Alternativas al gesto de deslizar: flechas, teclado y bullets enfocables
            navigation={true}
            keyboard={{ enabled: true, onlyInViewport: true }}
            a11y={{
              prevSlideMessage: 'Certificación anterior',
              nextSlideMessage: 'Certificación siguiente',
              paginationBulletMessage: 'Ir a la certificación {{index}}',
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Keyboard, A11y]}
            onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
            className="mobile-cert-swiper"
            aria-label="Galería de certificaciones"
          >
            {certifications.map((cert) => (
              <SwiperSlide key={cert.id} className="mobile-cert-slide">
                <div className="mobile-cert-img">
                  <img 
                    src={asset(cert.image)} 
                    alt={cert.title} 
                    loading="lazy" 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="mobile-cert-info-below" aria-live="polite">
            <h3>{activeCert?.title}</h3>
            <p>{activeCert?.issuer}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
