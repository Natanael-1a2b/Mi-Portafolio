export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
}

export const experiences: Experience[] = [
  {
    id: 'ibcj',
    company: 'Iglesia Bautista de Cristo Jesús (IBCJ)',
    position: 'Desarrollador Full Stack',
    startDate: 'Marzo 2026',
    endDate: 'Actualidad',
    description:
      'Desarrollo de sistema web en colaboración con un equipo de desarrolladores voluntarios de la iglesia.',
    technologies: ['React', 'TypeScript', 'Supabase'],
  },
  {
    id: 'spn-software',
    company: 'SPN Software',
    position: 'Pasante',
    startDate: 'Enero 2026',
    endDate: 'Abril 2026',
    description:
      'Gestor Mesa de Ayuda SPN y Desarrollo de Software.',
    technologies: ['SQL', 'Crystal Reports', 'HTML', 'CSS', 'JavaScript', 'Python'],
  },
]
