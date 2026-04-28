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
}

export const projects: Project[] = [
  {
    id: 'net-series',
    title: 'Net Series +',
    image: '/assets/images/ITLA TV/portada.png',
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
    id: 'internet-banking',
    title: 'Internet Banking',
    image: '/assets/images/Internet Banking/portada.png',
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
    id: 'mercado-api',
    title: 'Mercado API',
    image: '/assets/images/Mercado API/portada.png',
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
    repoUrl: 'https://github.com/Natanael-1a2b/tienda-online',
  },
]
