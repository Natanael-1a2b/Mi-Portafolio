import { useState } from 'react'
import { certifications } from '../../data/certifications'
import { SectionTitle } from '../ui/SectionTitle'
import { asset } from '../../utils/asset'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { useFadeIn } from '../../hooks/useFadeIn'

export function MobileCertifications() {
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
            effect={'coverflow'}
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
            modules={[EffectCoverflow, Pagination]}
            onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
            className="mobile-cert-swiper"
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
          
          <div className="mobile-cert-info-below">
            <h3>{activeCert?.title}</h3>
            <p>{activeCert?.issuer}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
