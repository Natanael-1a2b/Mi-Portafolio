import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../../data/projects'

interface Props {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
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
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [project, handleEscape])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

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

          <img
            src={project.image}
            alt={project.title}
            className="modal-img"
          />

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

          {project.repoUrl && project.repoUrl !== '#' && (
            <div style={{ textAlign: 'center' }}>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Ver Repositorio
              </a>
            </div>
          )}
        </div>
      )}
    </div>,
    document.body,
  )
}
