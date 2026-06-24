export const githubConfig = {
  username: 'Natanael-1a2b',
  profileUrl: 'https://github.com/Natanael-1a2b',
  apiBase: 'https://api.github.com',
  dataUrl: import.meta.env.DEV
    ? `${import.meta.env.BASE_URL}github-stats.json`
    : 'https://raw.githubusercontent.com/Natanael-1a2b/Mi-Portafolio/github-stats-data/github-stats.json',
}

// El componente nativo reemplaza al antiguo streakCardUrl

export interface GitHubUserData {
  public_repos: number
  total_repos: number
  public_gists?: number
  followers: number
  following: number
  avatar_url?: string
  name?: string
  created_at?: string
  login?: string
}

export interface GitHubRepo {
  name: string
  stargazers_count: number
  forks_count: number
  language: string | null
  fork: boolean
  size: number
}

export interface GitHubStatsResult {
  user: GitHubUserData
  totalStars: number
  totalForks: number
  totalContributions?: number
  currentYearContributions?: number
  currentStreak?: number
  longestStreak?: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  totalReviews?: number
  languages: { name: string; percentage: number; color: string }[]
  calendar?: { date: string; contributionCount: number }[]
}

export async function fetchGitHubData(): Promise<GitHubStatsResult | null> {
  try {
    // Add a cache buster to prevent the browser from caching old JSON data (which might contain 0s)
    const fetchUrl = `${githubConfig.dataUrl}?t=${Date.now()}`
    const response = await fetch(fetchUrl)
    if (!response.ok) {
      throw new Error('No se pudo obtener el JSON estático')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.warn('Error fetching static GitHub stats, falling back to live public API or default values', error)
    return fetchGitHubDataFallback()
  }
}

async function fetchGitHubDataFallback(): Promise<GitHubStatsResult | null> {
  const u = githubConfig.username
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${githubConfig.apiBase}/users/${u}`),
      fetch(`${githubConfig.apiBase}/users/${u}/repos?per_page=100&sort=updated`),
    ])
    if (!userRes.ok || !reposRes.ok) return null

    const user = await userRes.json()
    const repos = await reposRes.json()
    const ownRepos = repos.filter((r: any) => !r.fork)

    const totalStars = ownRepos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0)
    const totalForks = ownRepos.reduce((sum: number, r: any) => sum + r.forks_count, 0)

    return {
      user: {
        public_repos: user.public_repos,
        total_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        public_gists: user.public_gists || 0,
        avatar_url: user.avatar_url,
        name: user.name,
        created_at: user.created_at,
        login: user.login,
      },
      totalStars,
      totalForks,
      totalContributions: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      languages: []
    }
  } catch {
    return null
  }
}
