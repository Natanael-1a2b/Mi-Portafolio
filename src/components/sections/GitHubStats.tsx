import { useEffect, useRef, useState, useMemo } from 'react'
import { githubConfig, fetchGitHubData, GitHubStatsResult } from '../../data/github'
import { SectionTitle } from '../ui/SectionTitle'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MONTH_NAMES_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MONTH_NAMES_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
function formatFullDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d, 10)} ${MONTH_NAMES_SHORT[parseInt(m, 10) - 1]} ${y}`
}

const EMPTY_CALENDAR: { date: string; contributionCount: number }[] = []

// Fecha local en formato YYYY-MM-DD, igual que las fechas del calendario
function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const MONTH_CHART_W = 640
const MONTH_CHART_H = 190
const MONTH_CHART_PAD_LEFT = 26
const MONTH_CHART_PAD_RIGHT = 8
const MONTH_CHART_PAD_TOP = 18
const MONTH_CHART_PAD_BOTTOM = 30

export function GitHubStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()
  const [data, setData] = useState<GitHubStatsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [monthHoverIndex, setMonthHoverIndex] = useState<number | null>(null)
  const monthBarsRef = useRef<SVGGElement>(null)

  useEffect(() => {
    fetchGitHubData().then(result => {
      if (result) {
        setData(result)
      } else {
        setError(true)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (prefersReduced || !sectionRef.current || loading) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.gh-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.4, stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-dashboard', start: 'top 85%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced, loading])

  const calendarData = data?.calendar ?? EMPTY_CALENDAR;
  const calendarScrollRef = useRef<HTMLDivElement>(null);

  const paddedCalendar = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return [];
    const [year, month, day] = calendarData[0].date.split('-');
    const firstDate = new Date(Number(year), Number(month) - 1, Number(day));
    const paddingCount = firstDate.getDay();
    const padding = Array.from({ length: paddingCount }).map(() => ({
      date: 'padding',
      contributionCount: -1
    }));
    return [...padding, ...calendarData];
  }, [calendarData]);

  // Calcula las etiquetas de los meses para colocar arriba del calendario
  const monthLabels = useMemo(() => {
    if (paddedCalendar.length === 0) return [];
    const labels: { label: string; column: number }[] = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let currentMonth = -1;
    let colIndex = 0;
    for (let i = 0; i < paddedCalendar.length; i++) {
      if (i % 7 === 0 && i > 0) colIndex++;
      const d = paddedCalendar[i];
      if (d.date === 'padding' || d.contributionCount < 0) continue;
      const monthNum = parseInt(d.date.split('-')[1], 10) - 1;
      if (monthNum !== currentMonth) {
        currentMonth = monthNum;
        labels.push({ label: monthNames[monthNum], column: colIndex });
      }
    }
    return labels;
  }, [paddedCalendar]);

  // Auto-scroll del calendario hacia la derecha (fechas más recientes)
  useEffect(() => {
    if (calendarScrollRef.current) {
      calendarScrollRef.current.scrollLeft = calendarScrollRef.current.scrollWidth;
    }
  }, [paddedCalendar]);

  // Gráfico de contribuciones diarias del mes más reciente con datos, calculado localmente (sin depender de servicios externos).
  // Se usa el mes de la última fecha del calendario para no quedar vacío a inicio de mes, antes de que se actualice el JSON.
  const monthChart = useMemo(() => {
    if (calendarData.length === 0) return null;
    const [year, monthNum] = calendarData[calendarData.length - 1].date.split('-').map(Number);
    const month = monthNum - 1;
    const days = calendarData.filter(d => {
      const [y, m] = d.date.split('-').map(Number);
      return y === year && m - 1 === month;
    });
    if (days.length === 0) return null;

    const maxVal = Math.max(1, ...days.map(d => d.contributionCount));
    const innerW = MONTH_CHART_W - MONTH_CHART_PAD_LEFT - MONTH_CHART_PAD_RIGHT;
    const innerH = MONTH_CHART_H - MONTH_CHART_PAD_TOP - MONTH_CHART_PAD_BOTTOM;
    const slotW = innerW / days.length;
    const barWidth = Math.max(2, slotW * 0.55);
    const baseline = MONTH_CHART_PAD_TOP + innerH;

    const bars = days.map((d, i) => {
      const height = (d.contributionCount / maxVal) * innerH;
      const cx = MONTH_CHART_PAD_LEFT + slotW * i + slotW / 2;
      return {
        x: cx - barWidth / 2,
        cx,
        y: baseline - height,
        height,
        width: barWidth,
        date: d.date,
        day: parseInt(d.date.split('-')[2], 10),
        count: d.contributionCount,
      };
    });

    let peakIndex = 0;
    days.forEach((d, i) => { if (d.contributionCount > days[peakIndex].contributionCount) peakIndex = i; });

    const total = days.reduce((sum, d) => sum + d.contributionCount, 0);

    // Etiquetas numéricas del eje vertical, repartidas entre 0 y el máximo del mes
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
      value: Math.round(maxVal * f),
      y: baseline - innerH * f,
    }));

    const todayIndex = days.findIndex(d => d.date === todayKey());

    return { bars, baseline, total, peakIndex, todayIndex, yTicks, monthLabel: MONTH_NAMES_LONG[month] };
  }, [calendarData]);

  const handleMonthChartMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!monthChart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * MONTH_CHART_W;
    let nearest = 0;
    let minDist = Infinity;
    monthChart.bars.forEach((b, i) => {
      const dist = Math.abs(b.cx - relX);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    setMonthHoverIndex(nearest);
  };
  const handleMonthChartLeave = () => setMonthHoverIndex(null);

  // Animación de "crecimiento" de las barras al entrar en viewport
  useEffect(() => {
    if (!monthChart || !monthBarsRef.current) return;
    const bars = monthBarsRef.current.querySelectorAll('.gh-month-chart-bar');
    if (bars.length === 0) return;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(bars,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-month-chart', start: 'top 88%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [monthChart, prefersReduced]);

  if (loading) {
    return (
      <section id="github" ref={sectionRef} className="section-alt gh-section">
        <SectionAtmosphere />
        <div className="container">
          <SectionTitle
            badge="CÓDIGO ABIERTO"
            title="GitHub & "
            gradientTitle="Actividad"
            subtitle="Mi contribución y estadísticas en la comunidad."
          />
          <div className="gh-dashboard">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="gh-card gh-card-languages gh-card--skeleton">
                <div className="gh-stat-skeleton"><div className="gh-stat-skeleton-shimmer" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !data) {
    return (
      <section id="github" ref={sectionRef} className="section-alt gh-section">
        <SectionAtmosphere />
          <div className="container">
            <SectionTitle
              badge="CÓDIGO ABIERTO"
              title="GitHub & "
              gradientTitle="Actividad"
              subtitle="Mi contribución y estadísticas en la comunidad."
            />
            <div className="gh-stats-error-box glass-card">
            <p>No se pudieron cargar las estadísticas</p>
          </div>
        </div>
      </section>
    )
  }

  const { user, totalContributions, totalStars, totalCommits, totalPRs, totalIssues, languages, currentStreak = 0, longestStreak = 0, currentYearContributions = 0 } = data;

  const getCalendarColor = (count: number) => {
    if (count < 0) return 'transparent';
    if (count === 0) return 'rgba(255, 255, 255, 0.05)'; // Vacío
    if (count >= 1 && count <= 3) return '#0e4429'; // GitHub light green
    if (count >= 4 && count <= 6) return '#006d32'; // GitHub medium green
    if (count >= 7 && count <= 9) return '#26a641'; // GitHub dark green
    return '#39d353'; // GitHub brightest green (10+)
  };



  // Calculamos las métricas extra en lugar de la fecha de unión

  // Format donut gradient
  let currentPercentage = 0;
  const gradientStops = languages.map(lang => {
    const start = currentPercentage;
    const end = currentPercentage + lang.percentage;
    currentPercentage = end;
    return `${lang.color} ${start}% ${end}%`;
  });
  const donutGradient = gradientStops.length > 0 ? `conic-gradient(${gradientStops.join(', ')})` : 'conic-gradient(#333 0% 100%)';

  return (
    <section id="github" ref={sectionRef} className="section-alt gh-section">
      <SectionAtmosphere />
      <div className="container">
        <SectionTitle
          badge="CÓDIGO ABIERTO"
          title="GitHub & "
          gradientTitle="Actividad"
          subtitle="Mi contribución y estadísticas en la comunidad."
        />

        <div className="gh-dashboard">
          {/* Row 1: Profile & Chart */}
          <div className="gh-card gh-card-profile">
            <div className="gh-profile-header">
              <div className="gh-profile-avatar">
                <img src={user.avatar_url || `https://github.com/${githubConfig.username}.png`} alt={user.name || githubConfig.username} width={80} height={80} loading="lazy" />
              </div>
              <div className="gh-profile-info">
                <h3>{user.name || githubConfig.username}</h3>
                <p>{user.login || githubConfig.username}</p>
              </div>
            </div>
            <div className="gh-profile-stats">
              <div className="gh-profile-stat-item gh-profile-stat-item--info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span><strong>{(totalContributions ?? 0).toLocaleString()}</strong> Contribuciones en GitHub</span>
              </div>
              <div className="gh-profile-stat-item gh-profile-stat-item--secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span><strong>{user.public_repos}</strong> Repositorios Públicos</span>
              </div>

              <div className="gh-profile-stat-item gh-profile-stat-item--warning">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span><strong>{languages.length}</strong> Lenguajes utilizados</span>
              </div>
              <div className="gh-profile-stat-item gh-profile-stat-item--success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Desarrollador Full Stack</span>
              </div>
              <div className="gh-profile-stat-item gh-profile-stat-item--primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Colaborador Activo</span>
              </div>


            </div>
          </div>

          <div className="gh-card gh-card-chart">
            <div className="gh-card-title">
              <span>Contribuciones este mes</span>
            </div>

            {monthChart ? (
              <div className="gh-month-chart">
                <div className="gh-month-chart-total">
                  <span className="gh-month-chart-total-value">{monthChart.total.toLocaleString()}</span>
                  <span className="gh-month-chart-total-label">contribuciones · {monthChart.monthLabel}</span>
                </div>

                <div className="gh-month-chart-plot">
                  <svg
                    viewBox={`0 0 ${MONTH_CHART_W} ${MONTH_CHART_H}`}
                    className="gh-month-chart-svg"
                    onMouseMove={handleMonthChartMove}
                    onMouseLeave={handleMonthChartLeave}
                    role="img"
                    aria-label={`Gráfico de barras de contribuciones diarias de ${monthChart.monthLabel}. Total: ${monthChart.total} contribuciones.`}
                  >
                    <defs>
                      <linearGradient id="gh-month-bar-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>

                    <g className="gh-month-chart-grid">
                      {monthChart.yTicks.map((t, i) => (
                        <line key={i} x1={MONTH_CHART_PAD_LEFT} x2={MONTH_CHART_W - MONTH_CHART_PAD_RIGHT} y1={t.y} y2={t.y} />
                      ))}
                      <line
                        x1={MONTH_CHART_PAD_LEFT}
                        x2={MONTH_CHART_W - MONTH_CHART_PAD_RIGHT}
                        y1={monthChart.baseline}
                        y2={monthChart.baseline}
                        className="gh-month-chart-baseline"
                      />
                    </g>

                    <g className="gh-month-chart-y-labels">
                      {monthChart.yTicks.map((t, i) => (
                        <text key={i} x={MONTH_CHART_PAD_LEFT - 8} y={t.y} textAnchor="end" dominantBaseline="middle" className="gh-month-chart-axis-label">
                          {t.value}
                        </text>
                      ))}
                    </g>

                    <g ref={monthBarsRef}>
                      {monthChart.bars.map((b, i) => (
                        <rect
                          key={b.date}
                          x={b.x}
                          y={b.y}
                          width={b.width}
                          height={Math.max(b.height, 1.5)}
                          rx={Math.min(2, b.width / 2)}
                          fill={i === monthChart.peakIndex && b.count > 0 ? '#a855f7' : 'url(#gh-month-bar-grad)'}
                          className={`gh-month-chart-bar ${monthHoverIndex === i ? 'is-hover' : ''} ${i === monthChart.todayIndex ? 'is-today' : ''}`}
                        />
                      ))}
                    </g>

                    {monthHoverIndex !== null && (
                      <line
                        x1={monthChart.bars[monthHoverIndex].cx}
                        x2={monthChart.bars[monthHoverIndex].cx}
                        y1={MONTH_CHART_PAD_TOP}
                        y2={monthChart.baseline}
                        className="gh-month-chart-cursor"
                      />
                    )}

                    <g className="gh-month-chart-x-labels">
                      {monthChart.bars.map((b, i) => (
                        <text
                          key={b.date}
                          x={b.cx}
                          y={MONTH_CHART_H - 10}
                          textAnchor="middle"
                          className={`gh-month-chart-axis-label ${i === monthChart.todayIndex ? 'is-today' : ''}`}
                        >
                          {b.day}
                        </text>
                      ))}
                    </g>
                  </svg>

                  {monthHoverIndex !== null && (
                    <div
                      className="gh-month-chart-tooltip"
                      style={{ left: `${(monthChart.bars[monthHoverIndex].cx / MONTH_CHART_W) * 100}%` }}
                    >
                      <strong>{monthChart.bars[monthHoverIndex].count}</strong>
                      <span>
                        {monthChart.bars[monthHoverIndex].count === 1 ? 'contribución' : 'contribuciones'} · {formatFullDate(monthChart.bars[monthHoverIndex].date)}
                      </span>
                    </div>
                  )}
                </div>

                <table className="sr-only">
                  <caption>Contribuciones diarias de {monthChart.monthLabel}</caption>
                  <thead><tr><th>Fecha</th><th>Contribuciones</th></tr></thead>
                  <tbody>
                    {monthChart.bars.map(b => (
                      <tr key={b.date}><td>{b.date}</td><td>{b.count}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="gh-stats-error-box gh-stats-error-box--compact">
                <p>Sin datos de actividad reciente</p>
              </div>
            )}
          </div>

          {/* Row 2: Summary Stats & Streak */}
          <div className="gh-card gh-card-summary">
            <div className="gh-card-title gh-card-title--center">Resumen General</div>
            <div className="gh-summary-row">
              <div className="gh-summary-item">
              <div className="gh-summary-icon gh-summary-icon--stars"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
              <div className="gh-summary-value">{totalStars}</div>
              <div className="gh-summary-label">Total Stars</div>
            </div>
            <div className="gh-summary-item">
              <div className="gh-summary-icon gh-summary-icon--commits"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="gh-summary-value">{totalCommits}</div>
              <div className="gh-summary-label">Total Commits</div>
            </div>
            <div className="gh-summary-item">
              <div className="gh-summary-icon gh-summary-icon--prs"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg></div>
              <div className="gh-summary-value">{totalPRs}</div>
              <div className="gh-summary-label">Pull Requests</div>
            </div>
            <div className="gh-summary-item">
              <div className="gh-summary-icon gh-summary-icon--issues"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
              <div className="gh-summary-value">{totalIssues}</div>
              <div className="gh-summary-label">Issues</div>
            </div>
            </div>
          </div>

          <div className="gh-card gh-card-streak">
            <div className="gh-card-title gh-card-title--center">Racha de Contribuciones</div>

            <div className="gh-streak-grid">
              {/* Total Contributions */}
              <div className="gh-streak-item">
                <div className="gh-streak-label gh-streak-label--nowrap">Total Contribuciones</div>
                <div className="gh-streak-value">{currentYearContributions}</div>
                <div className="gh-streak-sub">En este año</div>
              </div>

              {/* Current Streak */}
              <div className="gh-streak-item gh-streak-item--middle">
                <div className="gh-streak-label">Racha Actual</div>
                <div className="gh-neon-text gh-streak-value--main">
                  {currentStreak}
                </div>
                <div className="gh-streak-days">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gh-flame-icon">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                  </svg>
                  Días
                </div>
              </div>

              {/* Longest Streak */}
              <div className="gh-streak-item">
                <div className="gh-streak-label">Racha Más Larga</div>
                <div className="gh-streak-value">{longestStreak}</div>
                <div className="gh-streak-sub">Días récord</div>
              </div>
            </div>
          </div>

          {/* Row 3: Languages Donut */}
          <div className="gh-card gh-card-languages">
            <div className="gh-card-title">Lenguajes más usados por repositorio</div>
            <div className="gh-donut-container" role="img" aria-label={`Gráfico donut de lenguajes: ${languages.slice(0, 5).map(l => `${l.name} ${l.percentage}%`).join(', ')}`}>
              <div className="gh-donut" style={{ background: donutGradient }}>
                <div className="gh-donut-hole"></div>
              </div>
              <div className="gh-donut-legend">
                {languages.slice(0, 5).map(lang => (
                  <div key={lang.name} className="gh-donut-legend-item" title={`${lang.name}: ${lang.percentage}% de los repositorios`}>
                    <span className="gh-donut-legend-dot" style={{ backgroundColor: lang.color }}></span>
                    <span className="gh-donut-legend-name">{lang.name}</span>
                    <span className="gh-donut-legend-pct">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* Row 4: Calendar & Insights */}
          <div className="gh-card gh-card-calendar">
            <div className="gh-card-title">Calendario de contribuciones (Último año)</div>

            <div ref={calendarScrollRef} className="gh-calendar-wrapper">
              <div className="gh-calendar-inner">
                {/* Fila de Meses (arriba) */}
                <div className="gh-calendar-months">
                  {(() => {
                    const totalCols = Math.ceil(paddedCalendar.length / 7);
                    const cells: React.ReactNode[] = [];
                    let labelIdx = 0;
                    for (let col = 0; col < totalCols; col++) {
                      const lbl = monthLabels[labelIdx];
                      if (lbl && lbl.column === col) {
                        cells.push(
                          <span key={`m-${col}`} className="gh-calendar-month">
                            {lbl.label}
                          </span>
                        );
                        labelIdx++;
                      } else {
                        cells.push(<span key={`m-${col}`} className="gh-calendar-month" />);
                      }
                    }
                    return cells;
                  })()}
                </div>

                <div className="gh-calendar-body">
                  {/* Etiquetas de Días (izquierda) */}
                  <div className="gh-calendar-days">
                    <span>Dom</span>
                    <span>Lun</span>
                    <span>Mar</span>
                    <span>Mié</span>
                    <span>Jue</span>
                    <span>Vie</span>
                    <span>Sáb</span>
                  </div>

                  {/* Cuadrícula del Calendario */}
                  <div className="gh-calendar-grid">
                    {paddedCalendar.map((day, i) => (
                      <div
                        key={i}
                        className={`gh-calendar-cell ${day.contributionCount < 0 ? 'is-padding' : ''}`}
                        title={day.contributionCount >= 0 ? `${day.contributionCount} contribuciones el ${day.date}` : ''}
                        style={{ backgroundColor: getCalendarColor(day.contributionCount) }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Leyenda de colores */}
            <div className="gh-calendar-legend">
              <span>Menos</span>
              <div className="gh-calendar-legend-cells">
                {[0, 2, 5, 8, 12].map((count, i) => (
                  <div key={i} className="gh-calendar-cell" style={{ backgroundColor: getCalendarColor(count) }} />
                ))}
              </div>
              <span>Más</span>
            </div>
          </div>

        </div>

        <div className="gh-stats-cta">
          <a
            href={githubConfig.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Ver Perfil Completo en GitHub
          </a>
        </div>

      </div>
    </section>
  )
}
