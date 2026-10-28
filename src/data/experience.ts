export interface ExperienceMetric {
  id: string
  label: string
  value: string
  icon?: string
}

export interface Experience {
  id: string
  company: string
  /** Nombre corto para la barra de la cronología; si falta, se usa la sigla entre paréntesis o el nombre completo */
  shortName?: string
  position: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
  logo?: string
  accent?: 'purple'
  highlights?: string[]
  metrics?: ExperienceMetric[]
}

export const experiences: Experience[] = [
  {
    id: 'esd-corporation',
    company: 'ESD Corporation',
    shortName: 'ESD',
    position: 'Analista de Sistemas e Infraestructura TI',
    startDate: 'Septiembre 2026',
    endDate: 'Actualidad',
    description:
      'Diseño y desarrollo herramientas internas mediante flujos multiagente de IA, y administro la infraestructura de servidores y nube de la empresa. Combino programación (Python, JavaScript, React) con servidores en AWS, Contabo y VMware para automatizar procesos y reducir tiempos de respuesta.',
    technologies: ['Flujos multiagente', 'Claude', 'Codex', 'Python', 'JavaScript', 'React', 'HTML', 'CSS', 'AWS', 'VMware ESXi', 'Contabo'],
    logo: '/assets/icons/esd-corporation-logo.svg',
    highlights: [
      'Diseñé la arquitectura y desarrollé un sistema de monitoreo de todas las impresoras de la red que mide tóner, páginas, alertas, fallas y consumo por área. Reduce el tiempo de respuesta ante fallas y evita quedarse sin tóner.',
      'Diseño y desarrollo un editor de PDF interno disponible en web, escritorio, Android, iOS y macOS, que reduce la dependencia de licencias de software externo.',
      'Oriento flujos multiagente con Claude, Codex, Antigravity y OpenCode para diseñar, programar y validar herramientas completas en menos tiempo, y automatizo tareas con Python y JavaScript.',
      'Construyo interfaces con React, HTML y CSS.',
      'Administro servidores en AWS, Contabo y VMware ESXi, incluido el que aloja el ERP: creación de máquinas virtuales, asignación de recursos, monitoreo y parches.',
    ],
    metrics: [
      { id: 'pdf-platforms', label: 'Plataformas del editor de PDF', value: '5', icon: 'devices' },
      { id: 'server-platforms', label: 'Plataformas de servidores gestionadas', value: '3', icon: 'server' },
      { id: 'users', label: 'Usuarios', value: '+50', icon: 'users' },
    ],
  },
  {
    id: 'ibcj',
    company: 'Iglesia Bautista de Cristo Jesús (IBCJ)',
    position: 'Desarrollador Full Stack',
    startDate: 'Marzo 2026',
    endDate: 'Actualidad',
    description:
      'Desarrollo de sistema web en colaboración con un equipo de desarrolladores voluntarios de la iglesia.',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Git', 'GitHub', 'Supabase'],
    logo: '/assets/icons/IBCJ-icon-512x512.png',
    highlights: [
      'Desarrollo de módulos para la gestión de miembros y ministerios.',
      'Implementación de autenticación segura con Supabase.',
      'Optimización de rendimiento y mejora de la experiencia de usuario.',
    ],
    metrics: [
      { id: 'users', label: 'Usuarios activos', value: '+50', icon: 'users' },
      { id: 'modules', label: 'Módulos desarrollados', value: '+5', icon: 'layers' },
      { id: 'uptime', label: 'Disponibilidad del sistema', value: '100%', icon: 'check-circle' },
    ],
  },
  {
    id: 'spn-software',
    company: 'SPN Software',
    position: 'Pasante',
    startDate: 'Enero 2026',
    endDate: 'Abril 2026',
    description:
      'Atención y resolución de incidencias técnicas, y apoyo en desarrollo de herramientas internas.',
    technologies: ['SQL', 'Crystal Reports', 'HTML', 'CSS', 'JavaScript', 'Python'],
    logo: '/assets/icons/spn_software_logo.jfif',
    accent: 'purple',
    highlights: [
      'Atención y resolución de incidencias técnicas internas.',
      'Desarrollo de pequeñas herramientas para optimizar procesos.',
      'Automatización de reportes y documentación técnica.',
    ],
    // Intentionally no metrics for SPN as requested
  },
]
