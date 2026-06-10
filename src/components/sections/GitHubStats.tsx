import { useEffect, useRef, useState } from 'react'
import { githubConfig, fetchGitHubData, streakCardUrl, GitHubStatsResult } from '../../data/github'
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
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-dashboard', start: 'top 85%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced, loading])

  if (loading) {
    return (
      <section id="github" ref={sectionRef} className="section-alt" style={{ position: 'relative' }}>
        <SectionAtmosphere variant="minimal" withScanLines={true} glowPosition="none" />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <SectionTitle title="GitHub & Actividad" />
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
        <SectionAtmosphere variant="minimal" withScanLines={true} glowPosition="none" />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <SectionTitle title="GitHub & Actividad" />
          <div className="gh-stats-error-box glass-card">
            <p>No se pudieron cargar las estadísticas</p>
          </div>
        </div>
      </section>
    )
  }

  const { user, totalContributions, totalStars, totalCommits, totalPRs, totalIssues, languages } = data;
  
  const totalContribs = totalContributions ?? (totalCommits + totalPRs + totalIssues);
  
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
      <SectionAtmosphere variant="minimal" withScanLines={true} glowPosition="none" />
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionTitle title="GitHub & Actividad" />

        <div className="gh-dashboard">
          {/* Row 1: Profile & Chart */}
          <div className="gh-card gh-card-profile">
            <div className="gh-profile-header">
              <div className="gh-profile-avatar">
                <img src={user.avatar_url || `https://github.com/${githubConfig.username}.png`} alt={user.name || githubConfig.username} />
              </div>
              <div className="gh-profile-info">
                <h3>{user.name || githubConfig.username}</h3>
                <p>{user.login || githubConfig.username}</p>
              </div>
            </div>
            <div className="gh-profile-stats">
              <div className="gh-profile-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#38bdf8' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span><strong>{totalContribs.toLocaleString()}</strong> Contribuciones en GitHub</span>
              </div>
              <div className="gh-profile-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#a855f7' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span><strong>{user.total_repos || user.public_repos}</strong> Repositorios en GitHub</span>
              </div>

              <div className="gh-profile-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#eab308' }}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <span><strong>{languages.length}</strong> Lenguajes utilizados</span>
              </div>
              <div className="gh-profile-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#10b981' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Desarrollador Full Stack</span>
              </div>
              <div className="gh-profile-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#3b82f6' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Colaborador Activo</span>
              </div>
              <div className="gh-profile-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#ec4899' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span>Apasionado por el Código</span>
              </div>
            </div>
          </div>

          <div className="gh-card gh-card-chart">
            <div className="gh-card-title">Contribuciones en el último mes</div>
            {/* Usando GitHub Readme Activity Graph */}
            <img src={`https://github-readme-activity-graph.vercel.app/graph?username=${githubConfig.username}&bg_color=00000000&color=a855f7&line=6366f1&point=fff&area=true&hide_border=true&hide_title=true`} alt="Activity Graph" />
          </div>

          {/* Row 2: Summary Stats & Streak */}
          <div className="gh-card gh-card-summary">
            <div className="gh-card-title" style={{ width: '100%', marginBottom: '1.5rem', textAlign: 'center' }}>Resumen General</div>
            <div className="gh-summary-row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div className="gh-summary-item">
              <div className="gh-summary-icon" style={{ color: '#fbbf24' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
              <div className="gh-summary-value">{totalStars}</div>
              <div className="gh-summary-label">Total Stars</div>
            </div>
            <div className="gh-summary-item">
              <div className="gh-summary-icon" style={{ color: '#a855f7' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="gh-summary-value">{totalCommits}</div>
              <div className="gh-summary-label">Total Commits</div>
            </div>
            <div className="gh-summary-item">
              <div className="gh-summary-icon" style={{ color: '#34d399' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg></div>
              <div className="gh-summary-value">{totalPRs}</div>
              <div className="gh-summary-label">Pull Requests</div>
            </div>
            <div className="gh-summary-item">
              <div className="gh-summary-icon" style={{ color: '#f87171' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
              <div className="gh-summary-value">{totalIssues}</div>
              <div className="gh-summary-label">Issues</div>
            </div>
            </div>
          </div>

          <div className="gh-card gh-card-streak">
            <div className="gh-card-title" style={{ width: '100%', marginBottom: '0', marginTop: '1rem', textAlign: 'center' }}>Racha de Contribuciones</div>
            <img src={streakCardUrl} alt="GitHub Streak" loading="lazy" />
          </div>

          {/* Row 3: Languages Donut */}
          <div className="gh-card gh-card-languages">
            <div className="gh-card-title">Lenguajes más usados por repositorio</div>
            <div className="gh-donut-container">
              <div className="gh-donut" style={{ background: donutGradient }}>
                <div className="gh-donut-hole"></div>
              </div>
              <div className="gh-donut-legend">
                {languages.slice(0, 5).map(lang => (
                  <div key={lang.name} className="gh-donut-legend-item">
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
            <div className="gh-card-title">Calendario de contribuciones</div>
            <div className="gh-calendar-wrapper">
              <img src={`https://ghchart.rshah.org/${githubConfig.username}`} alt="GitHub Contribution Calendar" />
            </div>
          </div>

          <div className="gh-card gh-card-insights">
            <div className="gh-card-title" style={{ textAlign: 'center', width: '100%', marginBottom: '0.5rem' }}>Insights</div>
            <div className="gh-insights-row">
              <div className="gh-insight-item">
                <div className="gh-insight-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div className="gh-insight-content">
                  <h4>¡Gran crecimiento!</h4>
                  <p>Tus contribuciones han sido muy constantes este último año.</p>
                </div>
              </div>
              <div className="gh-insight-item">
                <div className="gh-insight-icon" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div className="gh-insight-content">
                  <h4>Sigue así 💪</h4>
                  <p>Mantén tu racha de contribuciones para seguir creciendo.</p>
                </div>
              </div>
              <div className="gh-insight-item">
                <div className="gh-insight-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <div className="gh-insight-content">
                  <h4>Enfoque Moderno</h4>
                  <p>La mayor parte de tus proyectos recientes utilizan React y TypeScript.</p>
                </div>
              </div>
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
