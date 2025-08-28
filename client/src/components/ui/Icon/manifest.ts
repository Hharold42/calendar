// Auto-generated at build time using import.meta.glob
// Key: icon id (file name without extension), Value: module path with ?react

const modules = import.meta.glob('/src/assets/icons/*.svg', { eager: false }) as Record<string, () => Promise<unknown>>

// Normalize to id -> path?react (so SVGR returns component as default)
export const manifest = Object.fromEntries(
  Object.keys(modules).map((fullPath) => {
    const fileName = fullPath.split('/').pop() as string // e.g., plus.svg
    const id = fileName.replace(/\.svg$/i, '')
    // Vite supports query appending like '?react' with our svgr config (exportAsDefault)
    const pathWithQuery = `${fullPath}?react`
    return [id, pathWithQuery]
  }),
) as Record<string, string>

export type IconId = keyof typeof manifest


