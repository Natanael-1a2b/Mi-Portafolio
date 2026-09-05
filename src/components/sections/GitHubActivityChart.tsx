import React, { useState, useMemo, useRef } from 'react'

interface ContributionDay {
  date: string
  contributionCount: number
}

interface GitHubActivityChartProps {
  calendar?: ContributionDay[]
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export function GitHubActivityChart({ calendar = [] }: GitHubActivityChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ day: ContributionDay; barX: number; barY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Obtener el mes calendario más reciente completo
  const { monthData, monthLabel } = useMemo(() => {
    if (!calendar || calendar.length === 0) return { monthData: [], monthLabel: '' }

    const lastDate = calendar[calendar.length - 1].date
    const [year, month] = lastDate.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()

    const days: ContributionDay[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const found = calendar.find(c => c.date === dateStr)
      days.push(found ?? { date: dateStr, contributionCount: 0 })
    }

    return {
      monthData: days,
      monthLabel: `${MONTH_NAMES[month - 1]} ${year}`,
    }
  }, [calendar])

  const totalMonthContributions = useMemo(
    () => monthData.reduce((acc, d) => acc + d.contributionCount, 0),
    [monthData]
  )

  const maxContributions = useMemo(
    () => Math.max(...monthData.map(d => d.contributionCount), 1),
    [monthData]
  )

  // Dimensiones SVG
  const width = 560
  const height = 170
  const pLeft = 32
  const pRight = 12
  const pTop = 18
  const pBottom = 34

  const chartW = width - pLeft - pRight
  const chartH = height - pTop - pBottom
  const n = monthData.length || 1
  const groupW = chartW / n
  const barW = Math.max(groupW * 0.6, 4)

  const bars = useMemo(() => {
    return monthData.map((d, i) => {
      const barH = (d.contributionCount / maxContributions) * chartH
      const x = pLeft + i * groupW + (groupW - barW) / 2
      const y = pTop + chartH - barH
      return { x, y, barH, barW, day: d, index: i }
    })
  }, [monthData, maxContributions, chartH, groupW, barW])

  // Etiquetas del eje X: todos los días del mes
  const xLabels = bars

  // Líneas guía del eje Y
  const yGuides = useMemo(() => {
    const step = Math.ceil(maxContributions / 3)
    return [step, step * 2, step * 3].filter(v => v <= maxContributions + 1)
  }, [maxContributions])

  const getBarFill = (count: number) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.06)'
    if (count <= 2) return 'url(#barGradLow)'
    if (count <= 5) return 'url(#barGradMid)'
    if (count <= 9) return 'url(#barGradHigh)'
    return 'url(#barGradMax)'
  }

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (bars.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * width
    const closest = bars.reduce((prev, curr) =>
      Math.abs(curr.x + barW / 2 - svgX) < Math.abs(prev.x + barW / 2 - svgX) ? curr : prev
    )
    setHoveredBar({ day: closest.day, barX: closest.x + barW / 2, barY: closest.y })
  }

  return (
    <div className="gh-activity-chart-wrapper" ref={containerRef}>
      <div className="gh-activity-chart-header">
        <div className="gh-card-title" style={{ margin: 0 }}>
          Contribuciones —{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{monthLabel}</span>
        </div>
        <div className="gh-activity-chart-badge">
          <span className="gh-badge-glow" />
          <span className="gh-badge-val">+{totalMonthContributions}</span>
          <span className="gh-badge-label">este mes</span>
        </div>
      </div>

      <div className="gh-activity-svg-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="gh-activity-svg"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredBar(null)}
          role="img"
          aria-label={`Gráfico de contribuciones de ${monthLabel}`}
        >
          <defs>
            <linearGradient id="barGradLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3730a3" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="barGradMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="barGradHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="barGradMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
            <filter id="barGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Línea base */}
          <line
            x1={pLeft} y1={pTop + chartH}
            x2={width - pRight} y2={pTop + chartH}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          />

          {/* Líneas guía horizontales */}
          {yGuides.map((val) => {
            const y = pTop + chartH - (val / maxContributions) * chartH
            return (
              <g key={val}>
                <line
                  x1={pLeft} y1={y} x2={width - pRight} y2={y}
                  stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1"
                />
                <text x={pLeft - 6} y={y + 3} textAnchor="end"
                  fontSize="9" fill="var(--text-tertiary, #64748b)" fontFamily="inherit">
                  {val}
                </text>
              </g>
            )
          })}

          {/* Barras */}
          {bars.map((bar) => {
            const isHovered = hoveredBar?.day.date === bar.day.date
            return (
              <g key={bar.day.date}>
                {bar.day.contributionCount > 0 ? (
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width={barW}
                    height={bar.barH}
                    rx={2}
                    fill={getBarFill(bar.day.contributionCount)}
                    filter={isHovered ? 'url(#barGlow)' : undefined}
                    style={{ transition: 'filter 0.15s ease, opacity 0.15s ease' }}
                    opacity={hoveredBar && !isHovered ? 0.45 : 1}
                  />
                ) : (
                  <rect
                    x={bar.x}
                    y={pTop + chartH - 2}
                    width={barW}
                    height={2}
                    rx={1}
                    fill="rgba(255,255,255,0.06)"
                  />
                )}
              </g>
            )
          })}

          {/* Línea vertical hover */}
          {hoveredBar && (
            <line
              x1={hoveredBar.barX} y1={pTop}
              x2={hoveredBar.barX} y2={pTop + chartH}
              stroke="rgba(168,85,247,0.4)" strokeDasharray="3 3" strokeWidth="1.5"
            />
          )}

          {/* Eje X — todos los días del mes */}
          {xLabels.map((bar) => (
            <text
              key={`lbl-${bar.day.date}`}
              x={bar.x + barW / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--text-tertiary, #64748b)"
              fontFamily="inherit"
            >
              {parseInt(bar.day.date.split('-')[2], 10)}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredBar && (
          <div
            className="gh-chart-tooltip"
            style={{
              left: `${(hoveredBar.barX / width) * 100}%`,
              top: `${(hoveredBar.barY / height) * 100}%`,
            }}
          >
            <div className="gh-tooltip-date">{formatDate(hoveredBar.day.date)}</div>
            <div className="gh-tooltip-count">
              <span className="gh-tooltip-dot" />
              <strong>{hoveredBar.day.contributionCount}</strong>{' '}
              {hoveredBar.day.contributionCount === 1 ? 'contribución' : 'contribuciones'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
