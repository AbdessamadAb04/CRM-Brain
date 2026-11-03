import type { TrailProgress, UserNote, ApiKeys, NewsItem, JobItem, GitHubRepo } from '../types'

const KEY = {
  progress: 'crmbrain_progress',
  notes: 'crmbrain_notes',
  apikeys: 'crmbrain_apikeys',
  news: 'crmbrain_news',
  jobs: 'crmbrain_jobs',
  repos: 'crmbrain_repos',
  lastSync: 'crmbrain_lastSync',
  analysisFilters: 'crmbrain_analysis_filters',
}

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function set(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota / privacy mode */ }
}

// ── Progress ────────────────────────────────────────────────────────────────
export const getProgress = (): TrailProgress[] => get(KEY.progress, [])

export const updateProgress = (trailName: string, status: TrailProgress['status'], pct: number) => {
  const all = getProgress()
  const idx = all.findIndex(p => p.trail_name === trailName)
  const entry: TrailProgress = { trail_name: trailName, status, pct, updated_at: new Date().toISOString() }
  if (idx >= 0) all[idx] = entry
  else all.push(entry)
  set(KEY.progress, all)
  return all
}

// ── Notes ───────────────────────────────────────────────────────────────────
export const getNotes = (roleId: string): UserNote[] =>
  get<UserNote[]>(KEY.notes, []).filter(n => n.role_id === roleId)

export const saveNote = (roleId: string, content: string): UserNote => {
  const all = get<UserNote[]>(KEY.notes, [])
  const note: UserNote = {
    id: Date.now().toString(),
    role_id: roleId,
    content,
    created_at: new Date().toISOString(),
  }
  all.unshift(note)
  set(KEY.notes, all)
  return note
}

export const deleteNote = (id: string) => {
  const all = get<UserNote[]>(KEY.notes, []).filter(n => n.id !== id)
  set(KEY.notes, all)
  return all
}

// ── API Keys ────────────────────────────────────────────────────────────────
export const getApiKeys = (): ApiKeys => get(KEY.apikeys, { newsapi: '', github: '' })
export const saveApiKeys = (keys: ApiKeys) => set(KEY.apikeys, keys)

// ── Cache (news / jobs / repos) ─────────────────────────────────────────────
export const getCachedNews = (): NewsItem[] => get(KEY.news, [])
export const setCachedNews = (items: NewsItem[]) => set(KEY.news, items)

export const getCachedJobs = (): JobItem[] => get(KEY.jobs, [])
export const setCachedJobs = (items: JobItem[]) => set(KEY.jobs, items)

export const getCachedRepos = (): GitHubRepo[] => get(KEY.repos, [])
export const setCachedRepos = (items: GitHubRepo[]) => set(KEY.repos, items)

export const getLastSync = (): string | null => localStorage.getItem(KEY.lastSync)
export const setLastSync = () => localStorage.setItem(KEY.lastSync, new Date().toISOString())

export const clearCache = () => {
  localStorage.removeItem(KEY.news)
  localStorage.removeItem(KEY.jobs)
  localStorage.removeItem(KEY.repos)
  localStorage.removeItem(KEY.lastSync)
}

export const getAnalysisFilters = <T extends object>(fallback: T): T =>
  ({ ...fallback, ...get<Partial<T>>(KEY.analysisFilters, {}) })
export const saveAnalysisFilters = <T>(filters: T) => set(KEY.analysisFilters, filters)
