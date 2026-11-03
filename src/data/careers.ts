import type { SFRole } from '../types'
import { SF_ROLES } from './index'

export interface CareerMeta {
  id: string
  name: string
  icon: string
  color: string
}

export const CAREERS: CareerMeta[] = [
  { id: 'salesforce', name: 'Salesforce', icon: '◈', color: '#00a3e0' },
  { id: 'hubspot', name: 'HubSpot', icon: '◐', color: '#f59e0b' },
  { id: 'oracle', name: 'Oracle', icon: '◑', color: '#ef4444' },
]

export const careerById = (id: string | undefined): CareerMeta =>
  CAREERS.find(c => c.id === id) || CAREERS[0]

// ── HubSpot roles ─────────────────────────────────────────────────────────────
const HUBSPOT_ROLES: SFRole[] = [
  {
    id: 'hs_admin', name: 'HubSpot Administrator', level: 'Débutant → Mid',
    icon: '🎯', color: '#f59e0b', demand: 78, demandLabel: 'Très forte',
    desc: 'Configure et maintient le portal HubSpot : CRM, objets custom, workflows, reporting. Le market a explosé chez les PME/startups qui adoptent HubSpot comme CRM principal.',
    salaryUS: '$75K–$105K', salaryFR: '€45K–65K', salaryCH: 'CHF 75K–105K',
    salaryDE: '€50K–72K', salaryMaroc: '7K–18K MAD/mois',
    freelanceUS: '$45–80/h', freelanceEU: '€280–500/j', freelanceMarket: 'Bonne',
    certs: ['HubSpot Sales Software'],
    certsOptional: ['HubSpot Marketing Software', 'HubSpot Service Hub'],
    skills: ['HubSpot CRM', 'Workflows', 'Custom Objects', 'Lead Management', 'Reporting', 'Data Hygiene'],
    experience: '0–2 ans. Compte éducation gratuit + academy.hubspot.com pour débuter.',
    aiRisk: 'Élevé — les templates et assistants IA couvrent la config basique. Évoluer vers RevOps.',
    growth: 'Écosystème en forte croissance dans les PME. Nombreuses agences partenaires qui recrutent des juniors certifiés.',
    trails: [
      { name: 'HubSpot CRM Implementation', type: 'Trail', note: 'Semaine 1–2 — fondations du portal', url: 'https://academy.hubspot.com' },
      { name: 'Sales Hub Basics', type: 'Module', note: 'Pipeline, deals, activités', phoneOnly: true },
      { name: 'Contact & Company Management', type: 'Module', note: 'Propriétés, associations, taxonomie' },
      { name: 'Deal & Pipeline Management', type: 'Module', note: 'Stages, reporting des prévisions', phoneOnly: true },
      { name: 'Workflows Automation', type: 'Module', note: '⭐ Cœur du rôle admin HubSpot' },
      { name: 'Custom Objects', type: 'Module', note: 'Extension du modèle de données' },
      { name: 'Data Quality Management', type: 'Module', note: 'Dédup, nettoyage, propriétés calculées', phoneOnly: true },
      { name: 'Reporting & Dashboards', type: 'Module', note: 'KPIs commerciaux' },
      { name: 'Operations Specialist Skill Badge', type: 'Superbadge ★', note: '🏆 Badge le plus regardé par les recruteurs' },
    ],
  },
  {
    id: 'hs_ops', name: 'HubSpot RevOps Specialist', level: 'Mid → Senior',
    icon: '📈', color: '#ef4444', demand: 82, demandLabel: 'Forte et croissante',
    desc: 'Aligne sales, marketing et service autour du portal HubSpot. Architecture les processus revenue et la data sur toute la chaîne commerciale des PME.',
    salaryUS: '$85K–$125K', salaryFR: '€50K–80K', salaryCH: 'CHF 88K–125K',
    salaryDE: '€55K–85K', salaryMaroc: '12K–22K MAD/mois',
    freelanceUS: '$60–110/h', freelanceEU: '€400–650/j', freelanceMarket: 'Bonne',
    certs: ['HubSpot Revenue Operations'],
    certsOptional: ['HubSpot Sales Pro', 'HubSpot Marketing Pro'],
    skills: ['Revenue Process Design', 'Forecasting', 'Marketing Attribution', 'Pipeline Analytics', 'Data Governance'],
    experience: '2+ ans avec exposition sales ET marketing. Le rôle le plus valorisé de l\'écosystème HubSpot.',
    aiRisk: 'Faible — l\'alignement organisationnel et la stratégie revenue restent humains.',
    growth: 'HubSpot pousse fort son modèle RevOps. Profil hybride business + technique très demandé.',
    trails: [
      { name: 'Sales Hub Pro', type: 'Module', note: 'Sequences, forecasting, KPIs', phoneOnly: true },
      { name: 'Marketing Hub Basics', type: 'Module', note: 'Campagnes, attribution, lifecycle', phoneOnly: true },
      { name: 'Service Hub Basics', type: 'Module', note: 'Tickets et feedback', phoneOnly: true },
      { name: 'Revenue Operations Certification', type: 'Trail', note: '⭐ Certification officielle RevOps' },
      { name: 'Advanced Workflows', type: 'Superbadge ★', note: '🏆 Automatisation complexe' },
    ],
  },
  {
    id: 'hs_dev', name: 'HubSpot Developer', level: 'Mid → Senior',
    icon: '⚡', color: '#00a3e0', demand: 72, demandLabel: 'Forte',
    desc: 'Développe pages, templates et intégrations sur le CMS HubSpot : HubL, custom modules, APIs, webhooks. Vitrine web + CRM unifiés.',
    salaryUS: '$95K–$140K', salaryFR: '€55K–85K', salaryCH: 'CHF 95K–140K',
    salaryDE: '€60K–90K', salaryMaroc: '12K–24K MAD/mois',
    freelanceUS: '$70–130/h', freelanceEU: '€450–800/j', freelanceMarket: 'Forte',
    certs: ['HubSpot CMS for Developers'],
    certsOptional: ['HubSpot Marketing Software', 'HubSpot Sales Software'],
    skills: ['HubL', 'JavaScript', 'Custom Modules', 'REST APIs', 'Webhooks', 'CMS Architecture', 'Git'],
    experience: '2–3 ans. Portfolio de sites CMS HubSpot requis.',
    aiRisk: 'Moyen — templates générés par IA, architecture custom et intégrations restent humaines.',
    growth: 'Écosystème de développeurs plus petit que Salesforce → moins de compétition pour les clients.',
    trails: [
      { name: 'HubSpot CMS Basics', type: 'Module', note: 'Pages, templates, drag & drop', phoneOnly: true },
      { name: 'HubL Templating', type: 'Module', note: 'Langage de templates propriétaire' },
      { name: 'Custom Modules', type: 'Module', note: 'Composants réutilisables' },
      { name: 'External API Integration', type: 'Module', note: 'REST, webhooks, caches', phoneOnly: true },
      { name: 'Developer Superbadge', type: 'Superbadge ★', note: '🏆 Projet complet boutique' },
    ],
  },
]

