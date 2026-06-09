interface Props {
  size?: 'sm' | 'md'
  pulse?: boolean
}

export function StatusDot({ size = 'sm', pulse = true }: Props) {
  const sizeClass = size === 'md' ? 'status-dot-md' : ''
  return (
    <span
      className={`status-dot ${sizeClass} ${pulse ? 'status-dot-pulse' : ''}`}
      aria-hidden="true"
    />
  )
}
