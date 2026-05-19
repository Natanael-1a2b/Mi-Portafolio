import { useEffect, useRef, useState } from 'react'
import { githubConfig, fetchGitHubData, streakCardUrl } from '../../data/github'
import { SectionTitle } from '../ui/SectionTitle'
import { usePreferredMotion } from '../../hooks/usePreferredMotion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatsData {
  public_repos: number
  followers: number
  totalStars: number
  totalForks: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  languages: { name: string; percentage: number; color: string }[]
}

export function GitHubStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = usePreferredMotion()
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [streakLoaded, setStreakLoaded] = useState(false)
  const [streakError, setStreakError] = useState(false)

  useEffect(() => {
    fetchGitHubData().then(result => {
      if (result) {
        setData({
          public_repos: result.user.public_repos,
          followers: result.user.followers,
          totalStars: result.totalStars,
          totalForks: result.totalForks,
          totalCommits: result.totalCommits,
          totalPRs: result.totalPRs,
          totalIssues: result.totalIssues,
          languages: result.languages,
        })
      } else {
        setError(true)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (prefersReduced || !sectionRef.current || loading) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.gh-stat-item',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-stats-grid', start: 'top 85%', once: true },
        }
      )
      gsap.fromTo('.gh-streak-card, .gh-lang-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-stats-grid', start: 'top 85%', once: true },
        }
      )
      gsap.fromTo('.gh-stats-cta',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, delay: 0.6,
          scrollTrigger: { trigger: '.gh-stats-grid', start: 'top 85%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced, loading])

  const statCards = data ? [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      value: data.public_repos,
      label: 'Total de Repositorios',
      colorClass: '',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      value: data.totalStars,
      label: 'Estrellas',
      colorClass: 'gh-stat-icon--stars',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
          <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><line x1="12" y1="12" x2="12" y2="15"/>
        </svg>
      ),
      value: data.totalForks,
      label: 'Forks',
      colorClass: 'gh-stat-icon--forks',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      value: data.totalCommits,
      label: 'Commits',
      colorClass: 'gh-stat-icon--commits',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
          <path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
        </svg>
      ),
      value: data.totalPRs,
      label: 'Pull Requests',
      colorClass: 'gh-stat-icon--prs',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      value: data.followers,
      label: 'Seguidores',
      colorClass: 'gh-stat-icon--followers',
    },
  ] : []

  return (
    <section id="github" ref={sectionRef} className="section-alt">
      <div className="container">
        <SectionTitle title="GitHub & Actividad" />

        {loading && (
          <div className="gh-stats-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="gh-stat-item glass-card">
                <div className="gh-stat-skeleton"><div className="gh-stat-skeleton-shimmer" /></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="gh-stats-error-box glass-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>No se pudieron cargar las estadísticas</p>
            <a href={githubConfig.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              Ver perfil en GitHub
            </a>
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards Grid */}
            <div className="gh-stats-grid">
              {statCards.map(card => (
                <div key={card.label} className="gh-stat-item glass-card">
                  <div className={`gh-stat-icon ${card.colorClass}`}>{card.icon}</div>
                  <div className="gh-stat-value">{card.value.toLocaleString()}</div>
                  <div className="gh-stat-label">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Streak Card */}
            <div className="gh-streak-card glass-card">
              {!streakLoaded && !streakError && (
                <div className="gh-stat-skeleton"><div className="gh-stat-skeleton-shimmer" /></div>
              )}
              {streakError && (
                <div className="gh-streak-fallback">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <span>Racha de contribuciones no disponible</span>
                </div>
              )}
              <img
                src={streakCardUrl}
                alt="Racha de contribuciones en GitHub"
                loading="lazy"
                onLoad={() => setStreakLoaded(true)}
                onError={() => setStreakError(true)}
                style={{ opacity: streakLoaded ? 1 : 0, position: streakLoaded ? 'relative' : 'absolute' }}
              />
            </div>

            {/* Languages Card */}
            <div className="gh-lang-card glass-card">
              <h4 className="gh-lang-title">Lenguajes Más Usados</h4>
              <div className="gh-lang-bar">
                {data.languages.map(lang => (
                  <div
                    key={lang.name}
                    className="gh-lang-bar-segment"
                    style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>
              <div className="gh-lang-legend">
                {data.languages.map(lang => (
                  <div key={lang.name} className="gh-lang-item">
                    <span className="gh-lang-dot" style={{ backgroundColor: lang.color }} />
                    <span className="gh-lang-name">{lang.name}</span>
                    <span className="gh-lang-pct">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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
