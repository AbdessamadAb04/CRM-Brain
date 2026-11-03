import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, ReferenceLine,
} from 'recharts'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Repeat } from 'lucide-react'
import FilterBar from '../analysis/FilterBar'
import { useAnalysis, fmtMoney, fmtB, pct, resampleSeries, MONTHS_FR } from '../../hooks/useAnalysis'
import type { Kpi, SalaryRow, SeriesPoint } from '../../hooks/useAnalysis'
import {
  CAREER_PATH, CATALYSTS, SOURCES, CONFIDENCE_COLOR,
  ENTERPRISE_ADOPTION, CRM_ROI, CONSULTING_BACKLOG,
  crmById, revenueOf, shareOf,
} from '../../data/analysis'

const TT = { contentStyle:{background:'#0f1e38',border:'1px solid #1e3356',borderRadius:6}, labelStyle:{color:'#e2e8f0'} }

const GRAIN_LABEL: Record<string, string> = { year: 'vue annuelle', quarter: 'vue trimestrielle', month: 'vue mensuelle' }

const BADGE: Record<Kpi['badge'], { c: string; label: string }> = {
  Observé: { c: '#10b981', label: '● observé' },
  Estimé:  { c: '#f59e0b', label: '◐ estimé' },
  Projeté: { c: '#8b5cf6', label: '○ projeté' },
}

type ChartLine = { key: string; name: string; color: string; dash?: boolean; fill?: boolean }

type ChartCfg = {
  title: string
  data: SeriesPoint[]
  color: string
  fmt: (v: number | string) => [string, string]
  lines: ChartLine[]
}

const JOBS_REF_YEAR = 2026

// Tick X personnalisé — met en valeur la date du jour en bleu SF
function ChartTick({ x = 0, y = 0, payload, today }: {
  x?: number; y?: number; payload?: { value?: string | number }; today?: string
}) {
  const val = String(payload?.value ?? '')
  const isToday = today !== undefined && val === today
  return (
    <text x={x} y={y} dy={16} textAnchor="middle" fontSize={9}
      fontWeight={isToday ? 700 : 400}
      fill={isToday ? '#00a3e0' : '#64748b'}>
      {val}
    </text>
  )
}

// Emplois générés par un écosystème (M) — ancré sur 2026, pondéré par l'index emplois du vendor
const jobsPerCrm = (id: string, year: number, mFactor: number): number => {
  const ref = revenueOf(id, JOBS_REF_YEAR)
  if (ref <= 0) return 0
  return (crmById(id).jobsIndex / 100 * 9.3) * (revenueOf(id, year) / ref) * mFactor
}

function KpiCard({ k, onClick, selected, action, title, hFull, labelNode }: {
  k: Kpi; onClick?: () => void; selected?: boolean; action?: ReactNode; title?: string; hFull?: boolean; labelNode?: ReactNode
}) {
  const b = BADGE[k.badge]
  const trendColor = k.trend > 0 ? '#10b981' : k.trend < 0 ? '#ef4444' : '#94a3b8'
  return (
    <div
      className={`card-sm flex flex-col gap-1.5 transition-all duration-150 ${hFull ? 'h-full justify-between' : ''} ${onClick ? 'cursor-pointer hover:border-sfblue/40 hover:bg-bg4/60 hover:shadow-lg hover:shadow-sfblue/5' : ''}`}
      onClick={onClick}
      title={title}
      style={selected ? { borderColor: k.color, background: `${k.color}0d`, boxShadow: `0 8px 24px -10px ${k.color}66` } : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`${labelNode ? 'text-[11px]' : 'text-[10px]'} text-slate-500 font-semibold`}>{labelNode ?? k.label}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {action}
          <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: b.c }}>{b.label}</span>
        </div>
      </div>
      <div className="text-2xl font-extrabold tabular-nums leading-none" style={{ color: k.color }}>{k.value}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold" style={{ color: trendColor }}>{k.delta}</span>
        <span className="text-[9px] text-slate-600 text-right truncate">{k.note}</span>
      </div>
    </div>
  )
}

