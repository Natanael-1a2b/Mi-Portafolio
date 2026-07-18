import { useState, useEffect } from 'react'
import { navLinks, personalInfo } from '../../data/personal'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const onScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 50)

      if (currentScrollY > lastScrollY && currentScrollY > 150 && !menuOpen) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    const ids = navLinks.map(l => l.href.slice(1))
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      window.scrollTo({ top: (el as HTMLElement).offsetTop - 70, behavior: 'smooth' })
    }
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`}>
      <div className="navbar-container">

        {/* LOGO */}
        <a
          href="#inicio"
          className="navbar-logo"
          onClick={(e) => handleClick(e, '#inicio')}
        >
          {personalInfo.brandInitials}
        </a>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeSection === link.href ? 'active' : ''}`}
              onClick={(e) => handleClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}

          {/* CTA SOLO PARA MOBILE */}
          <a
            href="#contacto"
            className="cta-button mobile-cta"
            onClick={(e) => handleClick(e, '#contacto')}
          >
            Contáctame
            <span>&rarr;</span>
          </a>
        </nav>

        {/* CTA DESKTOP */}
        <div className="navbar-actions">
          <a
            href="#contacto"
            className="cta-button desktop-cta"
            onClick={(e) => handleClick(e, '#contacto')}
          >
            Contáctame
            <span>&rarr;</span>
          </a>
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

      </div>
    </header>
  )
}
