import { createGitHubProjectSource } from '../project-source/github'
import type { ProjectSource } from '../project-source/project'

let source: ProjectSource | undefined

/**
 * Única instancia de la fuente de proyectos para las rutas del servidor.
 * El token vive en runtimeConfig privado: nunca llega al bundle del cliente.
 */
export function useProjectSource(): ProjectSource {
  if (!source) {
    const { githubOwner, githubToken } = useRuntimeConfig()
    source = createGitHubProjectSource({ owner: githubOwner, token: githubToken || undefined })
  }
  return source
}
