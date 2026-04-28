import { useState, useRef, useEffect } from 'react'
import { personalInfo } from '../../data/personal'
import { SectionTitle } from '../ui/SectionTitle'
import { GlassCard } from '../ui/GlassCard'
import { MagneticButton } from '../ui/MagneticButton'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type AlertState = { type: 'success' | 'error'; message: string } | null

export function Contact() {
  const [alert, setAlert] = useState<AlertState>(null)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.contact-form', {
        scale: 0.9, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

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
        setAlert({ type: 'success', message: '✓ Mensaje enviado correctamente' })
      } else {
        setAlert({ type: 'error', message: '✕ Error al enviar el mensaje' })
      }
    } catch {
      setAlert({ type: 'error', message: '✕ Error al enviar el mensaje' })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" ref={sectionRef}>
      <div className="container">
        <SectionTitle title="Contacto" />
        <div className="contact-wrapper">
          <GlassCard className="contact-form">
            {alert && (
              <div className={`alert alert-${alert.type}`}>
                {alert.message}
              </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="form-row">
                <input type="text" className="form-control" placeholder="Nombre" name="Nombre" required />
                <input type="email" className="form-control" placeholder="Email" name="Correo" required />
              </div>
              <input type="text" className="form-control" placeholder="Asunto" name="Asunto" />
              <textarea className="form-control" rows={5} placeholder="Mensaje" name="Mensaje" required />
              <MagneticButton
                as="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                type="submit"
              >
                {sending ? 'Enviando...' : 'Enviar Mensaje'}
              </MagneticButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
