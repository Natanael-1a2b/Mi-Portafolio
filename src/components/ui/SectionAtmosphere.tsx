import { memo } from 'react'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'

export type AtmosphereVariant = 'hero' | 'about' | 'projects' | 'minimal' | 'contact' | 'dark'

export interface SectionAtmosphereProps {
  variant?: AtmosphereVariant
  particles?: number // 0 to 10
  withDots?: boolean
  withScanLines?: boolean
  glowPosition?: 'top-left' | 'center' | 'bottom-right' | 'split' | 'none'
  className?: string
}

export const SectionAtmosphere = memo(function SectionAtmosphere({
  variant = 'dark',
  particles,
  withDots,
  withScanLines,
  glowPosition = 'none',
  className = ''
}: SectionAtmosphereProps) {
  const prefersReduced = usePreferredMotion()

  // Apply default props based on variant if not explicitly provided
  let effectiveParticles: number = particles ?? 0
  let effectiveDots: boolean = withDots ?? false
  let effectiveScanLines: boolean = withScanLines ?? false
  let effectiveGlow: string = glowPosition

  if (variant === 'hero') {
    effectiveParticles = particles ?? 10
    effectiveDots = withDots ?? true
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'split'
  } else if (variant === 'about') {
    effectiveParticles = particles ?? 6
    effectiveDots = withDots ?? true
    effectiveScanLines = withScanLines ?? true
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'split' // rings will also be shown
  } else if (variant === 'projects') {
    effectiveParticles = particles ?? 4
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'center'
  } else if (variant === 'minimal') {
    effectiveParticles = particles ?? 0
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'center'
  } else if (variant === 'contact') {
    effectiveParticles = particles ?? 5
    effectiveDots = withDots ?? true
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'bottom-right'
  }

  // Optimize performance: don't render particles if reduced motion is preferred
  const shouldRenderParticles = !prefersReduced && effectiveParticles > 0
  const particlesArray = shouldRenderParticles ? Array.from({ length: Math.min(effectiveParticles, 10) }) : []

  return (
    <div className={`section-atmosphere ${className}`} aria-hidden="true">
      {effectiveDots && <div className="bg-pattern-dots"></div>}
      {effectiveScanLines && <div className="scan-lines"></div>}

      {/* Rings (specific to 'about' variant for now) */}
      {variant === 'about' && (
        <>
          <div className="decorative-ring ring-1"></div>
          <div className="decorative-ring ring-2"></div>
          <div className="decorative-ring ring-3"></div>
        </>
      )}

      {/* Glows */}
      {!prefersReduced && (
        <>
          {effectiveGlow === 'split' && (
            <>
              {variant === 'hero' ? (
                <>
                  <div className="glow-1"></div>
                  <div className="glow-2"></div>
                </>
              ) : (
                <>
                  <div className="ambient-orb orb-blue"></div>
                  <div className="ambient-orb orb-blue" style={{ opacity: 0.6, transform: "scale(1.2) translate(10%, -20%)" }}></div>
                </>
              )}
            </>
          )}
          {effectiveGlow === 'center' && (
            <div className="ambient-orb orb-purple" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }}></div>
          )}
          {effectiveGlow === 'bottom-right' && (
            <div className="glow-2" style={{ bottom: '-10%', right: '-10%', opacity: 0.5 }}></div>
          )}
          {effectiveGlow === 'top-left' && (
            <div className="glow-1" style={{ top: '-10%', left: '-10%', opacity: 0.5 }}></div>
          )}
        </>
      )}

      {/* Particles */}
      {shouldRenderParticles && (
        <div className="floating-particles">
          {particlesArray.map((_, i) => (
            <div key={i} className={`particle p${i + 1}`}></div>
          ))}
        </div>
      )}
    </div>
  )
})

