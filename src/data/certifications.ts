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
    image:
      '/assets/images/IT_Essentials_certificate_20230227-itla-edu-do_9e9a64ba-23b6-46da-b24d-872f6710c626_page-0001.jpg',
  },
  {
    id: 'fullstack-spring',
    title: 'Full Stack With Spring Boot 4 and Angular 21',
    issuer: 'DevSenior Academy',
    image: '/assets/images/Full Stack With Spring Boot 4 and Angular 21.jpg',
  },
  {
    id: 'cpp-essentials',
    title: 'Programming Essentials in C++',
    issuer: 'Cisco Networking Academy',
    image:
      '/assets/images/Partner-_CPA_-_Programming_Essentials_in_C - _certificate_20230227-itla-edu-do_4f98121e-9eee-4b1e-b883-c4bf3bdc530a_page-0001.jpg',
  },
  {
    id: 'python-cert',
    title: 'Certificado en Python Principiante',
    issuer: 'UDEMY',
    image: '/assets/images/Certificado  Python.jpg',
  },
  {
    id: 'ia-dev',
    title: 'Iniciación al Desarrollo con IA',
    issuer: 'BIG school',
    image:
      '/assets/images/Certificado-Claudio-Natanael-Beltre-Rosario-dnvgv0bd.jpg',
  },
]
