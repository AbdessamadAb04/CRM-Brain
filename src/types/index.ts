export type TrailStatus = 'not_started' | 'in_progress' | 'completed'

export interface TrailProgress {
  trail_name: string
  status: TrailStatus
  pct: number
  updated_at: string
}

export interface UserNote {
  id: string
  role_id: string
  content: string
  created_at: string
}

export interface ApiKeys {
  newsapi: string
  github: string
}

export interface NewsItem {
  source: string
  title: string
  description: string
  url: string
  published_at: string
  category: string
}

export interface JobItem {
  title: string
  company: string
  location: string
  salary: string
  url: string
  platform: string
  role_type: string
}

export interface GitHubRepo {
  name: string
  full_name: string
  description: string
  stars: number
  language: string
  url: string
  topics: string[]
}

export interface SFRole {
  id: string
  name: string
  level: string
  icon: string
  color: string
  demand: number
  demandLabel: string
  desc: string
  salaryUS: string
  salaryFR: string
  salaryCH: string
  salaryDE: string
  salaryMaroc: string
  freelanceUS: string
  freelanceEU: string
  freelanceMarket: string
  certs: string[]
  certsOptional: string[]
  skills: string[]
  experience: string
  aiRisk: string
  growth: string
  trails: Trail[]
}

export interface Trail {
  name: string
  type: 'Trail' | 'Module' | 'Superbadge ★' | 'Status Trail ★' | 'Project' | 'Cert'
  note: string
  url?: string
  phoneOnly?: boolean
}

export interface Certification {
  name: string
  tier: 'Entry' | 'Associate' | 'Consultant' | 'Specialist' | 'Expert'
  color: string
  cost: string
  difficulty: string
  passing: string
  questions: string
  duration: string
  value: string
  desc: string
  examUrl: string
}

export interface GeoData {
  flag: string
  country: string
  context: string
  salary: string
  freelance: string
  demand: string
  notes: string
}
