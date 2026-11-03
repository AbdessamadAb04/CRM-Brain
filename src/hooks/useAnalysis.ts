import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import {
  CRM_META, crmById,
  revenueOf, shareOf, MARKET_SIZE,
  regionFactor, segmentFactor, moduleFactor,
  ANALYSIS_ROLES, roleById, salaryMedian, gapScore,
  AI_ADOPTION, SENIORITY, CURRENCIES,
  OTHER_CRM,
} from '../data/analysis'
import type { AnalysisFilters, CurrencyId } from '../data/analysis'

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  note: string
  color: string
  badge: 'Observé' | 'Estimé' | 'Projeté'
  trend: 1 | 0 | -1
}

export interface SeriesPoint { label: string; total: number; [key: string]: number | string }

export interface VendorRow {
  id: string; name: string; color: string
  revenue: number; share: number; cagr: number
  aiReadiness: number; jobsIndex: number; certMaturity: number
  strength: string; score: number
}

export interface Mover { id: string; name: string; color: string; delta: number; share: number }

export interface SalaryRow {
  id: string; name: string; short: string; color: string
  min: number; median: number; p75: number; max: number
  demand: number; supply: number; gap: number
}

export const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const currRate = (c: CurrencyId) => CURRENCIES.find(x => x.id === c)?.rate ?? 1

