import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../data/projects'
import { asset } from '../../utils/asset'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Props {
  project: Project | null
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not("-1")'

export function ProjectModal({ project, onClose }: Props) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [closing, setClosing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 250)
  }, [onClose])

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          handleClose()
        }
      }
    },
    [handleClose, isFullscreen],
  )

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  useEffect(() => {
    if (!project) return
    prevFocusRef.current = document.activeElement as HTMLElement
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', trapFocus)
    document.body.style.overflow = 'hidden'
    setViewMode('desktop')
    setIsFullscreen(false)
    requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    })
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', trapFocus)
      document.body.style.overflow = ''
      prevFocusRef.current?.focus()
    }
  }, [project, handleEscape, trapFocus])

  const hasMixedGallery = !!(project?.desktopGallery || project?.mobileGallery)
  const activeGallery = hasMixedGallery 
    ? (viewMode === 'desktop' ? project?.desktopGallery : project?.mobileGallery)
    : project?.gallery

  const hasGallery = activeGallery && activeGallery.length > 1
  const showSingleImage = !activeGallery && project?.image
  const currentImage = activeGallery ? activeGallery[0] : project?.image

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // To force re-render of Swiper when gallery changes
  const swiperKey = project?.id + '-' + viewMode

  return createPortal(
    <div
      className={`modal-overlay ${project ? 'open' : ''}${closing ? ' closing' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!project}
    >
      {project && (
        <div className="modal-box" role="dialog" aria-modal="true" aria-label={project.title} ref={dialogRef}>
          <div className="modal-header">
            <h3 className="modal-title">{project.title}</h3>
            <button className="modal-close" onClick={handleClose} aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {hasMixedGallery && (
            <div className="mockup-tabs">
              {project.desktopGallery && (
                <button 
                  className={`mockup-tab-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                  onClick={() => setViewMode('desktop')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  Vista Escritorio
                </button>
              )}
              {project.mobileGallery && (
                <button 
                  className={`mockup-tab-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                  onClick={() => setViewMode('mobile')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                  Vista Móvil
                </button>
              )}
            </div>
          )}

          {(activeGallery || showSingleImage) && (
            <div className="modal-gallery" style={{ marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
              <button 
                className="expand-btn" 
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                title="Ver en pantalla completa"
                style={{ zIndex: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 3 21 3 21 9"/>
                  <polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
              
              {hasGallery ? (
                <Swiper
                  key={swiperKey}
                  modules={[Navigation, Pagination, Autoplay, Keyboard]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  keyboard={{ enabled: true }}
                  loop={true}
                  lazyPreloadPrevNext={1}
                  className="modal-swiper"
                  style={{ width: '100%', '--swiper-theme-color': '#00BFFF' } as React.CSSProperties}
                >
                  {activeGallery.map((img, i) => (
                    <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={asset(img)}
                        alt={`${project.title} - ${i + 1}`}
                        className="modal-img"
                        onClick={() => setIsFullscreen(true)}
                        style={{ cursor: 'zoom-in' }}
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={asset(currentImage as string)}
                    alt={project.title}
                    className="modal-img"
                    onClick={() => setIsFullscreen(true)}
                    style={{ cursor: 'zoom-in' }}
                  />
                </div>
              )}
            </div>
          )}

          {project.videoId && (
            <div className="modal-video-wrapper" style={{ width: '100%' }}>
              <iframe
                className="modal-video"
                src={`https://www.youtube.com/embed/${project.videoId}?rel=0`}
                title={`Video de ${project.title}`}
                allowFullScreen
              />
            </div>
          )}

          <div className="modal-techs">
            <h6 style={{ width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}>
              Tecnologías utilizadas:
            </h6>
            {project.technologies.map((tech) => (
              <span key={tech} className="badge">
                {tech}
              </span>
            ))}
          </div>

          <p className="modal-desc" style={{ whiteSpace: 'pre-wrap' }}>{project.fullDescription}</p>

          {project.repoUrl && project.repoUrl !== '#' && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a 
                href={project.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="live-link-btn"
              >
                Ir a la Aplicación en Producción
              </a>
            </div>
          )}
        </div>
      )}

      {isFullscreen && project && (
        <div className="fullscreen-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setIsFullscreen(false)
        }}>
          <button className="fullscreen-close" onClick={() => setIsFullscreen(false)} aria-label="Cerrar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          {hasGallery ? (
            <Swiper
              key={`fs-${swiperKey}`}
              modules={[Navigation, Pagination, Keyboard]}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              loop={true}
              lazyPreloadPrevNext={2}
              className="fullscreen-swiper"
              style={{ width: '100%', height: '100%', '--swiper-theme-color': '#fff' } as React.CSSProperties}
            >
              {activeGallery.map((img, i) => (
                <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={asset(img)}
                    alt="Fullscreen"
                    className="fullscreen-img"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={asset(currentImage as string)}
                alt="Fullscreen"
                className="fullscreen-img"
              />
            </div>
          )}
        </div>
      )}
    </div>,
    document.body,
  )
}
