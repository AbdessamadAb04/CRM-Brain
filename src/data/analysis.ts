// ─────────────────────────────────────────────────────────────────────────────
// Analyse — datasets filtrables (CRM Brain)
// Modèle front : marchés, vendors, rôles, salaires, adoption, skills, sources.
// Conçu pour être consommé via les sélecteurs de src/hooks/useAnalysis.ts
// ─────────────────────────────────────────────────────────────────────────────

export interface CrmMeta {
  id: string
  name: string
  short: string
  color: string
  base2020: number
  cagr: number
  aiReadiness: number
  jobsIndex: number
  partnerDensity: number
  salaryPremium: number
  certMaturity: number
  aiOffering: string
  strength: string
  selectable: boolean
}

// Résiduel « Autres » : tous les autres acteurs du marché (sélectionnable en dernier)
export const OTHER_CRM: CrmMeta = {
  id: 'other', name: 'Autres', short: 'Autres', color: '#334155',
  base2020: 0, cagr: 0, aiReadiness: 40, jobsIndex: 45, partnerDensity: 30,
  salaryPremium: 0.9, certMaturity: 30, aiOffering: 'Variable', strength: 'Divers',
  selectable: true,
}

// Écosystèmes CRM sélectionnables
export const CRM_LIST: CrmMeta[] = [
  { id: 'salesforce', name: 'Salesforce', short: 'Salesforce', color: '#00a3e0', base2020: 11.5, cagr: 0.170, aiReadiness: 95, jobsIndex: 100, partnerDensity: 100, salaryPremium: 1.00, certMaturity: 95, aiOffering: 'Agentforce', strength: 'Sales · Service · Platform', selectable: true },
  { id: 'hubspot', name: 'HubSpot', short: 'HubSpot', color: '#f59e0b', base2020: 1.8, cagr: 0.250, aiReadiness: 80, jobsIndex: 72, partnerDensity: 60, salaryPremium: 0.85, certMaturity: 70, aiOffering: 'Breeze AI', strength: 'Marketing · Sales (SMB)', selectable: true },
  { id: 'microsoft', name: 'Microsoft Dynamics 365', short: 'Dynamics', color: '#8b5cf6', base2020: 2.6, cagr: 0.115, aiReadiness: 90, jobsIndex: 78, partnerDensity: 85, salaryPremium: 0.95, certMaturity: 80, aiOffering: 'Copilot', strength: 'Enterprise · Integration', selectable: true },
  { id: 'sap', name: 'SAP', short: 'SAP', color: '#10b981', base2020: 3.0, cagr: 0.070, aiReadiness: 78, jobsIndex: 66, partnerDensity: 80, salaryPremium: 1.05, certMaturity: 85, aiOffering: 'Joule', strength: 'ERP · Enterprise', selectable: true },
  { id: 'oracle', name: 'Oracle', short: 'Oracle', color: '#ef4444', base2020: 3.7, cagr: 0.060, aiReadiness: 72, jobsIndex: 58, partnerDensity: 70, salaryPremium: 1.15, certMaturity: 75, aiOffering: 'Oracle AI Agents', strength: 'Enterprise · CPQ', selectable: true },
  { id: 'zoho', name: 'Zoho', short: 'Zoho', color: '#06b6d4', base2020: 0.75, cagr: 0.220, aiReadiness: 70, jobsIndex: 54, partnerDensity: 45, salaryPremium: 0.70, certMaturity: 55, aiOffering: 'Zia', strength: 'SMB · Suite', selectable: true },
  { id: 'servicenow', name: 'ServiceNow', short: 'ServiceNow', color: '#14b8a6', base2020: 0.85, cagr: 0.180, aiReadiness: 85, jobsIndex: 70, partnerDensity: 65, salaryPremium: 1.10, certMaturity: 72, aiOffering: 'Now Assist', strength: 'Service · Workflow', selectable: true },
]

export const CRM_META: Record<string, CrmMeta> = {
  ...Object.fromEntries(CRM_LIST.map(c => [c.id, c])),
  other: OTHER_CRM,
}

// Liste proposée à l'utilisateur dans le filtre : écosystèmes + « Autres » en dernier
export const CRM_SELECTABLE: CrmMeta[] = [...CRM_LIST, OTHER_CRM]

export const crmById = (id: string): CrmMeta => CRM_META[id] || OTHER_CRM

// Taille du marché CRM mondial ($B)
export const MARKET_SIZE: { year: number; value: number }[] = [
  { year: 2020, value: 50.4 }, { year: 2021, value: 58.2 }, { year: 2022, value: 66.1 },
  { year: 2023, value: 74.9 }, { year: 2024, value: 87.5 }, { year: 2025, value: 105.0 },
  { year: 2026, value: 126.0 }, { year: 2027, value: 141.5 }, { year: 2028, value: 158.0 },
  { year: 2029, value: 176.5 }, { year: 2030, value: 197.0 }, { year: 2031, value: 220.0 },
  { year: 2032, value: 245.0 }, { year: 2033, value: 273.0 }, { year: 2034, value: 304.0 },
]