// ── Oracle roles ──────────────────────────────────────────────────────────────
const ORACLE_ROLES: SFRole[] = [
  {
    id: 'orc_consultant', name: 'Oracle CX Consultant', level: 'Mid → Senior',
    icon: '💼', color: '#ef4444', demand: 68, demandLabel: 'Forte (enterprise)',
    desc: 'Implémente Oracle Sales Cloud / Service Cloud pour de grands comptes. Fonctionnel : Sales Cloud CX, CPQ, prix et processus de vente B2B complexes.',
    salaryUS: '$95K–$145K', salaryFR: '€55K–90K', salaryCH: 'CHF 100K–150K',
    salaryDE: '€65K–100K', salaryMaroc: '15K–28K MAD/mois',
    freelanceUS: '$80–150/h', freelanceEU: '€500–900/j', freelanceMarket: 'Excellente — de niche',
    certs: ['Oracle Sales Cloud CX Implementation Professional'],
    certsOptional: ['OCI Foundations Associate', 'Oracle CPQ Cloud'],
    skills: ['Sales Cloud CX', 'Process Designer', 'Groovy Rules', 'CPQ & Pricing', 'Enterprise Sales Process', 'Data Migration'],
    experience: '2–4 ans. Les gros comptes exigent souvent une expérience enterprise.',
    aiRisk: 'Moyen — les implémentations Oracle restent très custom et longues.',
    growth: 'Niche moins concurrentielle. Consulting de gros comptes (banques, industrie) très rémunérateur.',
    trails: [
      { name: 'Oracle CX Basics', type: 'Module', note: 'SaaS CX : Sales, Service, CPQ', phoneOnly: true },
      { name: 'Sales Cloud Configuration', type: 'Module', note: 'Objets standard, page layouts' },
      { name: 'Process Designer', type: 'Module', note: 'Workflows d\'approbation et de vente' },
      { name: 'Groovy Rule Configuration', type: 'Module', note: '⭐ Règles métier Groovy — le différenciant', phoneOnly: true },
      { name: 'REST for Oracle CX', type: 'Module', note: 'Intégrations API' },
      { name: 'CPQ & Pricing Basics', type: 'Module', note: 'Configuration, pricing, quoting', phoneOnly: true },
      { name: 'Implementation Specialist Badge', type: 'Superbadge ★', note: '🏆 Projet d\'implémentation complet' },
    ],
  },
  {
    id: 'orc_admin', name: 'Oracle Sales Cloud Administrator', level: 'Débutant → Mid',
    icon: '⚙️', color: '#f59e0b', demand: 60, demandLabel: 'Stable',
    desc: 'Administre les orgs Oracle Sales Cloud : utilisateurs, sécurité, process, extensibilité. Porte d\'entrée des carrières Cloud CX.',
    salaryUS: '$80K–$110K', salaryFR: '€45K–70K', salaryCH: 'CHF 80K–110K',
    salaryDE: '€50K–75K', salaryMaroc: '8K–18K MAD/mois',
    freelanceUS: '$50–90/h', freelanceEU: '€300–550/j', freelanceMarket: 'Correcte — niche',
    certs: ['Oracle Sales Cloud Admin'],
    certsOptional: ['OCI Foundations Associate'],
    skills: ['User Management', 'Security & Roles', 'Process Designer', 'Groovy Basics', 'Data Import', 'Reporting'],
    experience: '0–2 ans. Oracle fournit des sandboxes gratuites via OCI Always Free.',
    aiRisk: 'Élevé — config basique assistée, évoluer vers consultant CX.',
    growth: 'Écosystème stable chez les grands comptes. Moins de concurrence, parcours plus prévisible.',
    trails: [
      { name: 'Oracle Cloud Foundations', type: 'Module', note: 'OCI, navigation, rôles', phoneOnly: true },
      { name: 'Sales Cloud Administration', type: 'Module', note: 'Utilisateurs, security, org' },
      { name: 'Process & Approval Basics', type: 'Module', note: 'Workflows standard', phoneOnly: true },
      { name: 'Data Import & Quality', type: 'Module', note: 'FBDI, masquage, dédup' },
      { name: 'Reports & Analytics', type: 'Module', note: 'OTBI — reporting analytique' },
    ],
  },
  {
    id: 'orc_dev', name: 'Oracle / Siebel Developer', level: 'Senior',
    icon: '⚡', color: '#8b5cf6', demand: 55, demandLabel: 'Stable',
    desc: 'Développe sur la stack Oracle CX legacy et nouvelle génération (REST, OTBI, Groovy, HTML Composer). Toujours très demandé chez les industriels.',
    salaryUS: '$100K–$150K', salaryFR: '€60K–95K', salaryCH: 'CHF 105K–155K',
    salaryDE: '€65K–100K', salaryMaroc: '15K–28K MAD/mois',
    freelanceUS: '$90–160/h', freelanceEU: '€550–950/j', freelanceMarket: 'Excellente — de niche',
    certs: ['OCI Foundations', 'Siebel 8 / Sales Cloud Dev'],
    certsOptional: ['Oracle CX Sales Implementation Professional'],
    skills: ['Groovy', 'REST APIs', 'OTBI', 'Siebel EIM', 'BIP Reports', 'Oracle DB', 'Agile'],
    experience: '3–5 ans. Stack legacy encore massive dans la banque et l\'industrie.',
    aiRisk: 'Faible — systèmes legacy critiques rarement migrés rapidement.',
    growth: 'Pénurie de développeurs Oracle. Chèques élevés mais taux de postes plus faible qu\'en Salesforce.',
    trails: [
      { name: 'Oracle CX Dev Basics', type: 'Module', note: 'Extension APIs, SDK', phoneOnly: true },
      { name: 'Groovy Extensibility', type: 'Module', note: '🎯 La compétence la plus payante' },
      { name: 'OTBI & Reports', type: 'Module', note: 'Reporting BI embarqué' },
      { name: 'BIP Publisher', type: 'Module', note: 'Templates de documents', phoneOnly: true },
      { name: 'Integration Superbadge', type: 'Superbadge ★', note: '🏆 Intégration REST enterprise' },
    ],
  },
]

