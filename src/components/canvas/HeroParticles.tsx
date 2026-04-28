import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useIsMobile } from '../../hooks/useIsMobile'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import * as THREE from 'three'

export function HeroParticles() {
  const ref = useRef<THREE.Points>(null)
  const isMobile = useIsMobile()
  const prefersReduced = usePreferredMotion()
  const mouse = useRef({ x: 0, y: 0 })

  const count = isMobile ? 500 : 3000

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const primary = new THREE.Color('#6366f1')
    const accent = new THREE.Color('#06b6d4')

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20

      const mix = Math.random()
      const c = primary.clone().lerp(accent, mix)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count])

  // Track mouse for subtle rotation
  useMemo(() => {
    if (typeof window === 'undefined') return
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame((_, delta) => {
    if (!ref.current || prefersReduced) return
    ref.current.rotation.y += delta * 0.02
    ref.current.rotation.x += delta * 0.01

    // Subtle mouse influence
    if (!isMobile) {
      ref.current.rotation.y += (mouse.current.x * 0.1 - ref.current.rotation.y) * 0.01
      ref.current.rotation.x += (mouse.current.y * 0.1 - ref.current.rotation.x) * 0.01
    }
  })

  if (prefersReduced) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={col} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}
