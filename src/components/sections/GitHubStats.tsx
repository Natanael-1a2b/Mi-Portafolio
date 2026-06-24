import { useEffect, useRef, useState, useMemo } from 'react'
import { githubConfig, fetchGitHubData, GitHubStatsResult } from '../../data/github'
import { SectionTitle } from '../ui/SectionTitle'
import { SectionAtmosphere } from '../ui/SectionAtmosphere'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function GitHubStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()
  const [data, setData] = useState<GitHubStatsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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

  const calendarData = data?.calendar || [];
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

  if (loading) {
    return (
      <section id="github" ref={sectionRef} className="section-alt" style={{ position: 'relative' }}>
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
              <div key={i} className="gh-card gh-card-languages" style={{ minHeight: '250px' }}>
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
      <section id="github" ref={sectionRef} className="section-alt" style={{ position: 'relative' }}>
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
    <section id="github" ref={sectionRef} className="section-alt" style={{ position: 'relative' }}>
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
              <div className="gh-profile-stat-item" style={{ color: 'var(--color-info)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span><strong>{(totalContributions ?? 0).toLocaleString()}</strong> Contribuciones en GitHub</span>
              </div>
              <div className="gh-profile-stat-item" style={{ color: 'var(--secondary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span><strong>{user.public_repos}</strong> Repositorios Públicos</span>
              </div>

              <div className="gh-profile-stat-item" style={{ color: 'var(--color-warning)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span><strong>{languages.length}</strong> Lenguajes utilizados</span>
              </div>
              <div className="gh-profile-stat-item" style={{ color: 'var(--color-success)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Desarrollador Full Stack</span>
              </div>
              <div className="gh-profile-stat-item" style={{ color: 'var(--primary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Colaborador Activo</span>
              </div>


            </div>
          </div>

          <div className="gh-card gh-card-chart">
            <div className="gh-card-title">Contribuciones en el último mes</div>
            {/* Usando GitHub Readme Activity Graph */}
            <img src={`https://github-readme-activity-graph.vercel.app/graph?username=${githubConfig.username}&bg_color=00000000&color=a855f7&line=6366f1&point=fff&area=true&hide_border=true&hide_title=true`} alt="Activity Graph" title="Gráfico de contribuciones del último mes" loading="lazy" />
          </div>

          {/* Row 2: Summary Stats & Streak */}
          <div className="gh-card gh-card-summary">
            <div className="gh-card-title" style={{ width: '100%', marginBottom: '0.75rem', textAlign: 'center' }}>Resumen General</div>
            <div className="gh-summary-row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
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

          <div className="gh-card gh-card-streak" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 1.5rem' }}>
            <div className="gh-card-title" style={{ width: '100%', marginBottom: '0.75rem', textAlign: 'center' }}>Racha de Contribuciones</div>
            
            <div className="gh-streak-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1rem', 
              width: '100%',
              textAlign: 'center'
            }}>
              {/* Total Contributions */}
              <div className="gh-streak-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Contribuciones</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentYearContributions}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>En este año</div>
              </div>
              
              {/* Current Streak */}
              <div className="gh-streak-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Racha Actual</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-info)', display: 'flex', alignItems: 'center', gap: '0.5rem', textShadow: '0 0 20px rgba(0, 191, 255, 0.4)' }}>
                  {currentStreak}
                </div>
                <div style={{ color: 'var(--color-info)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 8 8 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 8 12 2 12 2ZM12 22C7.58172 22 4 18.4183 4 14C4 10.4241 6.34758 7.37893 9.53932 6.13623C8.57277 7.74704 8 9.80556 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 10.9765 15.6159 10.0416 14.9818 9.32422C16.8184 10.4497 18 12.5638 18 15C18 18.866 14.866 22 12 22Z"/>
                  </svg>
                  Días
                </div>
              </div>
              
              {/* Longest Streak */}
              <div className="gh-streak-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Racha Más Larga</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{longestStreak}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Días récord</div>
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
            
            <div ref={calendarScrollRef} className="gh-calendar-wrapper" style={{ 
              overflowX: 'auto', 
              paddingBottom: '0.5rem', 
              width: '100%'
            }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', minWidth: 'max-content' }}>
                {/* Fila de Meses (arriba) */}
                <div style={{ display: 'flex', paddingLeft: '32px' }}>
                  {(() => {
                    const totalCols = Math.ceil(paddedCalendar.length / 7);
                    const cells: React.ReactNode[] = [];
                    let labelIdx = 0;
                    for (let col = 0; col < totalCols; col++) {
                      const lbl = monthLabels[labelIdx];
                      if (lbl && lbl.column === col) {
                        cells.push(
                          <span key={`m-${col}`} style={{ width: '16px', fontSize: '0.7rem', color: 'var(--text-tertiary)', textAlign: 'left', whiteSpace: 'nowrap' }}>
                            {lbl.label}
                          </span>
                        );
                        labelIdx++;
                      } else {
                        cells.push(<span key={`m-${col}`} style={{ width: '16px' }} />);
                      }
                    }
                    return cells;
                  })()}
                </div>

                <div style={{ display: 'flex', gap: '0px' }}>
                  {/* Etiquetas de Días (izquierda) */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateRows: 'repeat(7, 1fr)', 
                    width: '28px',
                    flexShrink: 0,
                    color: 'var(--text-tertiary)',
                    fontSize: '0.65rem',
                    textAlign: 'right',
                    paddingRight: '6px',
                    height: '112px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Dom</span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Lun</span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Mar</span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Mié</span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Jue</span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Vie</span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Sáb</span>
                  </div>
                  
                  {/* Cuadrícula del Calendario */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateRows: 'repeat(7, 1fr)', 
                    gridAutoFlow: 'column', 
                    gap: '4px',
                    height: '112px'
                  }}>
                    {paddedCalendar.map((day, i) => (
                      <div 
                        key={i} 
                        title={day.contributionCount >= 0 ? `${day.contributionCount} contribuciones el ${day.date}` : ''}
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: getCalendarColor(day.contributionCount),
                          borderRadius: '2px',
                          opacity: day.contributionCount < 0 ? 0 : 1
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Leyenda de colores */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              <span>Menos</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 2, 5, 8, 12].map((count, i) => (
                  <div key={i} style={{ width: '12px', height: '12px', backgroundColor: getCalendarColor(count), borderRadius: '2px' }} />
                ))}
              </div>
              <span>Más</span>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <a
            href={githubConfig.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Ver Perfil Completo en GitHub
          </a>
        </div>

      </div>
    </section>
  )
}