// ── Career data maps ──────────────────────────────────────────────────────────
export const ROLES_BY_CAREER: Record<string, SFRole[]> = {
  salesforce: SF_ROLES,
  hubspot: HUBSPOT_ROLES,
  oracle: ORACLE_ROLES,
}

export const rolesForCareer = (id: string): SFRole[] =>
  ROLES_BY_CAREER[id] || SF_ROLES

// ── Geo ───────────────────────────────────────────────────────────────────────
export interface CareerSpot {
  marocTitle: string
  marocBlurb: string
  bars: { l: string; v: string; p: number }[]
  tip: string
  remote: { f: string; c: string; r: string; n: string }[]
}

export const CAREER_GEO: Record<string, CareerSpot> = {
  salesforce: {
    marocTitle: '🇲🇦 Maroc — Focus Casablanca',
    marocBlurb: '60+ offres actives Salesforce sur Indeed Maroc. NBS Consulting, Inetum et Devoteam recrutent des juniors ADM-201 à Casablanca.',
    bars: [
      { l: 'Junior (0–1 an)', v: '6K–9K MAD/mois', p: 30 },
      { l: 'Mid (1–3 ans)', v: '10K–15K MAD/mois', p: 52 },
      { l: 'Senior (3+ ans)', v: '18K–25K MAD/mois', p: 75 },
    ],
    tip: '💡 Remote EU depuis Maroc : avec 2 certs + 2 ans d\'expérience, tu peux facturer €300–700/j pour des clients français en full remote.',
    remote: [
      { f: '🇫🇷', c: 'France', r: '€300–600/j', n: 'PMEs, ESNs partenaires' },
      { f: '🇧🇪', c: 'Belgique', r: '€350–650/j', n: 'Francophone — moins compétitif' },
      { f: '🇳🇱', c: 'Pays-Bas', r: '€400–700/j', n: 'Hub tech EU — anglophone' },
      { f: '🇩🇪', c: 'Allemagne', r: '€400–750/j', n: 'Enterprise — anglais suffisant' },
      { f: '🇨🇭', c: 'Suisse', r: 'CHF 600–1200/j', n: 'Finance & Pharma — max EU' },
      { f: '🇨🇦', c: 'Canada FR', r: 'CAD $400–700/j', n: 'Programme Mobilité Franco.' },
    ],
  },
  hubspot: {
    marocTitle: '🇲🇦 Maroc — HubSpot & PME',
    marocBlurb: 'HubSpot s\'impose chez les PME/startups du Maroc et de l\'Europe du Sud. Agences partenaires et startups SaaS recrutent des juniors certifiés en CDI ou prestation.',
    bars: [
      { l: 'Junior (0–1 an)', v: '5K–9K MAD/mois', p: 28 },
      { l: 'Mid (1–3 ans)', v: '10K–16K MAD/mois', p: 50 },
      { l: 'Senior (3+ ans)', v: '16K–24K MAD/mois', p: 70 },
    ],
    tip: '🎯 Biais d\'entrée faible : les certifications HubSpot Academy sont gratuites. 3 certs gratuites = profil junior crédible en quelques semaines.',
    remote: [
      { f: '🇫🇷', c: 'France', r: '€250–500/j', n: 'Startups & agences HubSpot' },
      { f: '🇧🇪', c: 'Belgique', r: '€300–550/j', n: 'PME francophones' },
      { f: '🇪🇸', c: 'Espagne', r: '€250–450/j', n: 'Hub South Europe' },
      { f: '🇳🇱', c: 'Pays-Bas', r: '€350–600/j', n: 'Startups SaaS anglophones' },
      { f: '🇩🇪', c: 'Allemagne', r: '€350–650/j', n: 'Mittelstand en migration' },
      { f: '🇨🇦', c: 'Canada FR', r: 'CAD $300–550/j', n: 'Augusta — French tech' },
    ],
  },
  oracle: {
    marocTitle: '🇲🇦 Maroc — Oracle chez les grands comptes',
    marocBlurb: 'Oracle Cloud CX se joue surtout dans les grands comptes (banques, telcos, industrie) à Casablanca. Profils Oracle rares → valorisés malgré un volume d\'offres plus faible.',
    bars: [
      { l: 'Junior (0–1 an)', v: '8K–13K MAD/mois', p: 32 },
      { l: 'Mid (1–3 ans)', v: '14K–22K MAD/mois', p: 55 },
      { l: 'Senior (3+ ans)', v: '22K–32K MAD/mois', p: 78 },
    ],
    tip: '🔒 Stabilité et pérennité : les gros contrats Oracle ont des cycles de 3–5 ans. Moins de tendance, mais des clients fidèles et des chèques élevés.',
    remote: [
      { f: '🇫🇷', c: 'France', r: '€350–650/j', n: 'Grands comptes — banque/industrie' },
      { f: '🇧🇪', c: 'Belgique', r: '€400–700/j', n: 'Finance & énergie' },
      { f: '🇱🇺', c: 'Luxembourg', r: '€600–1000/j', n: 'Finance — top taux EU' },
      { f: '🇨🇭', c: 'Suisse', r: 'CHF 700–1200/j', n: 'Banques — max EU' },
      { f: '🇳🇱', c: 'Pays-Bas', r: '€400–700/j', n: 'Industrie manufacturière' },
      { f: '🇨🇦', c: 'Canada FR', r: 'CAD $450–700/j', n: 'Grands comptes Québec' },
    ],
  },
}