function RevenueSwitchKpi({ crms, year, idx, onSwitch, selected, onSelect }: {
  crms: string[]; year: number; idx: number; onSwitch: () => void; selected: boolean; onSelect: () => void
}) {
  const safe = crms.length ? crms[idx % crms.length] : 'salesforce'
  const nextId = crms.length ? crms[(idx + 1) % crms.length] : 'salesforce'
  const c = crmById(safe)
  const k: Kpi = {
    id: 'leader',
    label: `Revenu ${c.short}`,
    value: fmtB(revenueOf(safe, year)),
    delta: pct(c.cagr * 100),
    note: 'USD · CAGR composé',
    color: c.color,
    badge: 'Estimé',
    trend: 1,
  }
  return (
    <KpiCard
      k={k}
      selected={selected}
      onClick={onSelect}
      hFull
      labelNode={<>Revenu <span style={{ color: c.color }}>{c.short}</span></>}
      title="Cliquer pour afficher la trajectoire de cet écosystème dans le graphique"
      action={
        <button
          onClick={e => { e.stopPropagation(); onSwitch() }}
          title={`Basculer vers ${crmById(nextId).short}`}
          className="p-1 rounded hover:bg-bg4 text-slate-500 hover:text-slate-200 transition-colors"
        >
          <Repeat size={15} />
        </button>
      }
    />
  )
}

