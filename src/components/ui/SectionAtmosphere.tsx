import { memo } from 'react'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'

export type AtmosphereVariant = 'hero' | 'about' | 'projects' | 'minimal' | 'contact' | 'dark'

export interface SectionAtmosphereProps {
  variant?: AtmosphereVariant
  withDots?: boolean
  withScanLines?: boolean
  glowPosition?: 'top-left' | 'center' | 'bottom-right' | 'split' | 'none'
  className?: string
}

export const SectionAtmosphere = memo(function SectionAtmosphere({
  variant = 'dark',
  withDots,
  withScanLines,
  glowPosition = 'none',
  className = ''
}: SectionAtmosphereProps) {
  const prefersReduced = usePreferredMotion()

  let effectiveDots: boolean = withDots ?? false
  let effectiveScanLines: boolean = withScanLines ?? false
  let effectiveGlow: string = glowPosition

  if (variant === 'hero') {
    effectiveDots = withDots ?? true
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'split'
  } else if (variant === 'about') {
    effectiveDots = withDots ?? true
    effectiveScanLines = withScanLines ?? true
    effectiveGlow = 'none'
  } else if (variant === 'projects') {
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'center'
  } else if (variant === 'minimal') {
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'center'
  } else if (variant === 'contact') {
    effectiveDots = withDots ?? true
    effectiveGlow = glowPosition !== 'none' ? glowPosition : 'bottom-right'
  }

  return (
    <div className={`section-atmosphere ${className}`} aria-hidden="true">
      {effectiveDots && <div className="bg-pattern-dots"></div>}
      {effectiveScanLines && <div className="scan-lines"></div>}

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
    </div>
  )
})

