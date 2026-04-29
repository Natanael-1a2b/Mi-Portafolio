import React, { useRef, useCallback } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  children: React.ReactNode
  className?: string
  strength?: number
  as?: 'button' | 'a' | 'div'
  [key: string]: unknown
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  as: Tag = 'div',
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const isMobile = useIsMobile(992)

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      ref.current.style.transform = `translate(${x}px, ${y}px)`
    },
    [isMobile, strength],
  )

  const handleLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)'
      ref.current.style.transition = 'transform 0.4s ease'
    }
  }, [])

  const handleEnter = useCallback(() => {
    if (ref.current) {
      ref.current.style.transition = 'none'
    }
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      {...rest}
    >
      {children}
    </Tag>
  )
}
