import { skills } from './skills'

export const personalInfo = {
  name: 'Claudio N. Beltre R.',
  brandInitials: 'CNB',
  phone: '829-856-9592',
  email: 'natanaelbeltre03@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/claudio-natanael-beltre-rosario-38a580327/',
  github: 'https://github.com/Natanael-1a2b',
  whatsapp: 'https://wa.me/18298569592',
  profileImage: '/assets/images/Porfile.webp',
  cvPath: '/assets/Curriculum Claudio N. Beltre R.pdf',
  formspreeAction: 'https://formspree.io/f/mnnzwnyd',
}

export const heroContent = {
  badge: 'FULL STACK & CLOUD ENGINEER',
  title: 'Software Full Stack y Cloud,',
  titleHighlight: 'potenciado con IA',
  // Se muestra en mayúsculas por CSS
  subtitle: 'IA y flujos multiagente | React y TypeScript | .NET y Clean Architecture',
  description:
    'Diseño y construyo sistemas completos, del backend a la interfaz y a la nube, y los llevo a producción con usuarios reales. Oriento flujos multiagente de IA para entregar soluciones robustas, mantenibles y escalables.',
  // Efecto de tipeo en escritorio: rota las mismas especialidades del subtítulo
  typingPhrases: [
    'IA y flujos multiagente',
    'React y TypeScript',
    '.NET y Clean Architecture',
  ],
}

// Stack principal del hero, en este orden. VMware ESXi no está en la sección de habilidades,
// así que se define aquí con el ícono local de Simple Icons.
const HERO_STACK_IDS = ['dotnet', 'react', 'typescript', 'python', 'vmware', 'supabase', 'sqlserver']
const HERO_STACK_EXTRA: Record<string, { id: string; name: string; icon: string }> = {
  vmware: { id: 'vmware', name: 'VMware ESXi', icon: '/assets/icons/vmware.svg' },
}

export const heroStack = HERO_STACK_IDS
  .map(id => HERO_STACK_EXTRA[id] ?? skills.find(s => s.id === id))
  .filter((t): t is { id: string; name: string; icon: string } => !!t)

export const aboutContent = {
  paragraphs: [
    'Mi base técnica la construí en el <span class="tech-badge tech-badge-blue">ITLA</span>, y actualmente curso la carrera de Ingeniería de Software en la universidad, especializado en el ecosistema <span class="tech-badge tech-badge-blue">.NET</span> y <span class="tech-badge tech-badge-cyan">React</span>. Construyo aplicaciones completas con arquitecturas limpias —APIs RESTful con Clean Architecture, frontends modulares con React— y las llevo hasta producción con usuarios reales.',
    'En <span class="tech-badge tech-badge-purple">SPN Software</span> trabajé con sistemas usados por miles de usuarios, donde aprendí Crystal Reports y refiné mi SQL resolviendo incidencias en producción. Hoy desarrollo un sistema web completo para la <span class="neon-text">Iglesia Bautista Cristo Jesús (IBCJ)</span> con React + Supabase, atendiendo a más de 50 miembros activos —y perfeccionando el frontend en el proceso.',
    'Lo que me mueve es diseñar arquitecturas que resuelvan problemas reales de negocio. No solo código que funcione: código que escale, que sea mantenible, y que alguien más pueda entender sin llamarme a las 2 AM. Cada proyecto es una oportunidad de aplicar principios SOLID, patrones de diseño y sentido común.',
    'Hoy integro <span class="tech-badge tech-badge-purple">Agentes de IA</span> en mi flujo de trabajo usando protocolos como <span class="neon-text">MCP (Model Context Protocol)</span> y Skills, combinando mi base técnica con herramientas que multiplican la productividad y la innovación.',
  ],
}

export const footerContent = {
  description:
    'Full Stack & Cloud Engineer enfocado en soluciones modernas, escalables y potenciadas con IA.',
  services: ['Desarrollo Web', 'APIs REST', 'Sistemas Administrativos', 'Agentes de IA'],
  ctaTitle: '¿Listo para llevar tu proyecto al siguiente nivel?',
  ctaDescription:
    'Disponible para proyectos freelance, trabajo remoto o colaboración por contrato.',
  copyright: '© 2026 CNB · Desarrollo de Software & Soluciones Digitales.',
}

export const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sobre-mi', label: 'Sobre Mí' },
  { href: '#habilidades', label: 'Habilidades' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#github', label: 'GitHub' },
  { href: '#certificaciones', label: 'Certificaciones' },
  { href: '#contacto', label: 'Contacto' },
]
