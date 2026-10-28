import { useState, useRef } from 'react'
import { personalInfo } from '../../data/personal'
import { SectionTitle } from '../ui/SectionTitle'
import { useFadeIn } from '../../hooks/useFadeIn'

export function MobileContact() {
  const [sending, setSending] = useState(false)
  const [alert, setAlert] = useState<{type: 'success' | 'error', msg: string} | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useFadeIn<HTMLElement>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setSending(true)
    setAlert(null)
    
    try {
      const res = await fetch(personalInfo.formspreeAction, {
        method: 'POST',
        body: new FormData(formRef.current),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        formRef.current.reset()
        setAlert({ type: 'success', msg: 'Mensaje enviado correctamente' })
      } else {
        setAlert({ type: 'error', msg: 'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme por WhatsApp o correo.' })
      }
    } catch {
      setAlert({ type: 'error', msg: 'Sin conexión. Revisa tu internet e inténtalo de nuevo.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" className="mobile-section mobile-contact mobile-fade-in" ref={sectionRef}>
      <div className="mobile-container">
        <SectionTitle 
          badge="HABLEMOS"
          title="Ponte en "
          gradientTitle="Contacto"
        />
        
        <div className="mobile-contact-form-wrapper">
          {/* Región viva siempre montada: así los lectores de pantalla anuncian el resultado del envío */}
          <div role="status" aria-live="polite">
            {alert && (
              <div className={`mobile-alert mobile-alert-${alert.type}`}>
                {alert.msg}
              </div>
            )}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="mobile-form" aria-busy={sending}>
            <div className="mobile-form-group">
              <label htmlFor="mobile-nombre">Nombre</label>
              <input type="text" id="mobile-nombre" name="Nombre" required placeholder="Tu nombre" autoComplete="name" />
            </div>

            <div className="mobile-form-group">
              <label htmlFor="mobile-correo">Email</label>
              <input type="email" id="mobile-correo" name="Correo" required placeholder="tu@email.com" autoComplete="email" spellCheck={false} />
            </div>

            <div className="mobile-form-group">
              <label htmlFor="mobile-asunto">Asunto</label>
              <input type="text" id="mobile-asunto" name="Asunto" placeholder="Motivo de tu mensaje" autoComplete="off" />
            </div>

            <div className="mobile-form-group">
              <label htmlFor="mobile-mensaje">Mensaje</label>
              <textarea id="mobile-mensaje" name="Mensaje" required rows={4} placeholder="Escribe aquí…"></textarea>
            </div>

            <button type="submit" disabled={sending} className="mobile-btn-submit">
              {sending ? 'Enviando…' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
