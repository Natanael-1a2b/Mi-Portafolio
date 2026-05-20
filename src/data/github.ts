export const githubConfig = {
  username: 'Natanael-1a2b',
  profileUrl: 'https://github.com/Natanael-1a2b',
  apiBase: 'https://api.github.com',
  dataUrl: 'https://raw.githubusercontent.com/Natanael-1a2b/Mi-Portafolio/github-stats-data/github-stats.json',
}

// Streak card (demolab.com is the maintained host — works reliably)
const streakColors = {
  bg: '0a0a12',
  ring: '6366f1',
  fire: '06b6d4',
  currStreakNum: 'f8fafc',
  sideNums: 'a855f7',
  currStreakLabel: '6366f1',
  sideLabels: 'f8fafc',
  dates: '0a0a12', // Oculto con el color del fondo
}

export const streakCardUrl = `https://streak-stats.demolab.com/?user=${githubConfig.username}&hide_border=true&locale=es&background=${streakColors.bg}&ring=${streakColors.ring}&fire=${streakColors.fire}&currStreakNum=${streakColors.currStreakNum}&sideNums=${streakColors.sideNums}&currStreakLabel=${streakColors.currStreakLabel}&sideLabels=${streakColors.sideLabels}&dates=${streakColors.dates}`

export interface GitHubUserData {
  public_repos: number
  followers: number
  following: number
  public_gists: number
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
  totalCommits: number
  totalPRs: number
  totalIssues: number
  languages: { name: string; percentage: number; color: string }[]
}

export async function fetchGitHubData(): Promise<GitHubStatsResult | null> {
  try {
    const response = await fetch(githubConfig.dataUrl)
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
        followers: user.followers,
        following: user.following,
        public_gists: user.public_gists || 0
      },
      totalStars,
      totalForks,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      languages: []
    }
  } catch {
    return null
  }
}
