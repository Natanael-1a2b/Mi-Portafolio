export const githubConfig = {
  username: 'Natanael-1a2b',
  profileUrl: 'https://github.com/Natanael-1a2b',
  apiBase: 'https://api.github.com',
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
  dates: '94a3b8',
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
  const u = githubConfig.username
  try {
    const [userRes, reposRes, commitsRes, prsRes, issuesRes] = await Promise.all([
      fetch(`${githubConfig.apiBase}/users/${u}`),
      fetch(`${githubConfig.apiBase}/users/${u}/repos?per_page=100&sort=updated`),
      fetch(`${githubConfig.apiBase}/search/commits?q=author:${u}`, {
        headers: { Accept: 'application/vnd.github.cloak-preview+json' },
      }),
      fetch(`${githubConfig.apiBase}/search/issues?q=author:${u}+type:pr`),
      fetch(`${githubConfig.apiBase}/search/issues?q=author:${u}+type:issue+is:issue`),
    ])

    if (!userRes.ok || !reposRes.ok) return null

    const user: GitHubUserData = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()
    const commitsData = commitsRes.ok ? await commitsRes.json() : { total_count: 0 }
    const prsData = prsRes.ok ? await prsRes.json() : { total_count: 0 }
    const issuesData = issuesRes.ok ? await issuesRes.json() : { total_count: 0 }

    const ownRepos = repos.filter(r => !r.fork)

    const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0)

    // Calculate language distribution by repo size
    const langMap: Record<string, number> = {}
    let totalSize = 0
    for (const repo of ownRepos) {
      if (repo.language && repo.size > 0) {
        langMap[repo.language] = (langMap[repo.language] || 0) + repo.size
        totalSize += repo.size
      }
    }

    const languages = Object.entries(langMap)
      .map(([name, size]) => ({
        name,
        percentage: Math.round((size / totalSize) * 100),
        color: languageColors[name] || '#94a3b8',
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8)

    return {
      user,
      totalStars,
      totalForks,
      totalCommits: commitsData.total_count || 0,
      totalPRs: prsData.total_count || 0,
      totalIssues: issuesData.total_count || 0,
      languages,
    }
  } catch {
    return null
  }
}

// GitHub language colors
const languageColors: Record<string, string> = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'C#': '#178600',
  'Python': '#3572A5',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'C': '#555555',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'SCSS': '#c6538c',
  'Astro': '#ff5a03',
}
