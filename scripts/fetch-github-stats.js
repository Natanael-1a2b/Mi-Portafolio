import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'Natanael-1a2b';
const TOKEN = process.env.GH_PAT || process.env.GITHUB_TOKEN;

async function fetchGH(endpoint, options = {}) {
  const headers = {
    'User-Agent': 'github-stats-fetcher',
    ...options.headers,
  };
  if (TOKEN) {
    headers['Authorization'] = `Bearer ${TOKEN.trim()}`;
  }
  const response = await fetch(`https://api.github.com${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No response body');
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText} (${response.status}) - ${errorText}`);
  }
  return response.json();
}

async function main() {
  try {
    console.log(`Recopilando estadísticas de GitHub para el usuario: ${USERNAME}...`);
    const user = await fetchGH(`/users/${USERNAME}`);
    
    console.log('Obteniendo repositorios...');
    // Si hay un PAT personalizado (no el GITHUB_TOKEN por defecto), podemos obtener repos privados.
    const hasCustomPAT = process.env.GH_PAT && process.env.GH_PAT.trim() !== '';
    const reposEndpoint = hasCustomPAT 
      ? '/user/repos?per_page=100&affiliation=owner' 
      : `/users/${USERNAME}/repos?per_page=100`;
      
    const repos = await fetchGH(reposEndpoint);
    const ownRepos = repos.filter(r => !r.fork);
    
    const totalStars = ownRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = ownRepos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    
    console.log('Obteniendo estadísticas de commits, PRs e Issues...');
    // Realizamos búsquedas en la API
    const commitsData = await fetchGH(`/search/commits?q=author:${USERNAME}`).catch(() => ({ total_count: 0 }));
    const prsData = await fetchGH(`/search/issues?q=author:${USERNAME}+type:pr`).catch(() => ({ total_count: 0 }));
    const issuesData = await fetchGH(`/search/issues?q=author:${USERNAME}+type:issue+is:issue`).catch(() => ({ total_count: 0 }));
    
    // Distribución de lenguajes
    const langMap = {};
    let totalSize = 0;
    for (const repo of ownRepos) {
      if (repo.language && repo.size > 0) {
        langMap[repo.language] = (langMap[repo.language] || 0) + repo.size;
        totalSize += repo.size;
      }
    }
    
    const languageColors = {
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
    };
    
    const languages = Object.entries(langMap)
      .map(([name, size]) => ({
        name,
        percentage: totalSize > 0 ? Math.round((size / totalSize) * 100) : 0,
        color: languageColors[name] || '#94a3b8',
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8);
      
    const result = {
      lastUpdated: new Date().toISOString(),
      user: {
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
      },
      totalStars,
      totalForks,
      totalCommits: commitsData.total_count || 0,
      totalPRs: prsData.total_count || 0,
      totalIssues: issuesData.total_count || 0,
      languages,
    };
    
    const outputDir = path.join(__dirname, '../dist-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'github-stats.json'),
      JSON.stringify(result, null, 2)
    );
    console.log('¡Estadísticas de GitHub obtenidas y guardadas exitosamente!');
  } catch (error) {
    console.error('Error al obtener estadísticas de GitHub:', error);
    process.exit(1);
  }
}

main();
