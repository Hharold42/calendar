import { lazy, Suspense } from 'react'
import type { IconId } from './manifest.ts'



export default function Icon({ id, size = 16, color = 'white' }: { id: IconId; size?: number; color?: string }) {
  const LazyIcon = lazy(async () => {
    const { manifest } = await import('./manifest.ts')
    const path = manifest[id]
    if (!path) throw new Error(`Icon not found: ${String(id)}`)
    const mod = (await import(/* @vite-ignore */ (path as string))) as { default: React.ComponentType<React.SVGProps<SVGSVGElement>> }
    return { default: mod.default }
  })

  return (
    <Suspense fallback={null}>
      <LazyIcon width={size} height={size} fill={color} />
    </Suspense>
  )
}


