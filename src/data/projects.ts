export interface Project {
  id: string
  title: string
  image: string
  shortDescription: string
  fullDescription: string
  badges: string[]
  technologies: string[]
  videoId: string
  repoUrl: string
  gallery?: string[]
  desktopGallery?: string[]
  mobileGallery?: string[]
  isPWA?: boolean
}

export const projects: Project[] = [
  {
    id: 'gestor-pwa',
    title: 'Gestor de Tareas y Hábitos',
    image: '/assets/images/Gestor de tareas/portada.webp',
    shortDescription: 'Plataforma integral de productividad (PWA) con gestión de tareas, calendario interactivo y seguimiento de hábitos diario.',
    fullDescription: `Este proyecto es una plataforma de productividad diseñada para usuarios que necesitan organizar tareas, seguir hábitos y mantener una visión clara de su progreso a través de visualizaciones interactivas.

Desarrollada como PWA: Permite instalación directa sin pasar por App Stores, ofrece funcionamiento Offline y tiempos de carga instantáneos gracias a los Service Workers.

Características Principales:
- Gestión de tareas con prioridades, fechas de vencimiento, etiquetas y filtros avanzados. Tablero Kanban incluido.
- Vista de calendario para visualizar tareas diarias y carga semanal/mensual.
- Sistema de seguimiento de hábitos con estados rápidos, analíticas y cronogramas tipo "contribution graph".
- Drag & Drop accesible para reordenar hábitos y mover tareas entre estados.
- Autenticación y panel de administración seguro.`,
    badges: ['React', 'Supabase', 'PWA', 'Vercel'],
    technologies: [
      'React 19 (TypeScript)',
      'Vite & vite-plugin-pwa',
      'Zustand (Estado Global)',
      'Supabase (PostgreSQL + Auth)',
      '@dnd-kit (Drag & Drop)',
      'Recharts & lucide-react',
      'Vercel (Deploy)'
    ],
    videoId: '',
    repoUrl: 'https://gestor-de-tareas-3uce.vercel.app/',
    isPWA: true,
    gallery: [
      '/assets/images/Gestor de tareas/pc/1.webp',
      '/assets/images/Gestor de tareas/pc/2.webp',
      '/assets/images/Gestor de tareas/pc/3.webp',
      '/assets/images/Gestor de tareas/pc/4.webp',
      '/assets/images/Gestor de tareas/pc/5.webp',
      '/assets/images/Gestor de tareas/pc/6.webp',
      '/assets/images/Gestor de tareas/pc/7.webp',
      '/assets/images/Gestor de tareas/pc/8.webp',
      '/assets/images/Gestor de tareas/pc/9.webp',
      '/assets/images/Gestor de tareas/pc/10.webp',
      '/assets/images/Gestor de tareas/pc/11.webp',
      '/assets/images/Gestor de tareas/pc/12.webp',
      '/assets/images/Gestor de tareas/pc/13.webp',
      '/assets/images/Gestor de tareas/pc/14.webp',
      '/assets/images/Gestor de tareas/pc/15.webp',
      '/assets/images/Gestor de tareas/pc/16.webp',
      '/assets/images/Gestor de tareas/pc/17.webp',
      '/assets/images/Gestor de tareas/pc/18.webp',
      '/assets/images/Gestor de tareas/Movile/m1.webp',
      '/assets/images/Gestor de tareas/Movile/m2.webp',
      '/assets/images/Gestor de tareas/Movile/m3.webp',
      '/assets/images/Gestor de tareas/Movile/m4.webp',
      '/assets/images/Gestor de tareas/Movile/m5.webp',
      '/assets/images/Gestor de tareas/Movile/m6.webp',
      '/assets/images/Gestor de tareas/Movile/m7.webp',
      '/assets/images/Gestor de tareas/Movile/m8.webp',
      '/assets/images/Gestor de tareas/Movile/m9.webp',
      '/assets/images/Gestor de tareas/Movile/m10.webp',
      '/assets/images/Gestor de tareas/Movile/m11.webp',
      '/assets/images/Gestor de tareas/Movile/m12.webp',
      '/assets/images/Gestor de tareas/Movile/m13.webp',
      '/assets/images/Gestor de tareas/Movile/m14.webp',
      '/assets/images/Gestor de tareas/Movile/m15.webp',
      '/assets/images/Gestor de tareas/Movile/m16.webp',
      '/assets/images/Gestor de tareas/Movile/m17.webp',
      '/assets/images/Gestor de tareas/Movile/m18.webp',
      '/assets/images/Gestor de tareas/Movile/m19.webp',
      '/assets/images/Gestor de tareas/Movile/m20.webp',
      '/assets/images/Gestor de tareas/Movile/m21.webp',
      '/assets/images/Gestor de tareas/Movile/m22.webp',
      '/assets/images/Gestor de tareas/Movile/m23.webp',
      '/assets/images/Gestor de tareas/Movile/m24.webp'
    ],
    desktopGallery: [
      '/assets/images/Gestor de tareas/pc/8.webp',
      '/assets/images/Gestor de tareas/pc/2.webp',
      '/assets/images/Gestor de tareas/pc/6.webp',
      '/assets/images/Gestor de tareas/pc/14.webp',
      '/assets/images/Gestor de tareas/pc/3.webp',
      '/assets/images/Gestor de tareas/pc/12.webp',
      '/assets/images/Gestor de tareas/pc/10.webp',
      '/assets/images/Gestor de tareas/pc/1.webp',
      '/assets/images/Gestor de tareas/pc/15.webp',
      '/assets/images/Gestor de tareas/pc/17.webp',
      '/assets/images/Gestor de tareas/pc/9.webp',
      '/assets/images/Gestor de tareas/pc/5.webp',
      '/assets/images/Gestor de tareas/pc/11.webp',
      '/assets/images/Gestor de tareas/pc/18.webp',
      '/assets/images/Gestor de tareas/pc/16.webp',
      '/assets/images/Gestor de tareas/pc/4.webp',
      '/assets/images/Gestor de tareas/pc/13.webp',
      '/assets/images/Gestor de tareas/pc/7.webp'
    ],
    mobileGallery: [
      '/assets/images/Gestor de tareas/Movile/m23.webp',
      '/assets/images/Gestor de tareas/Movile/m9.webp',
      '/assets/images/Gestor de tareas/Movile/m20.webp',
      '/assets/images/Gestor de tareas/Movile/m17.webp',
      '/assets/images/Gestor de tareas/Movile/m6.webp',
      '/assets/images/Gestor de tareas/Movile/m26.webp',
      '/assets/images/Gestor de tareas/Movile/m4.webp',
      '/assets/images/Gestor de tareas/Movile/m3.webp',
      '/assets/images/Gestor de tareas/Movile/m21.webp',
      '/assets/images/Gestor de tareas/Movile/m11.webp',
      '/assets/images/Gestor de tareas/Movile/m8.webp',
      '/assets/images/Gestor de tareas/Movile/m19.webp',
      '/assets/images/Gestor de tareas/Movile/m12.webp',
      '/assets/images/Gestor de tareas/Movile/m10.webp',
      '/assets/images/Gestor de tareas/Movile/m5.webp',
      '/assets/images/Gestor de tareas/Movile/m15.webp',
      '/assets/images/Gestor de tareas/Movile/m25.webp',
      '/assets/images/Gestor de tareas/Movile/m7.webp',
      '/assets/images/Gestor de tareas/Movile/m1.webp',
      '/assets/images/Gestor de tareas/Movile/m14.webp',
      '/assets/images/Gestor de tareas/Movile/m16.webp',
      '/assets/images/Gestor de tareas/Movile/m24.webp',
      '/assets/images/Gestor de tareas/Movile/m2.webp',
      '/assets/images/Gestor de tareas/Movile/m18.webp',
      '/assets/images/Gestor de tareas/Movile/m13.webp',
      '/assets/images/Gestor de tareas/Movile/m22.webp'
    ]
  },
  {
    id: 'internet-banking',
    title: 'Internet Banking',
    image: '/assets/images/Internet Banking/portada.webp',
    shortDescription:
      'Aplicación web de Internet Banking con roles de administrador y cliente, que permite gestionar usuarios, realizar pagos, transferencias y avances de efectivo con seguridad y control total.',
    fullDescription: `Sistema bancario robusto desarrollado con ASP.NET Core MVC bajo una Arquitectura Onion para garantizar escalabilidad y mantenibilidad.

El sistema gestiona de forma segura dos roles principales: Administrador (gestión de usuarios y métricas) y Cliente (panel financiero completo).

Puntos Fuertes y Seguridad:
- Seguridad: Implementación de ASP.NET Identity para autenticación y autorización robusta. Las contraseñas y datos sensibles están encriptados siguiendo estándares de la industria.
- Funcionalidad: Pagos, transferencias y avances de efectivo con lógica de negocio compleja validada en el backend.
- UX/UI: Interfaz responsiva y amigable construida con Bootstrap, facilitando la navegación en cualquier dispositivo.

Este proyecto demuestra mi capacidad para manejar datos sensibles y construir aplicaciones críticas donde la seguridad es la prioridad.`,
    badges: ['C#', 'Bootstrap', 'HTML'],
    technologies: [
      'ASP.NET Core',
      'Identity (Seguridad)',
      'SQL Server',
      'Entity Framework',
      'Bootstrap',
    ],
    videoId: '_ELNRanI3vg',
    repoUrl: '#',
  },
  {
    id: 'net-series',
    title: 'Net Series +',
    image: '/assets/images/ITLA TV/portada.webp',
    shortDescription:
      'Plataforma de streaming con catálogo de series, filtros inteligentes, reproductor integrado y gestión de contenido.',
    fullDescription: `Plataforma de Streaming desarrollada con ASP.NET Core MVC, implementando una Arquitectura Limpia (Clean Architecture) para desacoplar reglas de negocio, acceso a datos e interfaz de usuario.

Características Técnicas:
- Patrón Repository: Abstracción de la capa de datos para facilitar pruebas unitarias y mantenimiento.
- ViewModels: Validación estricta de datos en la capa de presentación.
- Entity Framework Core: Gestión eficiente de la base de datos con enfoque Code First.

El proyecto permite la gestión completa de contenido multimedia (CRUD), filtros dinámicos y reproducción integrada, demostrando el dominio de patrones de diseño empresariales.`,
    badges: ['C#', 'HTML', 'SQL', 'ASP.NET Core'],
    technologies: [
      'ASP.NET Core MVC',
      'Clean Architecture',
      'Repository Pattern',
      'SQL Server',
      'Bootstrap',
    ],
    videoId: 'hg5kiG2qwww',
    repoUrl: '#',
  },
  {
    id: 'mercado-api',
    title: 'Mercado API',
    image: '/assets/images/Mercado API/portada.webp',
    shortDescription:
      'API RESTful que permite gestionar productos y categorías con operaciones CRUD, documentación interactiva en Swagger y persistencia en SQL Server.',
    fullDescription: `API RESTful diseñada para servir como backend de sistemas de comercio electrónico escalables. Construida sobre .NET 8, implementa una Arquitectura Onion para garantizar la independencia de frameworks y bases de datos.

Highlights:
- Documentación Profesional: Integración completa con Swagger UI para facilitar el consumo de la API por equipos frontend.
- Principios SOLID: Código modular y fácilmente extensible.
- Operaciones Optimizadas: Endpoints CRUD eficientes con manejo adecuado de códigos de estado HTTP y DTOs.

Este proyecto es la base ideal para cualquier aplicación cliente (React, Angular, Mobile) que requiera una gestión de inventario robusta.`,
    badges: ['ASP.NET Core', 'EF Core', 'SQL'],
    technologies: [
      '.NET 8 Web API',
      'Swagger/OpenAPI',
      'SQL Server',
      'Architecture Onion',
      'DTOs',
    ],
    videoId: 'tX7x0HMT11A',
    repoUrl: '#',
  },
  {
    id: 'cine-match',
    title: 'CineMatch',
    image: '/assets/images/CineMatch/1.webp',
    shortDescription:
      'App móvil de catálogo y recomendación de películas con favoritos offline, tráileres integrados y búsqueda avanzada.',
    fullDescription: `Aplicación móvil desarrollada en Flutter que funciona como un completo catálogo y recomendador de películas. Utiliza la API de TMDB para ofrecer información detallada sobre películas populares, tendencias, nuevos lanzamientos y sugerencias personalizadas.

Características Principales:
- Tendencias y Populares: Películas más populares del momento y tendencias diarias.
- Búsqueda Avanzada: Encuentra cualquier película rápidamente.
- Detalles Completos: Sinopsis, valoración, fecha de lanzamiento, géneros y reparto.
- Tráileres Integrados: Reproducción de tráileres oficiales de YouTube dentro de la app.
- Favoritos Offline: Persistencia local con SQLite para acceder sin conexión.
- Recomendaciones Personalizadas: Sugerencias basadas en las interacciones del usuario.
- Interfaz Moderna: Dark Theme, animaciones skeleton (shimmer) y navegación intuitiva.

Desarrollado con la colaboración estratégica de herramientas de Inteligencia Artificial para optimización de código y arquitectura.`,
    badges: ['Flutter', 'Dart', 'SQLite', 'TMDB API'],
    technologies: [
      'Flutter',
      'Dart',
      'Provider',
      'SQFlite',
      'TMDB REST API',
      'Cached Network Image',
      'WebView Flutter',
    ],
    videoId: '',
    repoUrl: '#',
    gallery: [
      '/assets/images/CineMatch/1.webp',
      '/assets/images/CineMatch/2.webp',
      '/assets/images/CineMatch/3.webp',
      '/assets/images/CineMatch/4.webp',
      '/assets/images/CineMatch/5.webp',
      '/assets/images/CineMatch/6.webp',
      '/assets/images/CineMatch/7.webp',
      '/assets/images/CineMatch/8.webp',
      '/assets/images/CineMatch/9.webp',
      '/assets/images/CineMatch/10.webp',
      '/assets/images/CineMatch/11.webp',
    ],
  },
  {
    id: 'jovenes-involucrados-2026',
    title: 'Jóvenes involucrados 2026',
    image: '/assets/images/Jovenes Involucrados 2026/mobile/13.jpeg',
    shortDescription:
      'Progressive Web App de preguntas y respuestas bíblicas con 152 preguntas, modo offline, autoevaluación, algoritmo de repaso inteligente y diseño glassmorphism premium.',
    fullDescription: `Aplicación tipo flashcards diseñada para el estudio de doctrina bíblica del retiro "Jóvenes Involucrados 2026" de la Iglesia Bautista Cristo Jesús (IBCJ). 100% offline y sin frameworks.

El proyecto consta de 152 preguntas distribuidas en 4 categorías: Hora Silenciosa, Discipulado, Memorización (versículos) y Lecciones.

Características Principales:
- PWA Offline-First: Instalable en cualquier dispositivo, funciona sin internet.
- Autoevaluación: Responde, revela la respuesta y autoevalúa tu conocimiento.
- Algoritmo de Repaso Inteligente: Las preguntas falladas se agregan automáticamente a una lista de repaso.
- Rachas (Streaks): Registro de días consecutivos de estudio para mantener motivación.
- Progreso Persistente: Guardado automático en localStorage, retoma donde lo dejaste.
- Búsqueda en Tiempo Real: Explora las 152 preguntas con filtros por categoría.
- Score y Confetti: Anillo de puntaje animado y partículas al completar una categoría.
- Atajos de Teclado y Swipe: Navegación rápida con teclado o gestos táctiles.
- Diseño Premium: Glassmorphism, modo oscuro, animaciones fluidas y sonidos envolventes.

Construida 100% con tecnologías web estándar vanilla, sin frameworks pesados ni dependencias externas.`,
    badges: ['PWA', 'Vanilla JS', 'Offline First', 'HTML/CSS/JS'],
    technologies: [
      'HTML5',
      'CSS3',
      'JavaScript ES6+',
      'Service Workers',
      'Web App Manifest',
      'Web Audio API',
      'Canvas API',
      'localStorage',
      'Vercel',
    ],
    videoId: '',
    repoUrl: 'https://jovenes-involucrados-2025.vercel.app/',
    isPWA: true,
    desktopGallery: [
      '/assets/images/Jovenes Involucrados 2026/pc/1.png',
      '/assets/images/Jovenes Involucrados 2026/pc/2.png',
      '/assets/images/Jovenes Involucrados 2026/pc/3.png',
      '/assets/images/Jovenes Involucrados 2026/pc/4.png',
      '/assets/images/Jovenes Involucrados 2026/pc/5.png',
      '/assets/images/Jovenes Involucrados 2026/pc/6.png',
      '/assets/images/Jovenes Involucrados 2026/pc/7.png',
      '/assets/images/Jovenes Involucrados 2026/pc/8.png',
    ],
    mobileGallery: [
      '/assets/images/Jovenes Involucrados 2026/mobile/1.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/2.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/3.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/4.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/5.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/6.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/7.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/8.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/9.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/10.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/11.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/12.jpeg',
      '/assets/images/Jovenes Involucrados 2026/mobile/13.jpeg',
    ],
  },
]
