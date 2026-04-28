import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = '', glow = false }: Props) {
  return (
    <div className={`glass-card ${glow ? 'glow' : ''} ${className}`}>
      {children}
    </div>
  )
}