export const YEARS = MARKET_SIZE.map(m => m.year)

export const marketTotal = (year: number): number =>
  MARKET_SIZE.find(m => m.year === year)?.value ?? MARKET_SIZE[MARKET_SIZE.length - 1].value

// Revenu d'un vendor pour une année (composé depuis 2020)
export const crmRevenue = (id: string, year: number): number => {
  const c = CRM_META[id]
  if (!c) return 0
  return c.base2020 * Math.pow(1 + c.cagr, year - 2020)
}

export const namedTotal = (year: number): number =>
  CRM_LIST.reduce((s, c) => s + crmRevenue(c.id, year), 0)

export const residualRevenue = (year: number): number =>
  Math.max(0, marketTotal(year) - namedTotal(year))

export const revenueOf = (id: string, year: number): number =>
  id === 'other' ? residualRevenue(year) : crmRevenue(id, year)

// Part de marché (%)
export const shareOf = (id: string, year: number): number => {
  const total = marketTotal(year)
  return total > 0 ? (revenueOf(id, year) / total) * 100 : 0
}

// Variations de part vs N-1 (points)
export const shareDelta = (id: string, year: number): number => {
  if (year <= 2020) return 0
  return shareOf(id, year) - shareOf(id, year - 1)
}

// ── Filtres : régions / segments ───────────────────────────────────────────────
export interface Option { id: string; label: string; weight?: number }

export const REGIONS: Option[] = [
  { id: 'global', label: 'Global', weight: 1 },
  { id: 'na', label: 'North America', weight: 0.44 },
  { id: 'eu', label: 'Europe', weight: 0.29 },
  { id: 'apac', label: 'APAC', weight: 0.17 },
  { id: 'mena', label: 'MENA', weight: 0.06 },
  { id: 'africa', label: 'Afrique', weight: 0.04 },
]

export const SEGMENTS: Option[] = [
  { id: 'enterprise', label: 'Enterprise', weight: 0.50 },
  { id: 'midmarket', label: 'Mid-market', weight: 0.35 },
  { id: 'smb', label: 'SMB', weight: 0.15 },
]

// Modules fonctionnels CRM (catégories de produits)
export const MODULES: Option[] = [
  { id: 'sales', label: 'Sales (Sales Cloud)', weight: 0.32 },
  { id: 'service', label: 'Service / Customer Support', weight: 0.27 },
  { id: 'marketing', label: 'Marketing', weight: 0.15 },
  { id: 'commerce', label: 'Commerce / E-commerce', weight: 0.09 },
  { id: 'analytics', label: 'Analytics / Data', weight: 0.07 },
  { id: 'ai', label: 'AI / Agents', weight: 0.10 },
]

// Facteur de marché selon régions sélectionnées
export const regionFactor = (regions: string[]): number => {
  if (!regions.length || regions.includes('global')) return 1
  return REGIONS.filter(r => r.id !== 'global' && regions.includes(r.id))
    .reduce((s, r) => s + (r.weight || 0), 0)
}

export const segmentFactor = (segments: string[]): number => {
  if (!segments.length) return 1
  const w = SEGMENTS.filter(s => segments.includes(s.id)).reduce((a, s) => a + (s.weight || 0), 0)
  return w
}

// Facteur de marché selon les modules fonctionnels sélectionnés
export const moduleFactor = (modules: string[]): number => {
  if (!modules.length) return 1
  const w = MODULES.filter(m => modules.includes(m.id)).reduce((a, m) => a + (m.weight || 0), 0)
  return w
}

// ── Périodes ──────────────────────────────────────────────────────────────────
export interface PeriodPreset { id: string; label: string; from: number; to: number }

export const PERIODS: PeriodPreset[] = [
  { id: 'ytd', label: 'YTD', from: 2025, to: 2026 },
  { id: 'last4q', label: '4 dernières années', from: 2022, to: 2026 },
  { id: '2020-2026', label: '2020–2026', from: 2020, to: 2026 },
  { id: '2024-2030', label: '2024–2030e', from: 2024, to: 2030 },
  { id: 'full', label: '2020–2034e', from: 2020, to: 2034 },
]

export const GRAINS: Option[] = [
  { id: 'year', label: 'Année' },
  { id: 'quarter', label: 'Trimestre' },
  { id: 'month', label: 'Mois' },
]

// ── État des filtres ─────────────────────────────────────────────────────────
export interface AnalysisFilters {
  period: string
  from: number
  to: number
  grain: string
  crms: string[]
  regions: string[]
  segments: string[]
  modules: string[]
  careerFocus: string[]
  seniority: string
  currency: CurrencyId
}

