# Plan: Corregir datos de GitHub

## Problema
`dist-data/github-stats.json` tiene datos incorrectos porque el script se ejecutó sin PAT, sobrescribiendo los datos reales del branch `github-stats-data`.

## Datos reales (branch, con PAT)
- Contribuciones: 598 (577 commits + 11 PRs + 10 issues)
- Repos públicos: 12
- Repos totales: **26** (el branch cuenta 26 repos sin filtrar forks)
- Lenguajes: 8 (C# 30% domina)

## Cambios a realizar

### 1. `dist-data/github-stats.json`
Agregar `total_repos: 26` después de `public_repos: 12`
```json
"public_repos": 12,
"total_repos": 26,
```

### 2. `scripts/fetch-github-stats.js:120`
Cambiar `total_repos: user.public_repos` → `total_repos: repos.length`
```js
public_repos: user.public_repos,
total_repos: repos.length,
```

### 3. `scripts/fetch-github-stats.js:65-68`
Iterar lenguajes sobre `repos` (todos) en vez de `ownRepos` (solo no-fork) para incluir forks:
```js
const langPromises = repos.map(repo => 
  fetchGH(`/repos/${repo.owner.login}/${repo.name}/languages`).catch(() => ({}))
);
```

### 4. Script - quitar límite de 8 lenguajes
Cambiar `.slice(0, 8)` por `.slice(0, 15)` o eliminar el límite.

### 5. Build
```bash
npm run build
```

## Archivos que NO necesitan cambios
- `src/data/github.ts` — ya tiene `total_repos` en la interfaz
- `src/components/sections/GitHubStats.tsx` — ya usa `user.total_repos || user.public_repos`

## Resultado final esperado
- **598** Contribuciones en GitHub
- **26** Repositorios en GitHub
- **8+** Lenguajes (C# 30% dominante)
