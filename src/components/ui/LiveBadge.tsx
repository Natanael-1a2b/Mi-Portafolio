import { StatusDot } from './StatusDot'

export function LiveBadge() {
  return (
    <span className="live-badge">
      <StatusDot />
      <span>Actual</span>
    </span>
  )
}
