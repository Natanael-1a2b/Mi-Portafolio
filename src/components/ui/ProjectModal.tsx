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

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (project) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setGalleryIdx(0)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [project, handleEscape])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const gallery = project?.gallery
  const hasGallery = gallery && gallery.length > 1

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

          {hasGallery ? (
            <div className="modal-gallery">
              <img
                src={asset(gallery[galleryIdx])}
                alt={`${project.title} - ${galleryIdx + 1}`}
                className="modal-img"
              />
              <button
                className="modal-gallery-btn modal-gallery-prev"
                onClick={() => setGalleryIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className="modal-gallery-btn modal-gallery-next"
                onClick={() => setGalleryIdx((i) => (i + 1) % gallery.length)}
                aria-label="Siguiente"
              >
                ›
              </button>
              <div className="modal-gallery-dots">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    className={`modal-gallery-dot ${i === galleryIdx ? 'active' : ''}`}
                    onClick={() => setGalleryIdx(i)}
                    aria-label={`Imagen ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <img
              src={asset(project.image)}
              alt={project.title}
              className="modal-img"
            />
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

          <p className="modal-desc">{project.fullDescription}</p>
        </div>
      )}
    </div>,
    document.body,
  )
}
