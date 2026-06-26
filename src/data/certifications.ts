export interface Certification {
  id: string
  title: string
  issuer: string
  image: string
}

export const certifications: Certification[] = [
  {
    id: 'it-essentials',
    title: 'IT Essentials',
    issuer: 'Cisco Networking Academy',
    image: '/assets/images/certificaciones/it-essentials.webp',
  },
  {
    id: 'fullstack-spring',
    title: 'Full Stack With Spring Boot 4 and Angular 21',
    issuer: 'DevSenior Academy',
    image: '/assets/images/certificaciones/fullstack-spring.webp',
  },
  {
    id: 'cpp-essentials',
    title: 'Programming Essentials in C++',
    issuer: 'Cisco Networking Academy',
    image: '/assets/images/certificaciones/cpp-essentials.webp',
  },
  {
    id: 'python-cert',
    title: 'Certificado en Python Principiante',
    issuer: 'UDEMY',
    image: '/assets/images/certificaciones/python-cert.webp',
  },
  {
    id: 'ia-dev',
    title: 'Iniciación al Desarrollo con IA',
    issuer: 'BIG school',
    image: '/assets/images/certificaciones/ia-dev.webp',
  },
  {
    id: 'propuesta-valor',
    title: 'Propuesta de Valor',
    issuer: 'BITCompany',
    image: '/assets/images/certificaciones/propuesta-valor.webp',
  },
  {
    id: 'ia-3era-edicion',
    title: 'Desarrollo con IA 3era Edicion',
    issuer: 'BIG school',
    image: '/assets/images/certificaciones/IA-3era-edicion.png',
  },
]
