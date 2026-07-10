import { useState, useEffect } from 'react'

export function MobileNavbar() {
  const [activeTab, setActiveTab] = useState('#inicio')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(`#${entry.target.id}`)
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )

    const sections = ['inicio', 'habilidades', 'proyectos', 'certificaciones', 'contacto']
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setActiveTab(href)
    const el = document.querySelector(href)
    if (el) {
      window.scrollTo({ top: (el as HTMLElement).offsetTop - 20, behavior: 'smooth' })
    }
  }

  return (
    <nav className="mobile-navbar">
      <div className="mobile-nav-container">
        <a 
          href="#inicio" 
          className={`mobile-nav-item ${activeTab === '#inicio' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, '#inicio')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Inicio</span>
        </a>
        <a 
          href="#habilidades" 
          className={`mobile-nav-item ${activeTab === '#habilidades' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, '#habilidades')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>
          <span>Skills</span>
        </a>
        <a 
          href="#proyectos" 
          className={`mobile-nav-item ${activeTab === '#proyectos' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, '#proyectos')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
          <span>Proyectos</span>
        </a>
        <a 
          href="#certificaciones" 
          className={`mobile-nav-item ${activeTab === '#certificaciones' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, '#certificaciones')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <span>Certificaciones</span>
        </a>
        <a 
          href="#contacto" 
          className={`mobile-nav-item ${activeTab === '#contacto' ? 'active' : ''}`}
          onClick={(e) => handleClick(e, '#contacto')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>Contacto</span>
        </a>
      </div>
    </nav>
  )
}