export const DEFAULT_FILTERS: AnalysisFilters = {
  period: '2020-2026',
  from: 2020,
  to: 2026,
  grain: 'year',
  crms: ['salesforce'],
  regions: ['global'],
  segments: ['enterprise', 'midmarket', 'smb'],
  modules: MODULES.map(m => m.id),
  careerFocus: [],
  seniority: 'mid',
  currency: 'USD',
}

export const activeFilterCount = (f: AnalysisFilters): number => {
  let n = 0
  if (f.crms.length) n++
  if (f.regions.length && !f.regions.includes('global')) n++
  if (f.segments.length && f.segments.length < SEGMENTS.length) n++
  if (f.modules.length && f.modules.length < MODULES.length) n++
  if (f.careerFocus.length) n++
  if (f.period !== DEFAULT_FILTERS.period) n++
  return n
}

// ── Rôles carrière ─────────────────────────────────────────────────────────────
export const SKILLS = [
  { id: 'config', label: 'Configuration' },
  { id: 'apex', label: 'Apex / Dev' },
  { id: 'lwc', label: 'LWC / UI' },
  { id: 'flow', label: 'Flow / Autom.' },
  { id: 'integration', label: 'Intégration' },
  { id: 'data', label: 'Data Cloud' },
  { id: 'agentforce', label: 'Agentforce / AI' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'cpq', label: 'CPQ / RevOps' },
]

export interface AnalysisRole {
  id: string
  name: string
  short: string
  color: string
  baseSalary: number   // médiane USD (mid, global)
  demand: number       // index 0-100
  supply: number       // index 0-100 (talent certifié dispo)
  skills: Record<string, number> // 1–5
  certs: string[]
}

export const ANALYSIS_ROLES: AnalysisRole[] = [
  { id: 'admin', name: 'Administrator', short: 'Admin', color: '#64748b', baseSalary: 85, demand: 72, supply: 90, certs: ['ADM-201'],
    skills: { config: 5, apex: 1, lwc: 1, flow: 4, integration: 2, data: 2, agentforce: 2, marketing: 2, cpq: 1 } },
  { id: 'consultant', name: 'Functional Consultant', short: 'Consult.', color: '#10b981', baseSalary: 118, demand: 90, supply: 55, certs: ['ADM-201', 'CRT-251'],
    skills: { config: 4, apex: 1, lwc: 1, flow: 4, integration: 3, data: 3, agentforce: 3, marketing: 3, cpq: 3 } },
  { id: 'technical', name: 'Technical Consultant / Dev', short: 'Tech', color: '#f59e0b', baseSalary: 135, demand: 82, supply: 45, certs: ['CRT-403', 'PDI'],
    skills: { config: 3, apex: 5, lwc: 5, flow: 3, integration: 5, data: 3, agentforce: 3, marketing: 1, cpq: 2 } },
  { id: 'architect', name: 'Solution Architect', short: 'Architect', color: '#a78bfa', baseSalary: 185, demand: 85, supply: 20, certs: ['5+ certs', 'CTA'],
    skills: { config: 4, apex: 3, lwc: 2, flow: 4, integration: 5, data: 5, agentforce: 4, marketing: 3, cpq: 3 } },
  { id: 'agentforce', name: 'AI Specialist / Agentforce', short: 'Agentforce', color: '#8b5cf6', baseSalary: 150, demand: 98, supply: 6, certs: ['ADM-201', 'AI Specialist'],
    skills: { config: 3, apex: 3, lwc: 2, flow: 4, integration: 4, data: 5, agentforce: 5, marketing: 2, cpq: 2 } },
  { id: 'revops', name: 'RevOps Specialist', short: 'RevOps', color: '#ef4444', baseSalary: 100, demand: 74, supply: 40, certs: ['ADM-201', 'CRT-251'],
    skills: { config: 4, apex: 1, lwc: 1, flow: 4, integration: 3, data: 4, agentforce: 3, marketing: 4, cpq: 4 } },
  { id: 'analyst', name: 'Business Analyst CRM', short: 'Analyst', color: '#38bdf8', baseSalary: 95, demand: 70, supply: 60, certs: ['ADM-201', 'BA Basics'],
    skills: { config: 4, apex: 1, lwc: 1, flow: 4, integration: 2, data: 3, agentforce: 2, marketing: 3, cpq: 2 } },
]

export const roleById = (id: string) => ANALYSIS_ROLES.find(r => r.id === id)

// ── Salaires : facteurs ────────────────────────────────────────────────────────
export const SENIORITY: Option[] = [
  { id: 'junior', label: 'Junior', weight: 0.65 },
  { id: 'mid', label: 'Mid', weight: 1.00 },
  { id: 'senior', label: 'Senior', weight: 1.30 },
  { id: 'lead', label: 'Lead', weight: 1.55 },
]