export const fmtMoney = (usdK: number, currency: CurrencyId): string => {
  const v = usdK * currRate(currency)
  const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : ''
  if (currency === 'MAD') {
    return v >= 1000 ? `${(v / 1000).toFixed(2)}M MAD` : `${Math.round(v)}K MAD`
  }
  return `${sym}${v >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${Math.round(v)}K`}`
}

export const fmtB = (v: number) => `$${v.toFixed(1)}B`
export const pct = (v: number, d = 1) => `${v >= 0 ? '+' : ''}${v.toFixed(d)}%`

export interface AnnualPoint { year: number; total: number; [key: string]: number }

// Interpole une série annuelle en points trimestriels ou mensuels (croissance lissée).
export function resampleSeries(annual: AnnualPoint[], grain: string, keys: string[]): SeriesPoint[] {
  if (grain === 'year' || annual.length === 0) {
    return annual.map(p => {
      const out: SeriesPoint = { label: String(p.year), total: p.total }
      for (const k of keys) out[k] = p[k]
      return out
    })
  }
  const per = grain === 'quarter' ? 4 : 12
  const out: SeriesPoint[] = []
  for (let i = 0; i < annual.length; i++) {
    const cur = annual[i]
    const prev = annual[i - 1]
    const next = annual[i + 1]
    for (let k = 0; k < per; k++) {
      const t = k / per
      const point: SeriesPoint = {
        label: grain === 'quarter' ? `${cur.year} Q${k + 1}` : `${MONTHS_FR[k]} ${String(cur.year).slice(2)}`,
        total: 0,
      }
      for (const key of keys) {
        const a = cur[key]
        const b = next ? next[key] : cur[key] * (prev && prev[key] ? cur[key] / prev[key] : 1.1)
        point[key] = +(a + (b - a) * t).toFixed(2)
      }
      out.push(point)
    }
  }
  return out
}

export function useAnalysis() {
  const filters = useStore(s => s.filters)
  return useMemo(() => buildAnalysis(filters), [filters])
}

export function buildAnalysis(f: AnalysisFilters) {
  const selected = f.crms.length ? f.crms : ['salesforce'] // sélection complète (peut inclure « Autres »)
  const named = selected.filter(id => id !== OTHER_CRM.id) // écosystèmes nommés
  const crms = named.length ? named : ['salesforce'] // widgets hors « Autres » (repli si « Autres » seul)
  const mFactor = regionFactor(f.regions) * segmentFactor(f.segments) * moduleFactor(f.modules)

  // Série annuelle brute — « total » = somme des écosystèmes sélectionnés (nommés)
  const years = MARKET_SIZE.map(m => m.year).filter(y => y >= f.from && y <= f.to)
  const annual: AnnualPoint[] = years.map(y => {
    const point: AnnualPoint = { year: y, total: 0 }
    for (const id of crms) point[id] = +revenueOf(id, y).toFixed(2)
    point.total = +crms.reduce((s, id) => s + revenueOf(id, y), 0).toFixed(2)
    return point
  })
  const series = resampleSeries(annual, f.grain, ['total', ...crms])

  const yTo = f.to
  const yFrom = f.from
  // Taille = somme des revenus de la sélection COMPLÈTE (écosystèmes + « Autres »), proportionnelle au marché
  const ecoTotal = (year: number) => selected.reduce((s, id) => s + revenueOf(id, year), 0) * mFactor
  const sizeNow = ecoTotal(yTo)
  const sizePrev = ecoTotal(yTo - 1)
  const sizeDeltaPct = sizePrev > 0 ? ((sizeNow - sizePrev) / sizePrev) * 100 : 0
  const cagr = yFrom < yTo && sizeNow > 0
    ? (Math.pow(sizeNow / ecoTotal(yFrom), 1 / (yTo - yFrom)) - 1) * 100
    : 0

  // Donut : sélection + résiduel "Autres"
  const vshare = crms.map(id => ({
    id, name: crmById(id).short, color: crmById(id).color,
    value: +shareOf(id, yTo).toFixed(1),
  }))
  const selectedShare = vshare.reduce((s, v) => s + v.value, 0)
  const otherShare = Math.max(0, +(100 - selectedShare).toFixed(1))
  const donut = [...vshare, { id: OTHER_CRM.id, name: OTHER_CRM.name, color: OTHER_CRM.color, value: otherShare }]

  // Top movers : variation de part sur la période
  const movers: Mover[] = crms.map(id => ({
    id, name: crmById(id).short, color: crmById(id).color,
    delta: +(shareOf(id, yTo) - shareOf(id, yFrom)).toFixed(2),
    share: +shareOf(id, yTo).toFixed(1),
  })).sort((a, b) => b.delta - a.delta)

  // Leader (parmi sélection)
  const leader = movers.length ? movers.reduce((a, b) => (a.share >= b.share ? a : b)) : null
  const leaderDelta = leader ? movers.find(m => m.id === leader.id)?.delta ?? 0 : 0

  // Rôles (transverses) filtrés par focus carrière
  const focusIds = f.careerFocus.length ? f.careerFocus : ANALYSIS_ROLES.map(r => r.id)
  const salaries: SalaryRow[] = focusIds.map(id => {
    const r = roleById(id)
    if (!r) return null
    const med = salaryMedian(id, crms, f.regions, f.seniority)
    return {
      id, name: r.name, short: r.short, color: r.color,
      min: Math.round(med * 0.8), median: med,
      p75: Math.round(med * 1.15), max: Math.round(med * 1.35),
      demand: r.demand, supply: r.supply, gap: gapScore(id),
    }
  }).filter((x): x is SalaryRow => x !== null)

  const topGap = [...salaries].sort((a, b) => b.gap - a.gap)[0]

  // KPI strip (8)
  const seniorityLabel = SENIORITY.find(s => s.id === f.seniority)?.label ?? 'Mid'
  const medianFocus = salaries.length
    ? Math.round(salaries.reduce((s, r) => s + r.median, 0) / salaries.length)
    : 0
  const aiAdopt = AI_ADOPTION.filter(a => crms.includes(a.crm))
  const aiAvg = aiAdopt.length
    ? Math.round(aiAdopt.reduce((s, a) => s + a.production + a.scaled, 0) / aiAdopt.length)
    : 0
  // Emplois : proportionnels à la trajectoire des écosystèmes sélectionnés (ancrés sur 2026)
  const JOBS_REF_YEAR = 2026
  const jobsIndexSum = crms.reduce((s, id) => s + (CRM_META[id]?.jobsIndex ?? 0), 0)
  const revSum = (year: number) => crms.reduce((s, id) => s + revenueOf(id, year), 0)
  const jobsAt = (year: number) => (jobsIndexSum / 100 * 9.3) * (revSum(year) / revSum(JOBS_REF_YEAR)) * mFactor
  const jobsM = jobsAt(yTo)
  const jobsDeltaPct = yFrom < yTo && revSum(yFrom) > 0 ? ((jobsAt(yTo) - jobsAt(yFrom)) / jobsAt(yFrom)) * 100 : 0

  const kpis: Kpi[] = [
    { id: 'size', label: 'Taille marché CRM', value: fmtB(sizeNow), delta: pct(sizeDeltaPct), note: 'USD · écosystèmes sélectionnés', color: '#00a3e0', badge: 'Observé', trend: sizeDeltaPct >= 0 ? 1 : -1 },
    { id: 'leader', label: `Revenu ${leader?.name ?? 'leader'}`, value: leader ? fmtB(revenueOf(leader.id, yTo)) : '—', delta: leader ? pct(crmById(leader.id).cagr * 100) : '', note: 'USD · CAGR composé', color: leader?.color ?? '#00a3e0', badge: 'Estimé', trend: 1 },
    { id: 'share', label: 'Part du leader', value: leader ? `${leader.share}%` : '—', delta: leader ? `${leaderDelta >= 0 ? '+' : ''}${leaderDelta} pts` : '', note: `vs ${yFrom}`, color: leader?.color ?? '#00a3e0', badge: 'Observé', trend: leaderDelta >= 0 ? 1 : -1 },
    { id: 'jobs', label: 'Emplois écosystème', value: `${jobsM.toFixed(1)}M`, delta: pct(jobsDeltaPct), note: `proj. ${yTo} · sélection`, color: '#10b981', badge: 'Projeté', trend: jobsDeltaPct >= 0 ? 1 : -1 },
    { id: 'salary', label: 'Salaire médian (focus)', value: fmtMoney(medianFocus, f.currency), delta: '+6%', note: seniorityLabel, color: '#f59e0b', badge: 'Estimé', trend: 1 },
    { id: 'ai', label: 'Adoption AI', value: `${aiAvg}%`, delta: 'prod + scaled', note: 'Selon CRM', color: '#8b5cf6', badge: 'Observé', trend: 1 },
    { id: 'gap', label: 'Gap skills (critique)', value: topGap ? `${topGap.short} ${topGap.gap}` : '—', delta: 'demande vs offre', note: topGap ? `offre ${topGap.supply}/100` : '', color: '#ef4444', badge: 'Estimé', trend: 0 },
    { id: 'sources', label: 'Sources croisées', value: '5', delta: 'High confidence ×3', note: 'IDC · Gartner · SF IR', color: '#38bdf8', badge: 'Observé', trend: 0 },
  ]

  // Matrice vendors
  const matrix: VendorRow[] = crms.map(id => {
    const c = crmById(id)
    const share = shareOf(id, yTo)
    const score = Math.round(
      Math.min(100, share * 4) * 0.3 +
      Math.min(100, (c.cagr / 0.27) * 100) * 0.2 +
      c.aiReadiness * 0.2 +
      c.jobsIndex * 0.2 +
      c.certMaturity * 0.1,
    )
    return {
      id, name: c.name, color: c.color,
      revenue: revenueOf(id, yTo), share: +share.toFixed(1), cagr: c.cagr * 100,
      aiReadiness: c.aiReadiness, jobsIndex: c.jobsIndex, certMaturity: c.certMaturity,
      strength: c.strength, score,
    }
  }).sort((a, b) => b.score - a.score)

  // Radar vendors (max 4 séries)
  const radarCrms = crms.slice(0, 4)
  const norm = (v: number, lo: number, hi: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100))
  const radar = [
    { subject: 'Part marché', key: 'share' },
    { subject: 'Croissance', key: 'growth' },
    { subject: 'Emplois', key: 'jobs' },
    { subject: 'AI readiness', key: 'ai' },
    { subject: 'Partenaires', key: 'partners' },
    { subject: 'Salaire premium', key: 'salary' },
  ].map(row => {
    const point: { subject: string; [crm: string]: number | string } = { subject: row.subject }
    for (const id of radarCrms) {
      const c = crmById(id)
      const v = row.key === 'share' ? norm(shareOf(id, yTo), 0, 30)
        : row.key === 'growth' ? norm(c.cagr, 0.05, 0.28)
        : row.key === 'jobs' ? c.jobsIndex
        : row.key === 'ai' ? c.aiReadiness
        : row.key === 'partners' ? c.partnerDensity
        : norm(c.salaryPremium, 0.6, 1.2)
      point[id] = Math.round(v)
    }
    return point
  })

  // Adoption AI par écosystème sélectionné
  const rows = aiAdopt.length ? aiAdopt : AI_ADOPTION.slice(0, 1)
  const adoptionBars = rows.map(r => ({
    name: crmById(r.crm).short,
    color: crmById(r.crm).color,
    notStarted: r.notStarted, pilot: r.pilot, production: r.production, scaled: r.scaled,
  }))

  const kpiMap = new Map(kpis.map(k => [k.id, k] as const))
  const kpi = (id: string) => kpiMap.get(id)

  return {
    filters: f, crms, mFactor, years, series, sizeNow, sizePrev, sizeDeltaPct, cagr,
    donut, movers, leader, salaries, topGap, jobsAt,
    kpis, kpiMap, kpi,
    matrix, radarCrms, radar, adoptionBars, aiAvg,
    fallbackCrm: !f.crms.length,
  }
}
