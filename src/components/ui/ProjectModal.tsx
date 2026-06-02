import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../data/projects'
import { asset } from '../../utils/asset'

interface Props {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!project) return
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    setGalleryIdx(0)
    setViewMode('desktop') // Reset
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [project, handleEscape])

  // Lógica de auto-play
  const hasMixedGallery = !!(project?.desktopGallery || project?.mobileGallery)
  const activeGallery = hasMixedGallery 
    ? (viewMode === 'desktop' ? project?.desktopGallery : project?.mobileGallery)
    : project?.gallery

  const hasGallery = activeGallery && activeGallery.length > 1

  useEffect(() => {
    if (!hasGallery || !activeGallery || isFullscreen) return
    const timer = setInterval(() => {
      setGalleryIdx((i) => (i + 1) % activeGallery.length)
    }, 3500) // Cambia de imagen cada 3.5 segundos
    return () => clearInterval(timer)
  }, [hasGallery, activeGallery, isFullscreen, galleryIdx])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }


  const showSingleImage = !activeGallery && project?.image
  const currentImage = activeGallery ? activeGallery[galleryIdx] : project?.image

  return createPortal(
    <div
      className={`modal-overlay ${project ? 'open' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!project}
    >
      {project && (
        <div className="modal-box" role="dialog" aria-label={project.title}>
          <div className="modal-header">
            <h3 className="modal-title">{project.title}</h3>
            <button className="modal-close" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
          </div>

          {hasMixedGallery && (
            <div className="mockup-tabs">
              {project.desktopGallery && (
                <button 
                  className={`mockup-tab-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                  onClick={() => { setViewMode('desktop'); setGalleryIdx(0); }}
                >
                  💻 Vista Escritorio
                </button>
              )}
              {project.mobileGallery && (
                <button 
                  className={`mockup-tab-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                  onClick={() => { setViewMode('mobile'); setGalleryIdx(0); }}
                >
                  📱 Vista Móvil
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
                ⛶
              </button>
              
              <div 
                className="modal-gallery-track" 
                style={{ 
                  display: 'flex', 
                  width: '100%',
                  transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                  transform: `translateX(-${galleryIdx * 100}%)`,
                  alignItems: 'center'
                }}
              >
                {activeGallery ? activeGallery.map((img, i) => (
                  <div key={i} style={{ flex: '0 0 100%', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={asset(img)}
                      alt={`${project.title} - ${i + 1}`}
                      className="modal-img"
                      onClick={() => setIsFullscreen(true)}
                      style={{ cursor: 'zoom-in' }}
                    />
                  </div>
                )) : (
                  <div style={{ flex: '0 0 100%', display: 'flex', justifyContent: 'center' }}>
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
              {hasGallery && activeGallery && (
                <>
                  <button
                    className="modal-gallery-btn modal-gallery-prev"
                    onClick={() => setGalleryIdx((i) => (i - 1 + activeGallery.length) % activeGallery.length)}
                    aria-label="Anterior"
                  >
                    ‹
                  </button>
                  <button
                    className="modal-gallery-btn modal-gallery-next"
                    onClick={() => setGalleryIdx((i) => (i + 1) % activeGallery.length)}
                    aria-label="Siguiente"
                  >
                    ›
                  </button>
                  <div className="modal-gallery-dots">
                    {activeGallery.map((_, i) => (
                      <button
                        key={i}
                        className={`modal-gallery-dot ${i === galleryIdx ? 'active' : ''}`}
                        onClick={() => setGalleryIdx(i)}
                        aria-label={`Imagen ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {project.videoId && (
            <iframe
              className="modal-video"
              src={`https://www.youtube.com/embed/${project.videoId}?rel=0`}
              title={`Video de ${project.title}`}
              allowFullScreen
            />
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
                className={project.repoUrl.includes('github.com') ? "github-link-btn" : "live-link-btn"}
              >
                {project.repoUrl.includes('github.com') ? "Ver Código en GitHub" : "Ir a la Aplicación en Producción"}
              </a>
            </div>
          )}
        </div>
      )}

      {isFullscreen && project && (
        <div className="fullscreen-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setIsFullscreen(false)
        }}>
          <button className="fullscreen-close" onClick={() => setIsFullscreen(false)}>✕</button>
          
          {hasGallery && activeGallery && (
            <button
              className="fullscreen-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIdx((i) => (i - 1 + activeGallery.length) % activeGallery.length);
              }}
              aria-label="Anterior"
            >
              ‹
            </button>
          )}

          <div 
            className="fullscreen-gallery-track" 
            style={{ 
              display: 'flex', 
              width: '100%', height: '100%',
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `translateX(-${galleryIdx * 100}%)`
            }}
          >
            {activeGallery ? activeGallery.map((img, i) => (
              <div key={i} style={{ flex: '0 0 100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={asset(img)}
                  alt="Fullscreen"
                  className="fullscreen-img"
                />
              </div>
            )) : (
              <div style={{ flex: '0 0 100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={asset(currentImage as string)}
                  alt="Fullscreen"
                  className="fullscreen-img"
                />
              </div>
            )}
          </div>

          {hasGallery && activeGallery && (
            <button
              className="fullscreen-nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIdx((i) => (i + 1) % activeGallery.length);
              }}
              aria-label="Siguiente"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>,
    document.body,
  )
}
