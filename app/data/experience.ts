/**
 * Experiencia laboral. El cargo se traduce en i18n (experience.roles.<id>);
 * la empresa es un nombre propio y no se traduce.
 */
export interface WorkExperience {
  id: string
  company: string
  /** Mes de inicio, formato YYYY-MM */
  start: string
  /** Mes de finalización, formato YYYY-MM. null si es actual */
  end: string | null
} 

export const workExperiences: WorkExperience[] = [
  { id: 'promovalle', company: 'PromoValle S.A.S E.S.P', start: '2025-03', end: '2025-06' },
  { id: 'colombianTi', company: 'Colombian TI Software S.A.S', start: '2022-08', end: '2024-08' },
]