// ── Freelance ────────────────────────────────────────────────────────────────
export interface CareerFreelance {
  stats: { l: string; v: string; s: string; c: string }[]
  services: { s: string; cl: string; p: string; d: number; r: number; c: string }[]
  radarNames: string[]
  radarColors: string[]
  radar: { subject: string; A: number; B: number; C: number }[]
  progression: { p: string; v: string; pct: number; c: string; n: string }[]
}

export const CAREER_FREELANCE: Record<string, CareerFreelance> = {
  salesforce: {
    stats: [
      { l: 'SF Senior US', v: '$150/h', s: '90e percentile', c: '#00a3e0' },
      { l: 'SF Consultant médiane', v: '$61/h', s: 'ZipRecruiter Q1 2026', c: '#10b981' },
      { l: 'Agentforce Specialist', v: '$120/h', s: 'Pénurie mondiale', c: '#8b5cf6' },
      { l: 'UK Day Rate SF', v: '£515/j', s: 'Médiane contrat remote', c: '#f59e0b' },
    ],
    services: [
      { s: 'Salesforce full implementation', cl: 'Mid-market', p: '$20K–100K', d: 5, r: 1, c: '#10b981' },
      { s: 'Agentforce agent design', cl: 'Enterprise', p: '$15K–50K', d: 5, r: 1, c: '#8b5cf6' },
      { s: 'Sales process design', cl: 'PME → mid', p: '$3K–15K', d: 4, r: 3, c: '#f59e0b' },
      { s: 'CRM-ERP integration', cl: 'Mid-market', p: '$10K–50K', d: 4, r: 2, c: '#10b981' },
      { s: 'CRM data migration', cl: 'Tous', p: '$2K–20K', d: 4, r: 3, c: '#f59e0b' },
      { s: 'Custom dashboards', cl: 'Tous', p: '$1K–5K', d: 3, r: 4, c: '#ef4444' },
    ],
    radarNames: ['Agentforce', 'Consultant', 'Admin'],
    radarColors: ['#8b5cf6', '#10b981', '#64748b'],
    radar: [
      { subject: 'Demande', A: 98, B: 90, C: 75 },
      { subject: 'Taux/h', A: 90, B: 75, C: 45 },
      { subject: 'Risque AI', A: 5, B: 40, C: 70 },
      { subject: 'Accessibilité', A: 45, B: 65, C: 90 },
      { subject: 'Freelance fit', A: 92, B: 82, C: 52 },
    ],
    progression: [
      { p: 'Mois 1–6', v: '$0–500', pct: 4, c: '#64748b', n: 'Build profile' },
      { p: 'Mois 7–12', v: '$500–2K', pct: 17, c: '#f59e0b', n: 'Premiers clients' },
      { p: 'An 2', v: '$2K–5K', pct: 42, c: '#00a3e0', n: '2 certs + références' },
      { p: 'An 3+', v: '$5K–12K', pct: 100, c: '#10b981', n: 'Senior + Agentforce' },
    ],
  },
  hubspot: {
    stats: [
      { l: 'HubSpot Senior US', v: '$115/h', s: '90e percentile', c: '#00a3e0' },
      { l: 'HubSpot Consultant', v: '$50/h', s: 'ZipRecruiter Jun 2026', c: '#f59e0b' },
      { l: 'RevOps Specialist', v: '$70/h', s: 'Rôle en forte hausse', c: '#10b981' },
      { l: 'EU Day Rate HubSpot', v: '€350–650/j', s: 'PME & startups', c: '#8b5cf6' },
    ],
    services: [
      { s: 'HubSpot portal implementation', cl: 'PME, startups', p: '$5K–25K', d: 5, r: 2, c: '#f59e0b' },
      { s: 'RevOps setup (HubSpot)', cl: 'PME → mid', p: '$5K–30K', d: 5, r: 1, c: '#10b981' },
      { s: 'CMS website (HubSpot)', cl: 'PME', p: '$3K–20K', d: 4, r: 3, c: '#00a3e0' },
      { s: 'Workflow automation', cl: 'Tous', p: '$1K–8K', d: 4, r: 3, c: '#f59e0b' },
      { s: 'Data migration (ex-CRM)', cl: 'PME', p: '$1K–8K', d: 4, r: 4, c: '#ef4444' },
      { s: 'Marketing automation', cl: 'PME', p: '$1K–10K', d: 3, r: 3, c: '#f59e0b' },
    ],
    radarNames: ['RevOps', 'Consultant', 'Admin'],
    radarColors: ['#ef4444', '#10b981', '#64748b'],
    radar: [
      { subject: 'Demande', A: 82, B: 78, C: 78 },
      { subject: 'Taux/h', A: 80, B: 65, C: 50 },
      { subject: 'Risque AI', A: 10, B: 45, C: 60 },
      { subject: 'Accessibilité', A: 55, B: 75, C: 95 },
      { subject: 'Freelance fit', A: 88, B: 75, C: 60 },
    ],
    progression: [
      { p: 'Mois 1–6', v: '$0–400', pct: 4, c: '#64748b', n: '3 certs gratuites' },
      { p: 'Mois 7–12', v: '$400–1.5K', pct: 15, c: '#f59e0b', n: 'PME francophones' },
      { p: 'An 2', v: '$1.5K–4K', pct: 38, c: '#00a3e0', n: 'RevOps niche' },
      { p: 'An 3+', v: '$4K–10K', pct: 100, c: '#10b981', n: 'Agence ou client direct' },
    ],
  },
  oracle: {
    stats: [
      { l: 'Oracle CX Senior US', v: '$140/h', s: '90e percentile', c: '#00a3e0' },
      { l: 'Siebel Developer', v: '$85/h', s: 'Stack legacy persistante', c: '#f59e0b' },
      { l: 'CX Consultant', v: '$90/h', s: 'Grands comptes', c: '#10b981' },
      { l: 'EU Day Rate Oracle', v: '€500–900/j', s: 'Finance & industrie', c: '#8b5cf6' },
    ],
    services: [
      { s: 'Cloud CX implementation', cl: 'Enterprise', p: '$50K–250K', d: 4, r: 1, c: '#10b981' },
      { s: 'Groovy custom rules', cl: 'Enterprise', p: '$10K–60K', d: 5, r: 2, c: '#8b5cf6' },
      { s: 'Siebel legacy migration', cl: 'Enterprise', p: '$30K–150K', d: 3, r: 1, c: '#f59e0b' },
      { s: 'OTBI / BI reports', cl: 'Enterprise', p: '$5K–30K', d: 4, r: 3, c: '#00a3e0' },
      { s: 'CPQ configuration', cl: 'Enterprise', p: '$15K–80K', d: 4, r: 2, c: '#10b981' },
      { s: 'Data migration', cl: 'Enterprise', p: '$10K–50K', d: 3, r: 3, c: '#ef4444' },
    ],
    radarNames: ['Dev', 'Consultant', 'Admin'],
    radarColors: ['#8b5cf6', '#10b981', '#64748b'],
    radar: [
      { subject: 'Demande', A: 55, B: 68, C: 60 },
      { subject: 'Taux/h', A: 90, B: 80, C: 55 },
      { subject: 'Risque AI', A: 5, B: 35, C: 65 },
      { subject: 'Accessibilité', A: 25, B: 55, C: 85 },
      { subject: 'Freelance fit', A: 70, B: 78, C: 45 },
    ],
    progression: [
      { p: 'Mois 1–6', v: '$0–600', pct: 5, c: '#64748b', n: 'Sandbox OCI gratuite' },
      { p: 'Mois 7–12', v: '$600–2K', pct: 20, c: '#f59e0b', n: 'Intérim ESN' },
      { p: 'An 2', v: '$2K–6K', pct: 48, c: '#00a3e0', n: '1 projet enterprise' },
      { p: 'An 3+', v: '$6K–14K', pct: 100, c: '#10b981', n: 'Groovy + CPQ senior' },
    ],
  },
}

