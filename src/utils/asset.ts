/**
 * Prepends the Vite base URL to asset paths.
 * In dev: base is '/Mi-Portafolio/'
 * Assets in public/ are served at base + path
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${cleanPath}`
}