function SalaryBars({ rows, currency }: { rows: SalaryRow[]; currency: Parameters<typeof fmtMoney>[1] }) {
  const max = Math.max(...rows.map(r => r.max), 1)
  return (
    <div className="space-y-2.5">
      {rows.map(r => (
        <div key={r.id} className="flex items-center gap-3">
          <div className="text-[11px] text-slate-400 w-16 sm:w-24 shrink-0 text-right truncate">{r.short}</div>
          <div className="flex-1 min-w-0 relative h-6 bg-bg3 rounded overflow-hidden">
            <div className="absolute h-full rounded"
              style={{ left: `${(r.min / max) * 100}%`, width: `${((r.max - r.min) / max) * 100}%`, background: r.color + '55' }} />
            <div className="absolute h-full w-1 rounded"
              style={{ left: `${(r.median / max) * 100}%`, background: r.color }} />
          </div>
          <div className="text-[10px] text-slate-400 w-20 sm:w-32 shrink-0 text-right tabular-nums">
            {fmtMoney(r.median, currency)}
            <span className="hidden md:inline text-slate-600"> · {fmtMoney(r.min, currency)}–{fmtMoney(r.max, currency)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatHighlight({ k, compact = false }: { k?: Kpi; compact?: boolean }) {
  if (!k) return null
  const b = BADGE[k.badge]
  const trendColor = k.trend > 0 ? '#10b981' : k.trend < 0 ? '#ef4444' : '#94a3b8'
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-b1 bg-bg3/70 pl-3 pr-2.5 py-1.5"
        style={{ boxShadow: `inset 3px 0 0 ${k.color}` }}>
        <div className="min-w-0">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{k.label}</div>
          {k.note && <div className="text-[9px] text-slate-600 truncate">{k.note}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-extrabold tabular-nums leading-none" style={{ color: k.color }}>{k.value}</div>
          <div className="text-[9px] font-bold leading-tight mt-0.5">
            <span style={{ color: trendColor }}>{k.delta}</span>
            <span className="ml-1" style={{ color: b.c }}>{b.label}</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="card-sm" style={{ boxShadow: `inset 3px 0 0 ${k.color}` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{k.label}</span>
        <span className="text-[9px] font-bold" style={{ color: b.c }}>{b.label}</span>
      </div>
      <div className="text-3xl font-extrabold tabular-nums mt-1" style={{ color: k.color }}>{k.value}</div>
      <div className="text-[10px] mt-0.5">
        <span className="font-bold" style={{ color: trendColor }}>{k.delta}</span>
        {k.note && <span className="text-slate-600 ml-1">· {k.note}</span>}
      </div>
    </div>
  )
}

function GapBars({ rows }: { rows: SalaryRow[] }) {
  return (
    <div className="space-y-2.5">
      {[...rows].sort((a, b) => b.gap - a.gap).map(r => (
        <div key={r.id} className="flex items-center gap-2">
          <div className="text-[10px] text-slate-400 w-16 sm:w-20 shrink-0 text-right truncate">{r.short}</div>
          <div className="flex-1 min-w-0 h-4 bg-bg3 rounded overflow-hidden flex">
            <div className="h-full" style={{ width: `${r.supply}%`, background: '#10b981' }} title="Offre" />
            <div className="h-full" style={{ width: `${Math.max(0, 100 - r.supply)}%`, background: r.color + '40' }} />
          </div>
          <div className="text-[10px] w-24 shrink-0 text-right tabular-nums">
            <span className="text-sfgreen">{r.supply}</span>
            <span className="hidden sm:inline text-slate-600">/100 offre · </span>
            <span className="text-sfred font-bold">gap {r.gap}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const a = useAnalysis()
  const { filters, series, years, crms, donut, movers, matrix, radar, radarCrms, salaries, mFactor } = a
  const twoCrms = crms.length > 1

  const [selKpi, setSelKpi] = useState('size')
  const [revIdx, setRevIdx] = useState(0)
  const revCrm = crms[revIdx % crms.length] ?? 'salesforce'

  // Emplois génériques — somme par écosystème sélectionné
  const jobsEcoAt = (y: number) => crms.reduce((s, id) => s + jobsPerCrm(id, y, mFactor), 0)
  const jobsEcoDelta = filters.from < filters.to && jobsEcoAt(filters.from) > 0
    ? ((jobsEcoAt(filters.to) - jobsEcoAt(filters.from)) / jobsEcoAt(filters.from)) * 100
    : 0
  const jobsEcoKpi: Kpi = {
    id: 'jobsEco',
    label: 'Emplois par écosystème',
    value: `${jobsEcoAt(filters.to).toFixed(1)}M`,
    delta: pct(jobsEcoDelta),
    note: 'M · somme CRM sélectionnés',
    color: '#14b8a6',
    badge: 'Projeté',
    trend: jobsEcoDelta >= 0 ? 1 : -1,
  }

  // Croissance AI / Agents — CAGR du revenu pondéré par la maturité AI des écosystèmes
  const aiRevOf = (id: string, y: number) => revenueOf(id, y) * (crmById(id).aiReadiness / 100)
  const aiRevAt = (y: number) => crms.reduce((s, id) => s + aiRevOf(id, y), 0)
  const aiGrowthCagr = filters.from < filters.to && aiRevAt(filters.from) > 0
    ? (Math.pow(aiRevAt(filters.to) / aiRevAt(filters.from), 1 / (filters.to - filters.from)) - 1) * 100
    : 0
  const aiGrowthKpi: Kpi = {
    id: 'aiGrowth',
    label: 'Croissance AI / Agents',
    value: pct(aiGrowthCagr),
    delta: fmtB(aiRevAt(filters.to)),
    note: 'CAGR AI-weighted · sélection',
    color: '#8b5cf6',
    badge: 'Projeté',
    trend: aiGrowthCagr >= 0 ? 1 : -1,
  }

  // Part de marché — suivant l'écosystème choisi sur la carte « Revenu »
  const shareCrm = crmById(revCrm)
  const shareNow = shareOf(revCrm, filters.to)
  const shareDelta = shareNow - shareOf(revCrm, filters.from)
  const shareKpi: Kpi = {
    id: 'share',
    label: 'Part du leader',
    value: `${shareNow.toFixed(1)}%`,
    delta: `${shareDelta >= 0 ? '+' : ''}${shareDelta.toFixed(2)} pts`,
    note: `vs ${filters.from}`,
    color: shareCrm.color,
    badge: 'Observé',
    trend: shareDelta >= 0 ? 1 : -1,
  }

  const chartCfg: ChartCfg = useMemo(() => {
    const gl = GRAIN_LABEL[filters.grain] ?? ''
    if (selKpi === 'leader') {
      const c = crmById(revCrm)
      const annual = years.map(y => ({ year: y, total: 0, v: +revenueOf(revCrm, y).toFixed(2) }))
      return {
        title: `Revenu ${c.short} — ${filters.from}–${filters.to} ($B, USD) · ${gl}`,
        data: resampleSeries(annual, filters.grain, ['v']),
        color: c.color,
        fmt: v => [`$${Number(v).toFixed(1)}B`, c.name],
        lines: [{ key: 'v', name: c.name, color: c.color, fill: true }],
      }
    }
    if (selKpi === 'share') {
      const c = crmById(revCrm)
      const annual = years.map(y => ({ year: y, total: 0, v: +shareOf(revCrm, y).toFixed(2) }))
      return {
        title: `Part de marché ${c.short} — ${filters.from}–${filters.to} (% mondial) · ${gl}`,
        data: resampleSeries(annual, filters.grain, ['v']),
        color: c.color,
        fmt: v => [`${Number(v).toFixed(1)}%`, c.name],
        lines: [{ key: 'v', name: `Part ${c.short}`, color: c.color, fill: true }],
      }
    }
    if (selKpi === 'aiGrowth') {
      const annual = years.map(y => {
        const p: { year: number; total: number; [key: string]: number } = { year: y, total: 0 }
        for (const id of crms) { p[id] = +aiRevOf(id, y).toFixed(3); p.total = +(p.total + p[id]).toFixed(3) }
        return p
      })
      return {
        title: `Revenu AI / Agents — ${filters.from}–${filters.to} ($B pondéré AI) · ${gl}`,
        data: resampleSeries(annual, filters.grain, ['total', ...crms]),
        color: '#8b5cf6',
        fmt: v => [`$${Number(v).toFixed(2)}B`, 'AI-weighted'],
        lines: [
          ...crms.map(id => ({
            key: id, name: donut.find(dd => dd.id === id)?.name ?? id,
            color: donut.find(dd => dd.id === id)?.color ?? '#8b5cf6',
            fill: crms.length === 1,
          })),
          ...(crms.length > 1 ? [{ key: 'total', name: 'Total AI sélection', color: '#8b5cf6', dash: true, fill: true }] : []),
        ],
      }
    }
    if (selKpi === 'jobsEco') {
      const annual = years.map(y => {
        const p: { year: number; total: number; [key: string]: number } = { year: y, total: 0 }
        for (const id of crms) { p[id] = +jobsPerCrm(id, y, mFactor).toFixed(3); p.total = +(p.total + p[id]).toFixed(3) }
        return p
      })
      return {
        title: `Emplois par écosystème — projection ${filters.from}–${filters.to} (M) · ${gl}`,
        data: resampleSeries(annual, filters.grain, ['total', ...crms]),
        color: '#14b8a6',
        fmt: v => [`${Number(v).toFixed(2)}M`, 'emplois'],
        lines: [
          ...crms.map(id => ({
            key: id, name: donut.find(dd => dd.id === id)?.name ?? id,
            color: donut.find(dd => dd.id === id)?.color ?? '#14b8a6',
            fill: crms.length === 1,
          })),
          ...(crms.length > 1 ? [{ key: 'total', name: 'Total sélection', color: '#14b8a6', dash: true, fill: true }] : []),
        ],
      }
    }
    return {
      title: `Trajectoire marché & écosystèmes ${filters.from}–${filters.to} ($B, USD) · ${gl}`,
      data: series,
      color: '#00a3e0',
      fmt: v => [`$${Number(v).toFixed(1)}B`, ''],
      lines: [
        ...crms.map(id => ({
          key: id, name: donut.find(dd => dd.id === id)?.name ?? id,
          color: donut.find(dd => dd.id === id)?.color ?? '#00a3e0',
          fill: crms.length === 1,
        })),
        ...(crms.length > 1 ? [{ key: 'total', name: 'Total sélection', color: '#00a3e0', dash: true, fill: true }] : []),
      ],
    }
  }, [selKpi, revCrm, years, filters, series, crms, donut, a])

  // Libellé de la période contenant aujourd'hui (selon le grain)
  const todayLabel = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = d.getMonth()
    if (filters.grain === 'year') return String(y)
    if (filters.grain === 'quarter') return `${y} Q${Math.floor(m / 3) + 1}`
    return `${MONTHS_FR[m]} ${String(y).slice(2)}`
  }, [filters.grain])

  // Tick list explicite (sous-échantillon) — garantit l'affichage du jour + bornes
  const axisTicks = useMemo(() => {
    const labels = chartCfg.data.map(p => p.label)
    if (labels.length <= 7) return labels
    const step = Math.ceil(labels.length / 6)
    const keep = new Set<string>()
    for (let i = 0; i < labels.length; i += step) keep.add(labels[i])
    keep.add(labels[labels.length - 1])
    if (labels.includes(todayLabel)) keep.add(todayLabel)
    return labels.filter(l => keep.has(l))
  }, [chartCfg.data, todayLabel])

  const hasToday = chartCfg.data.some(p => p.label === todayLabel)

  const exportCsv = () => {
    const head = ['Vendor', 'Revenu (B$)', 'Part (%)', 'CAGR (%)', 'AI readiness', 'Jobs index', 'Certs', 'Score', 'Force']
    const lines = matrix.map(m =>
      [m.name, m.revenue.toFixed(2), m.share, m.cagr.toFixed(1), m.aiReadiness, m.jobsIndex, m.certMaturity, m.score, `"${m.strength}"`].join(','))
    const csv = [head.join(','), ...lines].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `analyse-crm-${filters.from}-${filters.to}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <div className="section-title">Analytiques — Intelligence CRM</div>
        <div className="section-sub">
          Marché, concurrence, carrière & signaux AI — filtres appliqués à l'ensemble de la page
        </div>
      </div>

      <FilterBar />

      {/* B — KPI strip */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <KpiCard k={a.kpis[0]} selected={selKpi === a.kpis[0].id} hFull
          title="Cliquer pour afficher cette métrique dans le graphique"
          onClick={() => setSelKpi(a.kpis[0].id)} />
        <KpiCard k={jobsEcoKpi} selected={selKpi === jobsEcoKpi.id} hFull
          title="Cliquer pour afficher les emplois par écosystème dans le graphique"
          onClick={() => setSelKpi('jobsEco')} />
        <KpiCard k={aiGrowthKpi} selected={selKpi === aiGrowthKpi.id} hFull
          title="Cliquer pour afficher la trajectoire du revenu AI / Agents dans le graphique"
          onClick={() => setSelKpi('aiGrowth')} />
        <div className="md:col-span-2 rounded-xl border border-b1 bg-bg3/40 p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
            <RevenueSwitchKpi crms={crms} year={filters.to}
              idx={revIdx} onSwitch={() => setRevIdx(i => i + 1)}
              selected={selKpi === 'leader'} onSelect={() => setSelKpi('leader')} />
            <KpiCard k={shareKpi} selected={selKpi === shareKpi.id} hFull
              title="Cliquer pour afficher la part de marché de cet écosystème dans le graphique"
              onClick={() => setSelKpi('share')} />
          </div>
        </div>
      </section>

      {/* C — Market pulse */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          C · Market pulse
          {a.fallbackCrm && <span className="ml-2 font-medium normal-case tracking-normal text-sfamber">— sélection vide : Salesforce par défaut</span>}
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{chartCfg.title}</div>
              {selKpi !== 'size' && (
                <button onClick={() => setSelKpi('size')} title="Revenir à la vue marché globale"
                  className="btn btn-ghost text-[9px] px-2 py-0.5 shrink-0">
                  ↺ Vue marché
                </button>
              )}
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartCfg.data}>
                <defs>
                  <linearGradient id="kpiFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartCfg.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartCfg.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3356" />
                <XAxis dataKey="label" ticks={axisTicks} interval={0}
                  tick={<ChartTick today={hasToday ? todayLabel : undefined} />} />
                <YAxis tick={{ fill:'#64748b', fontSize:9 }} />
                <Tooltip {...TT} formatter={chartCfg.fmt} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {hasToday && (
                  <ReferenceLine x={todayLabel} stroke="#00a3e0" strokeWidth={1}
                    strokeOpacity={0.35} strokeDasharray="3 4" />
                )}
                {chartCfg.lines.map(l => (
                  <Area key={l.key} type="monotone" dataKey={l.key} name={l.name}
                    stroke={l.color} fill={l.fill ? 'url(#kpiFill)' : 'none'}
                    strokeDasharray={l.dash ? '6 4' : undefined} strokeWidth={2} dot={false} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1">
              Part de marché {filters.to} — écosystèmes sélectionnés
            </div>
            <div className="text-[9px] text-slate-600 mb-2">Parts globales (non régionalisées) — le filtre région affecte la taille, pas les parts</div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={150} height={170}>
                <PieChart>
                  <Pie data={donut} cx="50%" cy="50%" innerRadius={42} outerRadius={75} dataKey="value">
                    {donut.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip {...TT} formatter={(v) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 flex-1 min-w-0">
                {donut.map(v => (
                  <div key={v.id} className={`flex items-center gap-2 ${v.id === 'other' ? 'opacity-60' : ''}`}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: v.color }} />
                    <span className="text-xs text-slate-300 flex-1 truncate">{v.name}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: v.color }}>{v.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-b1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-2">Top mouvements (pts, {filters.from}→{filters.to})</div>
              <div className="space-y-1">
                {movers.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                    <span className="text-[11px] text-slate-300 flex-1">{m.name}</span>
                    <span className={`text-[11px] font-bold tabular-nums ${m.delta >= 0 ? 'text-sfgreen' : 'text-sfred'}`}>
                      {m.delta >= 0 ? '▲' : '▼'} {Math.abs(m.delta).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D — Competitive landscape */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">D · Paysage concurrentiel</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Matrice vendors — positionnement relatif</div>
              <button onClick={exportCsv} className="btn btn-ghost text-[10px] px-2.5 py-1">⤓ CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vendor</th><th>Revenu</th><th>Part</th><th>CAGR</th>
                    <th>AI</th><th>Emplois</th><th>Certs</th><th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map(m => (
                    <tr key={m.id}>
                      <td>
                        <span className="inline-flex items-center gap-2 font-semibold text-slate-200">
                          <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />{m.name}
                        </span>
                        <div className="text-[10px] text-slate-600 mt-0.5">{m.strength}</div>
                      </td>
                      <td className="font-bold tabular-nums">{fmtB(m.revenue)}</td>
                      <td className="tabular-nums">{m.share}%</td>
                      <td className="tabular-nums text-sfgreen">+{m.cagr.toFixed(1)}%</td>
                      <td className="tabular-nums">{m.aiReadiness}</td>
                      <td className="tabular-nums">{m.jobsIndex}</td>
                      <td className="tabular-nums">{m.certMaturity}</td>
                      <td>
                        <span className="text-xs font-extrabold tabular-nums" style={{ color: m.color }}>{m.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Profil concurrentiel (radar)</div>
            {crms.length > 4 && (
              <div className="text-[9px] text-slate-600 -mt-2 mb-2">Affichage limité aux 4 premiers écosystèmes sélectionnés</div>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radar} outerRadius="70%">
                <PolarGrid stroke="#1e3356" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:'#64748b', fontSize: 9 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill:'#334155', fontSize: 8 }} tickCount={5} />
                {radarCrms.map(id => (
                  <Radar key={id} dataKey={id}
                    name={donut.find(dd => dd.id === id)?.name ?? id}
                    stroke={donut.find(dd => dd.id === id)?.color}
                    fill={donut.find(dd => dd.id === id)?.color} fillOpacity={0.15} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Tooltip {...TT} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* E — Career intelligence */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">E · Intelligence carrière</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                Rémunération estimée — {filters.seniority}, {filters.currency}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatHighlight k={a.kpi('salary')} compact />
                <StatHighlight k={a.kpi('jobs')} compact />
              </div>
            </div>
            <SalaryBars rows={salaries} currency={filters.currency} />
          </div>
          <div className="card">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Tension demande / offre</div>
            <GapBars rows={salaries} />
            <div className="mt-3">
              <StatHighlight k={a.kpi('gap')} compact />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-4">Career path explorer — progression & paliers salariaux ($K)</div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-3 h-0.5 bg-b1" />
            <div className="relative grid grid-cols-5 gap-2">
              {CAREER_PATH.map((step, i) => {
                const colors = ['#64748b', '#10b981', '#00a3e0', '#8b5cf6', '#f59e0b']
                return (
                  <div key={step.label} className="flex flex-col items-center text-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold bg-bg2"
                      style={{ borderColor: colors[i], color: colors[i] }}>{i + 1}</div>
                    <div className="text-[11px] font-bold text-slate-200 leading-tight">{step.label}</div>
                    <div className="text-sm font-extrabold tabular-nums" style={{ color: colors[i] }}>${step.salary}K</div>
                    <div className="text-[9px] text-slate-500">{step.months > 0 ? `+${step.months} mois` : 'départ'}</div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {step.certs.map(c => (
                        <span key={c} className="text-[8px] px-1 py-0.5 rounded bg-bg3 text-slate-500 border border-b1">{c}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* E — Catalyseurs */}
      <section className="card">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Catalyseurs du marché — timeline</div>
        <div className="flex flex-wrap gap-2">
          {CATALYSTS.map(c => (
            <div key={c.year} className="bg-bg3 border-l-2 border-sfblue rounded-lg px-3 py-2 min-w-40">
              <div className="text-[10px] font-bold text-sfblue tabular-nums">{c.year}</div>
              <div className="text-[11px] text-slate-300 leading-snug">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* F — Adoption & AI signals */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">F · Adoption & signaux AI</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">
              Maturité AI par écosystème (% des déploiements)
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={a.adoptionBars} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3356" horizontal={false} />
                <XAxis type="number" tick={{ fill:'#64748b', fontSize:9 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fill:'#94a3b8', fontSize: 10 }} />
                <Tooltip {...TT} formatter={(v) => [`${v}%`, '']} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="notStarted" name="Non démarré" stackId="s" fill="#334155" />
                <Bar dataKey="pilot" name="Pilote" stackId="s" fill="#f59e0b" />
                <Bar dataKey="production" name="Production" stackId="s" fill="#00a3e0" />
                <Bar dataKey="scaled" name="Scalé" stackId="s" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <StatHighlight k={a.kpi('ai')} />
            <div className="card-sm">
              <div className="text-[10px] text-slate-500 mb-1">Maturité AI — sélection</div>
              <div className="text-4xl font-extrabold text-sfpurple">{a.aiAvg}%</div>
              <div className="text-[10px] text-slate-500 mt-1">production + scalée · CRM filtrés</div>
            </div>
            <div className="card-sm">
              <div className="text-[10px] text-slate-500 mb-1">Adoption CRM entreprises <span className="text-slate-600">· réf. marché</span></div>
              <div className="text-4xl font-extrabold text-sfgreen">{ENTERPRISE_ADOPTION}%</div>
              <div className="text-[10px] text-slate-500 mt-1">ROI moyen : <span className="text-sfamber font-bold">${CRM_ROI}</span> par $1</div>
            </div>
            <div className="card-sm">
              <div className="text-[10px] text-slate-500 mb-1">Backlog consulting AI <span className="text-slate-600">· réf. marché</span></div>
              <div className="text-4xl font-extrabold text-sfamber">{CONSULTING_BACKLOG}%</div>
              <div className="text-[10px] text-slate-500 mt-1">Tension AI Specialists : <span className="text-sfred font-bold">&lt;10K certifiés</span> / 1M+ besoins</div>
            </div>
          </div>
        </div>
      </section>

      {/* G — Méthodologie & export */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">G · Méthodologie & export</h2>
        <StatHighlight k={a.kpi('sources')} />
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Sources croisées & niveau de confiance</div>
            <button onClick={exportCsv} className="btn btn-blue text-[10px] px-3">⤓ Exporter le comparateur (CSV)</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SOURCES.map(s => (
              <div key={s.name} className="bg-bg3 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: CONFIDENCE_COLOR[s.confidence] }} />
                <span className="text-[11px] text-slate-300 flex-1">{s.name}</span>
                <span className="text-[9px] font-bold uppercase" style={{ color: CONFIDENCE_COLOR[s.confidence] }}>{s.confidence}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {twoCrms && (
        <div className="text-[10px] text-slate-600 text-center pb-2">
          {crms.length} écosystèmes sélectionnés — comparaison active
        </div>
      )}
    </div>
  )
}
