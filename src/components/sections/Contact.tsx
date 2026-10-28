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
  // Al enfocar por código el primer campo con error, no hay que borrar ese error (handleFocus lo haría)
  const keepErrorOnFocusRef = useRef(false)
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

  // Solo el éxito se oculta solo; el error se queda para que dé tiempo a leer la alternativa
  useEffect(() => {
    if (alert?.type !== 'success') return
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
        if (!EMAIL_RE.test(value.trim())) return 'Email no válido. Usa el formato nombre@dominio.com'
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
    const firstInvalid = fields.find((f) => errors[f])
    const field = firstInvalid && document.getElementById(firstInvalid)
    if (field && document.activeElement !== field) {
      keepErrorOnFocusRef.current = true
      field.focus()
    }
    return !firstInvalid
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

  const clearFieldError = (target: HTMLInputElement | HTMLTextAreaElement) => {
    const name = target.name === 'Correo' ? 'correo' : target.name.toLowerCase()
    setFieldErrors((prev) => {
      if (!(name in prev)) return prev
      const next = { ...prev }
      delete next[name as keyof FieldErrors]
      return next
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (keepErrorOnFocusRef.current) {
      keepErrorOnFocusRef.current = false
      return
    }
    clearFieldError(e.target)
  }

  // Al editar se borra el error de inmediato; si se esperara al blur, el formulario se acortaría
  // justo al pulsar "Enviar" y el botón se movería bajo el cursor, perdiendo el clic
  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearFieldError(e.currentTarget)
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
        setAlert({ type: 'error', message: '✕ Error al enviar. Inténtalo de nuevo o contáctame vía LinkedIn o correo directamente.' })
      }
    } catch {
      setAlert({ type: 'error', message: '✕ Sin conexión. Revisa tu internet e inténtalo de nuevo, o contáctame vía LinkedIn o correo.' })
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
            {/* Región viva siempre montada: así los lectores de pantalla anuncian el resultado del envío */}
            <div role="status" aria-live="polite">
              {alert && (
                <div className={`alert alert-${alert.type}`}>
                  {alert.message}
                </div>
              )}
            </div>
            <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={sending}>
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
                    onInput={handleInput}
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
                    onInput={handleInput}
                    autoComplete="email"
                    spellCheck={false}
                    aria-describedby={fieldErrors.correo ? 'err-correo' : undefined}
                  />
                  {fieldErrors.correo && <span className="form-error" id="err-correo" role="alert">✕ {fieldErrors.correo}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="asunto" className="form-label">Asunto</label>
                <input type="text" id="asunto" className="form-control" placeholder="Asunto del mensaje" name="Asunto" autoComplete="off" />
              </div>
              <div className="form-group">
                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                  <textarea
                    id="mensaje"
                    className={`form-control${fieldErrors.mensaje ? ' form-control-error' : ''}`}
                    rows={5}
                    placeholder="Escribe tu mensaje aquí…"
                    name="Mensaje"
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onInput={handleInput}
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
                {sending ? 'Enviando…' : 'Enviar Mensaje'}
              </MagneticButton>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
