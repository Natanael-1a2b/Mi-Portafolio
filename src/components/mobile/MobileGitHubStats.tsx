import { useEffect, useState } from 'react'
import { githubConfig, fetchGitHubData, GitHubStatsResult } from '../../data/github'
import { SectionTitle } from '../ui/SectionTitle'
import { useFadeIn } from '../../hooks/useFadeIn'
import { formatNumber } from '../../utils/format'

export function MobileGitHubStats() {
  const [data, setData] = useState<GitHubStatsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const ref = useFadeIn<HTMLElement>()

  useEffect(() => {
    fetchGitHubData()
      .then(result => setData(result))
      // Sin catch, un fallo dejaba el mensaje de carga para siempre
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <section className="mobile-section mobile-github mobile-fade-in" ref={ref}>
        <div className="mobile-container">
          <SectionTitle badge="CÓDIGO ABIERTO" title="GitHub & " gradientTitle="Actividad" />
          <div className="mobile-gh-loading" role="status" aria-live="polite">
            {loading ? 'Cargando estadísticas…' : (
              <>
                No se pudieron cargar las estadísticas.{' '}
                <a href={githubConfig.profileUrl} target="_blank" rel="noopener noreferrer">Ver perfil en GitHub</a>
              </>
            )}
          </div>
        </div>
      </section>
    )
  }

  const { user, totalContributions, totalStars, currentYearContributions, currentStreak } = data

  return (
    <section className="mobile-section mobile-github mobile-fade-in" ref={ref}>
      <div className="mobile-container">
        <SectionTitle 
          badge="CÓDIGO ABIERTO"
          title="GitHub & "
          gradientTitle="Actividad"
        />
        
        <div className="mobile-gh-dashboard">
          {/* Perfil */}
          <div className="mobile-gh-card mobile-gh-profile">
            <img src={user.avatar_url} alt={user.name} width={60} height={60} loading="lazy" />
            <div className="mobile-gh-profile-info">
              <h3>{user.name}</h3>
              <p>{user.login}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mobile-gh-stats-grid">
            <div className="mobile-gh-stat-box">
              <span className="mobile-gh-stat-value">{formatNumber(totalContributions)}</span>
              <span className="mobile-gh-stat-label">Contribuciones</span>
            </div>
            <div className="mobile-gh-stat-box">
              <span className="mobile-gh-stat-value">{formatNumber(totalStars)}</span>
              <span className="mobile-gh-stat-label">Estrellas</span>
            </div>
            <div className="mobile-gh-stat-box highlight-box">
              <span className="mobile-gh-stat-value">{formatNumber(currentStreak)}</span>
              <span className="mobile-gh-stat-label">Racha (Días)</span>
            </div>
            <div className="mobile-gh-stat-box">
              <span className="mobile-gh-stat-value">{formatNumber(currentYearContributions)}</span>
              <span className="mobile-gh-stat-label">Este Año</span>
            </div>
            <div className="mobile-gh-stat-box">
              <span className="mobile-gh-stat-value">{formatNumber(user.public_repos)}</span>
              <span className="mobile-gh-stat-label">Repositorios</span>
            </div>
            <div className="mobile-gh-stat-box">
              <span className="mobile-gh-stat-value">{formatNumber(data.totalPRs)}</span>
              <span className="mobile-gh-stat-label">Pull Requests</span>
            </div>
          </div>

          <a 
            href={githubConfig.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mobile-btn-outline"
          >
            Ver Perfil en GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
