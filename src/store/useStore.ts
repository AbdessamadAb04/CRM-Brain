import { create } from 'zustand'
import type { TrailProgress, NewsItem, JobItem, GitHubRepo } from '../types'
import type { AnalysisFilters } from '../data/analysis'
import { DEFAULT_FILTERS } from '../data/analysis'
import * as storage from '../services/storage'

interface Store {
  // UI
  activeTab: string
  selectedRole: string
  selectedCareer: string
  sidebarCollapsed: boolean
  isSyncing: boolean
  syncLog: string[]
  lastSync: string | null

  // Data
  progress: TrailProgress[]
  news: NewsItem[]
  jobs: JobItem[]
  repos: GitHubRepo[]

  // Analyse filters
  filters: AnalysisFilters

  // Actions — UI
  setTab: (tab: string) => void
  setRole: (role: string) => void
  setCareer: (career: string) => void
  toggleSidebar: () => void
  setSyncing: (v: boolean) => void
  addLog: (msg: string) => void
  clearLog: () => void
  setLastSync: (v: string | null) => void

  // Actions — Data
  loadAll: () => void
  updateProgress: (name: string, status: TrailProgress['status'], pct: number) => void
  setNews: (items: NewsItem[]) => void
  setJobs: (items: JobItem[]) => void
  setRepos: (items: GitHubRepo[]) => void
  setFilters: (patch: Partial<AnalysisFilters>) => void
  resetFilters: () => void
}

export const useStore = create<Store>((set) => ({
  activeTab: 'dashboard',
  selectedRole: 'consultant',
  selectedCareer: 'salesforce',
  sidebarCollapsed: false,
  isSyncing: false,
  syncLog: [],
  lastSync: storage.getLastSync(),
  progress: [],
  news: [],
  jobs: [],
  repos: [],
  filters: storage.getAnalysisFilters(DEFAULT_FILTERS),

  setTab: (tab) => set({ activeTab: tab }),
  setRole: (role) => set({ selectedRole: role }),
  setCareer: (career) => set({ selectedCareer: career, selectedRole: '' }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSyncing: (v) => set({ isSyncing: v }),
  addLog: (msg) => set(s => ({ syncLog: [...s.syncLog.slice(-6), msg] })),
  clearLog: () => set({ syncLog: [] }),
  setLastSync: (v) => set({ lastSync: v }),

  loadAll: () => {
    set({
      progress: storage.getProgress(),
      news: storage.getCachedNews(),
      jobs: storage.getCachedJobs(),
      repos: storage.getCachedRepos(),
    })
  },

  updateProgress: (name, status, pct) => {
    const all = storage.updateProgress(name, status, pct)
    set({ progress: all })
  },

  setNews: (news) => set({ news }),
  setJobs: (jobs) => set({ jobs }),
  setRepos: (repos) => set({ repos }),

  setFilters: (patch) => set(s => {
    const filters = { ...s.filters, ...patch }
    storage.saveAnalysisFilters(filters)
    return { filters }
  }),
  resetFilters: () => {
    storage.saveAnalysisFilters(DEFAULT_FILTERS)
    set({ filters: DEFAULT_FILTERS })
  },
}))
