import { useState, useRef, useEffect } from 'react'
import { personalInfo } from '../../data/personal'
import { SectionTitle } from '../ui/SectionTitle'
import { GlassCard } from '../ui/GlassCard'
import { MagneticButton } from '../ui/MagneticButton'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type AlertState = { type: 'success' | 'error'; message: string } | null

interface FieldErrors {
  nombre?: string
  correo?: string
  mensaje?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Contact() {
  const [alert, setAlert] = useState<AlertState>(null)
  const [sending, setSending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-form', 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, scrollTrigger: { trigger: '.contact-form', start: 'top 80%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 5000)
    return () => clearTimeout(timer)
  }, [alert])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio'
        if (value.trim().length < 2) return 'Mínimo 2 caracteres'
        return undefined
      case 'correo':
        if (!value.trim()) return 'El email es obligatorio'
        if (!EMAIL_RE.test(value.trim())) return 'Email no válido'
        return undefined
      case 'mensaje':
        if (!value.trim()) return 'El mensaje es obligatorio'
        if (value.trim().length < 10) return 'Mínimo 10 caracteres'
        return undefined
      default:
        return undefined
    }
  }

  const validateAll = (): boolean => {
    if (!formRef.current) return false
    const fd = new FormData(formRef.current)
    const errors: FieldErrors = {}
    const fields: (keyof FieldErrors)[] = ['nombre', 'correo', 'mensaje']
    fields.forEach((f) => {
      const err = validateField(f, (fd.get(f === 'correo' ? 'Correo' : f.charAt(0).toUpperCase() + f.slice(1)) as string) || '')
      if (err) errors[f] = err
    })
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const key = name === 'Correo' ? 'correo' : name.toLowerCase()
    const err = validateField(key, value)
    setFieldErrors((prev) => {
      const next = { ...prev }
      if (err) next[key as keyof FieldErrors] = err
      else delete next[key as keyof FieldErrors]
      return next
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name === 'Correo' ? 'correo' : e.target.name.toLowerCase()
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name as keyof FieldErrors]
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    if (!validateAll()) return
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
        setFieldErrors({})
        setAlert({ type: 'success', message: '✓ Mensaje enviado correctamente' })
      } else {
        setAlert({ type: 'error', message: '✕ Error al enviar. Por favor, contáctame vía LinkedIn o correo directamente.' })
      }
    } catch {
      setAlert({ type: 'error', message: '✕ Error al enviar. Por favor, contáctame vía LinkedIn o correo directamente.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" ref={sectionRef} className="section-alt" style={{ position: 'relative' }}>
      <SectionAtmosphere />
      <div className="container">
        <SectionTitle 
          badge="HABLEMOS"
          title="Ponte en "
          gradientTitle="Contacto"
          subtitle="¿Tienes un proyecto en mente? Escríbeme."
        />
        <div className="contact-wrapper">
          <GlassCard className="contact-form">
            {alert && (
              <div className={`alert alert-${alert.type}`}>
                {alert.message}
              </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    className={`form-control${fieldErrors.nombre ? ' form-control-error' : ''}`}
                    placeholder="Tu nombre"
                    name="Nombre"
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    autoComplete="name"
                    aria-describedby={fieldErrors.nombre ? 'err-nombre' : undefined}
                  />
                  {fieldErrors.nombre && <span className="form-error" id="err-nombre" role="alert">✕ {fieldErrors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="correo" className="form-label">Email</label>
                  <input
                    type="email"
                    id="correo"
                    className={`form-control${fieldErrors.correo ? ' form-control-error' : ''}`}
                    placeholder="tu@email.com"
                    name="Correo"
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    autoComplete="email"
                    aria-describedby={fieldErrors.correo ? 'err-correo' : undefined}
                  />
                  {fieldErrors.correo && <span className="form-error" id="err-correo" role="alert">✕ {fieldErrors.correo}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="asunto" className="form-label">Asunto</label>
                <input type="text" id="asunto" className="form-control" placeholder="Asunto del mensaje" name="Asunto" autoComplete="subject" />
              </div>
              <div className="form-group">
                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                  <textarea
                    id="mensaje"
                    className={`form-control${fieldErrors.mensaje ? ' form-control-error' : ''}`}
                    rows={5}
                    placeholder="Escribe tu mensaje aquí..."
                    name="Mensaje"
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    aria-describedby={fieldErrors.mensaje ? 'err-mensaje' : undefined}
                  />
                  {fieldErrors.mensaje && <span className="form-error" id="err-mensaje" role="alert">✕ {fieldErrors.mensaje}</span>}
              </div>
              <MagneticButton
                as="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                type="submit"
                disabled={sending}
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
