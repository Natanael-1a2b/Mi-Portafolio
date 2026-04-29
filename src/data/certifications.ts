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
    image: '/assets/images/certificaciones/it-essentials.jpg',
  },
  {
    id: 'fullstack-spring',
    title: 'Full Stack With Spring Boot 4 and Angular 21',
    issuer: 'DevSenior Academy',
    image: '/assets/images/certificaciones/fullstack-spring.jpg',
  },
  {
    id: 'cpp-essentials',
    title: 'Programming Essentials in C++',
    issuer: 'Cisco Networking Academy',
    image: '/assets/images/certificaciones/cpp-essentials.jpg',
  },
  {
    id: 'python-cert',
    title: 'Certificado en Python Principiante',
    issuer: 'UDEMY',
    image: '/assets/images/certificaciones/python-cert.jpg',
  },
  {
    id: 'ia-dev',
    title: 'Iniciación al Desarrollo con IA',
    issuer: 'BIG school',
    image: '/assets/images/certificaciones/ia-dev.jpg',
  },
  {
    id: 'propuesta-valor',
    title: 'Propuesta de Valor',
    issuer: 'BITCompany',
    image: '/assets/images/certificaciones/propuesta-valor.jpg',
  },
]
