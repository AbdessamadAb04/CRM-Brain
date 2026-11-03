import axios from 'axios'
import type { NewsItem, GitHubRepo, JobItem } from '../types'
import { setCachedNews, setCachedJobs, setCachedRepos, setLastSync } from './storage'

// ── NewsAPI ──────────────────────────────────────────────────────────────────
export async function fetchNews(apiKey: string): Promise<NewsItem[]> {
  if (!apiKey) throw new Error('Clé NewsAPI manquante')
  const queries = ['Salesforce Agentforce 2026', 'Salesforce CRM consultant', 'HubSpot CRM']
  const results: NewsItem[] = []
  const seen = new Set<string>()

  for (const q of queries) {
    try {
      const { data } = await axios.get('https://newsapi.org/v2/everything', {
        params: { q, language: 'en', sortBy: 'publishedAt', pageSize: 10, apiKey },
      })
      for (const a of (data.articles || [])) {
        if (!a.url || seen.has(a.url)) continue
        seen.add(a.url)
        results.push({
          source: a.source?.name || 'Unknown',
          title: a.title || '',
          description: a.description || '',
          url: a.url,
          published_at: a.publishedAt || '',
          category: categorize(a.title + ' ' + (a.description || '')),
        })
      }
    } catch { /* skip failed query */ }
  }

  // Salesforce official blog via RSS proxy
  try {
    const { data } = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.salesforce.com/blog/feed/',
      { timeout: 6000 }
    )
    for (const item of (data.items || []).slice(0, 10)) {
      if (!item.link || seen.has(item.link)) continue
      seen.add(item.link)
      results.push({
        source: 'Salesforce Blog',
        title: item.title || '',
        description: (item.description || '').replace(/<[^>]*>/g, '').slice(0, 200),
        url: item.link,
        published_at: item.pubDate || '',
        category: 'official',
      })
    }
  } catch { /* RSS may fail */ }

  setCachedNews(results)
  return results
}

function categorize(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('agentforce') || t.includes('ai agent')) return 'agentforce'
  if (t.includes('certif') || t.includes('trailhead')) return 'certification'
  if (t.includes('job') || t.includes('hiring') || t.includes('career')) return 'jobs'
  if (t.includes('revenue') || t.includes('earning') || t.includes('financial')) return 'finance'
  if (t.includes('hubspot')) return 'hubspot'
  return 'general'
}

// ── GitHub ────────────────────────────────────────────────────────────────────
export async function fetchRepos(token?: string): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const queries = ['salesforce awesome', 'salesforce agentforce', 'hubspot crm integration', 'salesforce apex lwc']
  const results: GitHubRepo[] = []
  const seen = new Set<string>()

  for (const q of queries) {
    try {
      const { data } = await axios.get('https://api.github.com/search/repositories', {
        params: { q, sort: 'stars', order: 'desc', per_page: 8 },
        headers,
      })
      for (const r of (data.items || [])) {
        if (seen.has(r.full_name)) continue
        seen.add(r.full_name)
        results.push({
          name: r.name,
          full_name: r.full_name,
          description: r.description || '',
          stars: r.stargazers_count,
          language: r.language || 'Unknown',
          url: r.html_url,
          topics: r.topics || [],
        })
      }
    } catch { /* rate limit or network */ }
  }

  const sorted = results.sort((a, b) => b.stars - a.stars).slice(0, 40)
  setCachedRepos(sorted)
  return sorted
}

// ── Jobs (static + enrichable) ───────────────────────────────────────────────
export function getStaticJobs(): JobItem[] {
  return [
    { title: 'Salesforce Functional Consultant', company: 'NBS Consulting', location: 'Casablanca, Maroc', salary: '10K–20K MAD/mois', url: 'https://rekrute.com', platform: 'Rekrute', role_type: 'consultant' },
    { title: 'Salesforce Administrator', company: 'Inetum Maroc', location: 'Casablanca, Maroc', salary: '8K–15K MAD/mois', url: 'https://rekrute.com', platform: 'Rekrute', role_type: 'admin' },
    { title: 'Consultant Salesforce Sales Cloud', company: 'Devoteam', location: 'Paris, France', salary: '€50K–70K/an', url: 'https://www.devoteam.com/join-us', platform: 'Direct', role_type: 'consultant' },
    { title: 'Agentforce AI Specialist', company: 'Accenture', location: 'Remote / Paris', salary: '€70K–100K/an', url: 'https://linkedin.com/jobs', platform: 'LinkedIn', role_type: 'agentforce' },
    { title: 'Salesforce Technical Developer', company: 'Sopra Steria', location: 'Lyon, France', salary: '€45K–65K/an', url: 'https://malt.fr', platform: 'Malt', role_type: 'technical' },
    { title: 'Salesforce Solution Architect', company: 'Capgemini', location: 'Amsterdam, Netherlands', salary: '€90K–120K/an', url: 'https://linkedin.com/jobs', platform: 'LinkedIn', role_type: 'architect' },
    { title: 'RevOps Salesforce Specialist', company: 'Freelance', location: 'Remote', salary: '€400–600/j', url: 'https://malt.fr', platform: 'Malt', role_type: 'revops' },
    { title: 'HubSpot + Salesforce Consultant', company: 'Digital Agency', location: 'Bruxelles, Belgique', salary: '€50K–70K/an', url: 'https://linkedin.com/jobs', platform: 'LinkedIn', role_type: 'consultant' },
    { title: 'Salesforce Data Cloud Consultant', company: 'Deloitte Digital', location: 'Paris, France', salary: '€60K–85K/an', url: 'https://linkedin.com/jobs', platform: 'LinkedIn', role_type: 'agentforce' },
    { title: 'CRM Functional Analyst', company: 'BNP Paribas', location: 'Paris, France', salary: '€45K–60K/an', url: 'https://linkedin.com/jobs', platform: 'LinkedIn', role_type: 'consultant' },
  ]
}

// ── Master sync ───────────────────────────────────────────────────────────────
export async function syncAll(
  newsApiKey: string,
  githubToken: string,
  onStatus: (msg: string) => void
) {
  const result = { news: [] as NewsItem[], repos: [] as GitHubRepo[], jobs: getStaticJobs() }

  onStatus('📡 Récupération Salesforce Blog...')
  try {
    const news = await fetchNews(newsApiKey)
    result.news = news
    onStatus(`✓ ${news.length} articles récupérés`)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'erreur inconnue'
    onStatus(`⚠ Actualités : ${message}`)
  }

  onStatus('🐙 GitHub repos Salesforce...')
  try {
    const repos = await fetchRepos(githubToken || undefined)
    result.repos = repos
    onStatus(`✓ ${repos.length} repos trouvés`)
  } catch {
    onStatus('⚠ GitHub : limite atteinte (ajoute un token)')
  }

  setCachedJobs(result.jobs)
  setLastSync()
  onStatus('✅ Synchronisation terminée !')
  return result
}
