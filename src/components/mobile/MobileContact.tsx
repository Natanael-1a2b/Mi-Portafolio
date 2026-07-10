import { useState, useRef } from 'react'
import { personalInfo } from '../../data/personal'
import { SectionTitle } from '../ui/SectionTitle'

export function MobileContact() {
  const [sending, setSending] = useState(false)
  const [alert, setAlert] = useState<{type: 'success' | 'error', msg: string} | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

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
        setAlert({ type: 'error', msg: 'Error al enviar mensaje' })
      }
    } catch {
      setAlert({ type: 'error', msg: 'Error de conexión' })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" className="mobile-section mobile-contact">
      <div className="mobile-container">
        <SectionTitle 
          badge="HABLEMOS"
          title="Ponte en "
          gradientTitle="Contacto"
        />
        
        <div className="mobile-contact-form-wrapper">
          {alert && (
            <div className={`mobile-alert mobile-alert-${alert.type}`}>
              {alert.msg}
            </div>
          )}
          
          <form ref={formRef} onSubmit={handleSubmit} className="mobile-form">
            <div className="mobile-form-group">
              <label htmlFor="mobile-nombre">Nombre</label>
              <input type="text" id="mobile-nombre" name="Nombre" required placeholder="Tu nombre" />
            </div>
            
            <div className="mobile-form-group">
              <label htmlFor="mobile-correo">Email</label>
              <input type="email" id="mobile-correo" name="Correo" required placeholder="tu@email.com" />
            </div>
            
            <div className="mobile-form-group">
              <label htmlFor="mobile-asunto">Asunto</label>
              <input type="text" id="mobile-asunto" name="Asunto" placeholder="Motivo de tu mensaje" />
            </div>
            
            <div className="mobile-form-group">
              <label htmlFor="mobile-mensaje">Mensaje</label>
              <textarea id="mobile-mensaje" name="Mensaje" required rows={4} placeholder="Escribe aquí..."></textarea>
            </div>
            
            <button type="submit" disabled={sending} className="mobile-btn-submit">
              {sending ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
