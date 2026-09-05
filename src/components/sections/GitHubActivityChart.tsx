import React, { useState, useMemo, useRef } from 'react'

interface ContributionDay {
  date: string
  contributionCount: number
}

interface GitHubActivityChartProps {
  calendar?: ContributionDay[]
}

export function GitHubActivityChart({ calendar = [] }: GitHubActivityChartProps) {
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Tomamos los últimos 30 días con datos
  const monthData = useMemo(() => {
    if (!calendar || calendar.length === 0) return []
    return calendar.slice(-30)
  }, [calendar])

  const totalMonthContributions = useMemo(() => {
    return monthData.reduce((acc, curr) => acc + curr.contributionCount, 0)
  }, [monthData])

  const maxContributions = useMemo(() => {
    if (monthData.length === 0) return 1
    return Math.max(...monthData.map(d => d.contributionCount), 1)
  }, [monthData])

  // Dimensiones del SVG
  const width = 560
  const height = 180
  const paddingLeft = 32
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom
  const maxScale = Math.max(maxContributions + 1, 4)

  // Coordenadas calculadas
  const points = useMemo(() => {
    if (monthData.length === 0) return []
    return monthData.map((d, index) => {
      const x = paddingLeft + (index / (monthData.length - 1 || 1)) * chartWidth
      const y = paddingTop + chartHeight - (d.contributionCount / maxScale) * chartHeight
      return { x, y, day: d }
    })
  }, [monthData, chartWidth, chartHeight, maxScale, paddingLeft, paddingTop])

  // Generador de curva Bézier suave
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' }
    if (points.length === 1) {
      const p = points[0]
      return {
        linePath: `M ${p.x} ${p.y}`,
        areaPath: `M ${p.x} ${height - paddingBottom} L ${p.x} ${p.y} L ${p.x} ${height - paddingBottom} Z`,
      }
    }

    let d = `M ${points[0].x},${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]
      const mx = (current.x + next.x) / 2
      d += ` C ${mx},${current.y} ${mx},${next.y} ${next.x},${next.y}`
    }

    const baselineY = height - paddingBottom
    const area = `${d} L ${points[points.length - 1].x},${baselineY} L ${points[0].x},${baselineY} Z`

    return { linePath: d, areaPath: area }
  }, [points, height, paddingBottom])

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    } catch {
      return dateStr
    }
  }

  const formatFullDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (points.length === 0 || !containerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * width

    let closest = points[0]
    let minDiff = Math.abs(closest.x - svgX)
    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(points[i].x - svgX)
      if (diff < minDiff) {
        minDiff = diff
        closest = points[i]
      }
    }
    setHoveredDay(closest)
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  return (
    <div className="gh-activity-chart-wrapper" ref={containerRef}>
      <div className="gh-activity-chart-header">
        <div className="gh-card-title" style={{ margin: 0 }}>Contribuciones en el último mes</div>
        <div className="gh-activity-chart-badge">
          <span className="gh-badge-glow"></span>
          <span className="gh-badge-val">+{totalMonthContributions}</span>
          <span className="gh-badge-label">este mes</span>
        </div>
      </div>

      <div className="gh-activity-svg-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="gh-activity-svg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label="Gráfico de actividad de contribuciones de los últimos 30 días"
        >
          <defs>
            <linearGradient id="ghAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="ghLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>

            <filter id="ghGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Líneas guía horizontales */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = paddingTop + chartHeight * (1 - ratio)
            const val = Math.round(maxScale * ratio)
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--text-tertiary, #64748b)"
                  fontFamily="inherit"
                >
                  {val}
                </text>
              </g>
            )
          })}

          {/* Área sombreada con degradado */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#ghAreaGrad)"
              style={{ transition: 'all 0.3s ease' }}
            />
          )}

          {/* Línea de tendencia neón */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#ghLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ghGlow)"
            />
          )}

          {/* Etiquetas del eje X (fechas clave) */}
          {points.length > 0 &&
            [0, Math.floor(points.length * 0.33), Math.floor(points.length * 0.66), points.length - 1].map((idx, i) => {
              const p = points[idx]
              if (!p) return null
              return (
                <text
                  key={i}
                  x={p.x}
                  y={height - 10}
                  textAnchor={i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}
                  fontSize="10"
                  fill="var(--text-tertiary, #64748b)"
                  fontFamily="inherit"
                >
                  {formatDate(p.day.date)}
                </text>
              )
            })}

          {/* Efectos al pasar el cursor */}
          {hoveredDay && (
            <g className="gh-hover-group">
              <line
                x1={hoveredDay.x}
                y1={paddingTop}
                x2={hoveredDay.x}
                y2={height - paddingBottom}
                stroke="rgba(168, 85, 247, 0.45)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              <circle
                cx={hoveredDay.x}
                cy={hoveredDay.y}
                r="7"
                fill="rgba(0, 242, 254, 0.25)"
              />
              <circle
                cx={hoveredDay.x}
                cy={hoveredDay.y}
                r="4"
                fill="#00f2fe"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Tooltip flotante estilizado */}
        {hoveredDay && (
          <div
            className="gh-chart-tooltip"
            style={{
              left: `${(hoveredDay.x / width) * 100}%`,
              top: `${(hoveredDay.y / height) * 100}%`,
            }}
          >
            <div className="gh-tooltip-date">{formatFullDate(hoveredDay.day.date)}</div>
            <div className="gh-tooltip-count">
              <span className="gh-tooltip-dot" />
              <strong>{hoveredDay.day.contributionCount}</strong> {hoveredDay.day.contributionCount === 1 ? 'contribución' : 'contribuciones'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
