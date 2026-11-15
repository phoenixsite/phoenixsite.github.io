// Datos del sitio en un solo sitio: cambiar el nombre o el dominio aquí
// se refleja en todas las páginas, el RSS y el sitemap.
export const siteConfig = {
  url: 'https://phoenixsite.dev',
  name: {
    es: 'Carlos Romero Cruz',
    en: "Carlos Romero Cruz"
  },
  description: {
    es: 'Ingeniero informático y matemático, apasionado de la seguridad en la información y en el aprendizaje automático.',
    en: 'Computer Engineer and Mathematician, passionate about Information and Machine Learning Security.'
  },
  author: 'Carlos Romero Cruz',
  email: 'phoenixsitegit@outlook.com',
  githubUrl: 'https://github.com/phoenixsite/'
} as const;

export type Lang = 'es' | 'en';
