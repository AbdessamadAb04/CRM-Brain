import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { useState } from 'react'
import FilterBar from '../analysis/FilterBar'
import { useAnalysis, fmtMoney, fmtB, pct } from '../../hooks/useAnalysis'
import type { Kpi, SalaryRow } from '../../hooks/useAnalysis'
import {
  CAREER_PATH, CATALYSTS, SOURCES, CONFIDENCE_COLOR,
  ENTERPRISE_ADOPTION, CRM_ROI, CONSULTING_BACKLOG,
  crmById, revenueOf,
} from '../../data/analysis'

const TT = { contentStyle:{background:'#0f1e38',border:'1px solid #1e3356',borderRadius:6}, labelStyle:{color:'#e2e8f0'} }

const GRAIN_LABEL: Record<string, string> = { year: 'vue annuelle', quarter: 'vue trimestrielle', month: 'vue mensuelle' }

const BADGE: Record<Kpi['badge'], { c: string; label: string }> = {
  Observé: { c: '#10b981', label: '● observé' },
  Estimé:  { c: '#f59e0b', label: '◐ estimé' },
  Projeté: { c: '#8b5cf6', label: '○ projeté' },
}

function KpiCard({ k, onClick, title }: { k: Kpi; onClick?: () => void; title?: string }) {
  const b = BADGE[k.badge]
  const trendColor = k.trend > 0 ? '#10b981' : k.trend < 0 ? '#ef4444' : '#94a3b8'
  return (
    <div
      className={`card-sm flex flex-col gap-1.5 transition-all duration-150 ${onClick ? 'cursor-switch hover:border-sfblue/40 hover:bg-bg4/60 hover:shadow-lg hover:shadow-sfblue/5' : ''}`}
      onClick={onClick}
      title={title}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 font-semibold">{k.label}</span>
        <span className="text-[8px] font-bold uppercase tracking-wide shrink-0" style={{ color: b.c }}>{b.label}</span>
      </div>
      <div className="text-2xl font-extrabold tabular-nums leading-none" style={{ color: k.color }}>{k.value}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold" style={{ color: trendColor }}>{k.delta}</span>
        <span className="text-[9px] text-slate-600 text-right truncate">{k.note}</span>
      </div>
    </div>
  )
}

function RevenueSwitchKpi({ crms, year }: { crms: string[]; year: number }) {
  const [idx, setIdx] = useState(0)
  const safe = crms.length ? crms[idx % crms.length] : 'salesforce'
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
      onClick={() => setIdx(i => i + 1)}
      title="Cliquer pour basculer vers un autre écosystème sélectionné"
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
  const { filters, series, crms, donut, movers, matrix, radar, radarCrms, salaries } = a
  const twoCrms = crms.length > 1

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
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {a.kpis.slice(0, 4).map((k, idx) => {
          if (idx === 1) {
            return <RevenueSwitchKpi key="leader-switch" crms={crms} year={filters.to} />
          }
          return <KpiCard key={k.id} k={k} />
        })}
      </section>

      {/* C — Market pulse */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          C · Market pulse
          {a.fallbackCrm && <span className="ml-2 font-medium normal-case tracking-normal text-sfamber">— sélection vide : Salesforce par défaut</span>}
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">
              Trajectoire marché & écosystèmes {filters.from}–{filters.to} ($B, USD) · {GRAIN_LABEL[filters.grain] ?? ''}
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="mkt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a3e0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00a3e0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3356" />
                <XAxis dataKey="label" tick={{ fill:'#64748b', fontSize:9 }} minTickGap={28} />
                <YAxis tick={{ fill:'#64748b', fontSize:9 }} />
                <Tooltip {...TT} formatter={(v) => [`$${Number(v).toFixed(1)}B`, '']} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="total" name="Marché total" stroke="#00a3e0" fill="url(#mkt)" strokeWidth={2} dot={false} />
                {crms.map(id => (
                  <Area key={id} type="monotone" dataKey={id} name={donut.find(dd => dd.id === id)?.name ?? id}
                    stroke={donut.find(dd => dd.id === id)?.color} fill="none" strokeWidth={2} dot={false} />
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
              <StatHighlight k={a.kpi('salary')} compact />
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