export const REGION_SALARY_FACTOR: Record<string, number> = {
  global: 1.00, na: 1.20, eu: 0.85, apac: 0.70, mena: 0.35, africa: 0.30,
}

export const CURRENCIES = [
  { id: 'USD', label: 'USD ($)', rate: 1 },
  { id: 'EUR', label: 'EUR (€)', rate: 0.92 },
  { id: 'MAD', label: 'MAD', rate: 9.9 },
] as const

export type CurrencyId = typeof CURRENCIES[number]['id']

export const regionSalaryFactor = (regions: string[]): number => {
  if (!regions.length || regions.includes('global')) return 1
  const ids = regions.filter(r => r !== 'global')
  return ids.reduce((s, r) => s + (REGION_SALARY_FACTOR[r] ?? 1), 0) / ids.length
}

export const crmSalaryFactor = (crms: string[]): number => {
  if (!crms.length) return 1
  return crms.reduce((s, id) => s + (CRM_META[id]?.salaryPremium ?? 1), 0) / crms.length
}

// Salaire médian estimé (USD/an) pour un rôle, selon filtres
export const salaryMedian = (
  roleId: string, crms: string[], regions: string[], seniority: string,
): number => {
  const role = roleById(roleId)
  if (!role) return 0
  const sen = SENIORITY.find(s => s.id === seniority)?.weight ?? 1
  return Math.round(role.baseSalary * crmSalaryFactor(crms) * regionSalaryFactor(regions) * sen)
}

// ── Demande vs offre (tension) ─────────────────────────────────────────────────
export const gapScore = (roleId: string): number => {
  const r = roleById(roleId)
  if (!r) return 0
  return Math.max(0, r.demand - r.supply)
}

// ── Adoption & signaux AI ───────────────────────────────────────────────────────
export const ENTERPRISE_ADOPTION = 91
export const CRM_ROI = 8.71
export const CONSULTING_BACKLOG = 88

export const AI_ADOPTION: { crm: string; notStarted: number; pilot: number; production: number; scaled: number }[] = [
  { crm: 'salesforce', notStarted: 22, pilot: 34, production: 30, scaled: 14 },
  { crm: 'hubspot', notStarted: 34, pilot: 33, production: 24, scaled: 9 },
  { crm: 'microsoft', notStarted: 28, pilot: 32, production: 29, scaled: 11 },
  { crm: 'sap', notStarted: 40, pilot: 30, production: 21, scaled: 9 },
  { crm: 'oracle', notStarted: 44, pilot: 29, production: 20, scaled: 7 },
  { crm: 'zoho', notStarted: 52, pilot: 28, production: 15, scaled: 5 },
  { crm: 'servicenow', notStarted: 30, pilot: 31, production: 27, scaled: 12 },
]

// ── Career path explorer ────────────────────────────────────────────────────────
export const CAREER_PATH = [
  { label: 'Admin', salary: 85, months: 0, certs: ['ADM-201'] },
  { label: 'Consultant', salary: 118, months: 18, certs: ['CRT-251'] },
  { label: 'Senior Consultant', salary: 150, months: 42, certs: ['Service Cloud'] },
  { label: 'Architect', salary: 185, months: 66, certs: ['App Builder', '5+ certs'] },
  { label: 'AI / Platform Lead', salary: 210, months: 90, certs: ['AI Specialist', 'CTA'] },
]

// ── Catalyseurs (timeline) ──────────────────────────────────────────────────────
export const CATALYSTS = [
  { year: 2019, label: 'Einstein AI généralisé' },
  { year: 2021, label: 'Slack racheté par Salesforce' },
  { year: 2023, label: 'Einstein GPT / Copilot' },
  { year: 2024, label: 'Lancement Agentforce' },
  { year: 2025, label: 'Agentforce 2.0 · Data Cloud' },
  { year: 2026, label: 'Pénurie AI Specialists <10K' },
]

// ── Méthodologie / sources ──────────────────────────────────────────────────────
export interface Source { name: string; confidence: 'High' | 'Medium' | 'Low' }

export const SOURCES: Source[] = [
  { name: 'IDC — CRM market share', confidence: 'High' },
  { name: 'Gartner — CRM forecast', confidence: 'High' },
  { name: 'Fortune Business Insights', confidence: 'Medium' },
  { name: 'Salesforce Investor Relations', confidence: 'High' },
  { name: 'ZipRecruiter / Indeed', confidence: 'Medium' },
  { name: 'Estimations internes (CAGR, projections)', confidence: 'Low' },
]

export const CONFIDENCE_COLOR: Record<string, string> = {
  High: '#10b981', Medium: '#f59e0b', Low: '#ef4444',
}