export const freelanceForCareer = (id: string): CareerFreelance =>
  CAREER_FREELANCE[id] || CAREER_FREELANCE.salesforce

// ── Compare ──────────────────────────────────────────────────────────────────
export interface CareerCompare {
  headers: string[]
  colors: string[]
  matrix: string[][]
  radarNames: string[]
  radarColors: string[]
  radar: { subject: string; A: number; B: number; C: number; D: number }[]
  freelance: { name: string; score: number; color: string }[]
  scatter: { name: string; demand: number; risk: number; color: string; size: number }[]
}

export const CAREER_COMPARE: Record<string, CareerCompare> = {
  salesforce: {
    headers: ['Administrator', 'Functional Consultant', 'Agentforce Specialist', 'Solution Architect'],
    colors: ['#64748b', '#10b981', '#8b5cf6', '#a78bfa'],
    matrix: [
      ['Salaire US (médiane)', '$90K', '$118K', '$150K', '$185K'],
      ['Taux freelance senior', '$40–70/h', '$60–120/h', '$100–200/h', '$150–300/h'],
      ['Taux EU remote', '€250–400/j', '€400–700/j', '€600–1000/j', '€700–1500/j'],
      ['Maroc CDI (senior)', '12–18K MAD', '15–22K MAD', '20–30K MAD', '25–40K MAD'],
      ['Certs minimum', 'ADM-201', 'ADM-201 + CRT-251', 'ADM-201 + AI Spec.', '5+ certs'],
      ['Temps opérationnel', '3–6 mois', '12–18 mois', '18–24 mois', '4–6 ans'],
      ['Code requis', '❌ Non', '❌ Non', '❌ Non', '⚠️ Partiel'],
      ['Risque AI', '🔴 Élevé', '🟡 Moyen', '🟢 Très faible', '🟢 Très faible'],
      ['Freelance opportunité', '⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
    ],
    radarNames: ['Agentforce', 'Consultant', 'Architect', 'Admin'],
    radarColors: ['#8b5cf6', '#10b981', '#a78bfa', '#64748b'],
    radar: [
      { subject: 'Demande', A: 98, B: 90, C: 85, D: 75 },
      { subject: 'Salaire', A: 88, B: 70, C: 95, D: 45 },
      { subject: 'Freelance', A: 92, B: 82, C: 90, D: 52 },
      { subject: 'Accessibilité', A: 45, B: 65, C: 20, D: 90 },
      { subject: 'Future-proof', A: 95, B: 65, C: 88, D: 40 },
      { subject: 'Maroc fit', A: 60, B: 85, C: 50, D: 70 },
    ],
    freelance: [
      { name: 'Agentforce AI Specialist', score: 95, color: '#8b5cf6' },
      { name: 'Solution Architect', score: 90, color: '#a78bfa' },
      { name: 'Functional Consultant', score: 82, color: '#10b981' },
      { name: 'Technical Consultant', score: 75, color: '#f59e0b' },
      { name: 'RevOps Specialist', score: 68, color: '#ef4444' },
      { name: 'HubSpot Consultant', score: 58, color: '#00a3e0' },
      { name: 'Administrator', score: 52, color: '#64748b' },
    ],
    scatter: [
      { name: 'Admin', demand: 75, risk: 70, color: '#64748b', size: 52 },
      { name: 'Consult.', demand: 90, risk: 40, color: '#10b981', size: 72 },
      { name: 'Agent AI', demand: 98, risk: 8, color: '#8b5cf6', size: 88 },
      { name: 'Tech', demand: 80, risk: 45, color: '#f59e0b', size: 62 },
      { name: 'RevOps', demand: 70, risk: 30, color: '#ef4444', size: 58 },
      { name: 'Arch.', demand: 85, risk: 15, color: '#a78bfa', size: 78 },
    ],
  },
  hubspot: {
    headers: ['Administrator', 'RevOps Specialist', 'Developer', 'Consultant'],
    colors: ['#64748b', '#ef4444', '#00a3e0', '#10b981'],
    matrix: [
      ['Salaire US (médiane)', '$85K', '$105K', '$115K', '$95K'],
      ['Taux freelance senior', '$45–80/h', '$60–110/h', '$70–130/h', '$55–100/h'],
      ['Taux EU remote', '€280–500/j', '€400–650/j', '€450–800/j', '€350–600/j'],
      ['Maroc CDI (senior)', '10–18K MAD', '12–22K MAD', '12–24K MAD', '10–20K MAD'],
      ['Certs minimum', 'Sales Software', 'RevOps', 'CMS Developer', 'Sales + Marketing'],
      ['Temps opérationnel', '2–4 mois', '8–14 mois', '10–18 mois', '6–12 mois'],
      ['Code requis', '❌ Non', '⚠️ Léger (reporting)', '✅ Oui', '❌ Non'],
      ['Risque AI', '🔴 Élevé', '🟢 Faible', '🟡 Moyen', '🟡 Moyen'],
      ['Freelance opportunité', '⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐'],
    ],
    radarNames: ['RevOps', 'Developer', 'Consultant', 'Admin'],
    radarColors: ['#ef4444', '#00a3e0', '#10b981', '#64748b'],
    radar: [
      { subject: 'Demande', A: 82, B: 72, C: 78, D: 78 },
      { subject: 'Salaire', A: 80, B: 70, C: 65, D: 50 },
      { subject: 'Freelance', A: 88, B: 75, C: 75, D: 60 },
      { subject: 'Accessibilité', A: 55, B: 60, C: 75, D: 95 },
      { subject: 'Future-proof', A: 90, B: 70, C: 62, D: 45 },
      { subject: 'Maroc fit', A: 75, B: 70, C: 80, D: 85 },
    ],
    freelance: [
      { name: 'RevOps Specialist', score: 88, color: '#ef4444' },
      { name: 'Developer', score: 75, color: '#00a3e0' },
      { name: 'Consultant', score: 75, color: '#10b981' },
      { name: 'Salesforce Cross-over', score: 62, color: '#8b5cf6' },
      { name: 'Administrator', score: 60, color: '#64748b' },
      { name: 'Marketing Automation', score: 55, color: '#f59e0b' },
    ],
    scatter: [
      { name: 'Admin', demand: 78, risk: 60, color: '#64748b', size: 52 },
      { name: 'RevOps', demand: 82, risk: 15, color: '#ef4444', size: 76 },
      { name: 'Dev', demand: 72, risk: 50, color: '#00a3e0', size: 54 },
      { name: 'Consult.', demand: 78, risk: 40, color: '#10b981', size: 62 },
      { name: 'CMS', demand: 60, risk: 60, color: '#f59e0b', size: 48 },
    ],
  },
  oracle: {
    headers: ['Sales Cloud Admin', 'CX Consultant', 'Developer', 'CX Architect'],
    colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#a78bfa'],
    matrix: [
      ['Salaire US (médiane)', '$85K', '$115K', '$125K', '$160K'],
      ['Taux freelance senior', '$50–90/h', '$80–150/h', '$90–160/h', '$150–250/h'],
      ['Taux EU remote', '€300–550/j', '€500–900/j', '€550–950/j', '€800–1400/j'],
      ['Maroc CDI (senior)', '12–18K MAD', '18–28K MAD', '18–28K MAD', '25–40K MAD'],
      ['Certs minimum', 'Sales Cloud Admin', 'CX Impl. Pro', 'OCI + CX Dev', '5+ certs'],
      ['Temps opérationnel', '3–6 mois', '12–18 mois', '18–30 mois', '5–7 ans'],
      ['Code requis', '❌ Non', '⚠️ Partiel (Groovy)', '✅ Oui', '✅ Oui'],
      ['Risque AI', '🔴 Élevé', '🟡 Moyen', '🟢 Faible', '🟢 Très faible'],
      ['Freelance opportunité', '⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
    ],
    radarNames: ['Developer', 'Consultant', 'Architect', 'Admin'],
    radarColors: ['#8b5cf6', '#ef4444', '#a78bfa', '#64748b'],
    radar: [
      { subject: 'Demande', A: 55, B: 68, C: 62, D: 60 },
      { subject: 'Salaire', A: 90, B: 80, C: 95, D: 50 },
      { subject: 'Freelance', A: 70, B: 78, C: 90, D: 45 },
      { subject: 'Accessibilité', A: 25, B: 55, C: 15, D: 85 },
      { subject: 'Future-proof', A: 85, B: 60, C: 90, D: 40 },
      { subject: 'Maroc fit', A: 65, B: 80, C: 60, D: 75 },
    ],
    freelance: [
      { name: 'Groovy/CX Architect', score: 90, color: '#a78bfa' },
      { name: 'Developer', score: 86, color: '#8b5cf6' },
      { name: 'CX Consultant', score: 78, color: '#ef4444' },
      { name: 'Siebel Expert', score: 70, color: '#f59e0b' },
      { name: 'CPQ Specialist', score: 66, color: '#10b981' },
      { name: 'Sales Cloud Admin', score: 45, color: '#64748b' },
    ],
    scatter: [
      { name: 'Admin', demand: 60, risk: 65, color: '#64748b', size: 48 },
      { name: 'Consult.', demand: 68, risk: 35, color: '#ef4444', size: 60 },
      { name: 'Dev', demand: 55, risk: 10, color: '#8b5cf6', size: 56 },
      { name: 'Arch.', demand: 62, risk: 8, color: '#a78bfa', size: 64 },
      { name: 'CPQ', demand: 58, risk: 40, color: '#10b981', size: 50 },
    ],
  },
}

export const compareForCareer = (id: string): CareerCompare =>
  CAREER_COMPARE[id] || CAREER_COMPARE.salesforce