import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useStore } from '../../store/useStore'
import {
  CRM_LIST, REGIONS, SEGMENTS, ANALYSIS_ROLES, SENIORITY,
  CURRENCIES, PERIODS, GRAINS, activeFilterCount,
} from '../../data/analysis'

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 px-0.5">{label}</span>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  )
}

function Popover({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 z-50 bg-bg3 border border-b2 rounded-lg p-1.5 min-w-52 shadow-2xl max-h-72 overflow-y-auto">
      {children}
    </div>
  )
}

function MultiDropdown({ label, dotColor, count, open, setOpen, children }: {
  label: string; dotColor?: string; count?: number; open: boolean; setOpen: (v: boolean) => void; children: ReactNode
}) {
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-b1 bg-bg3 text-slate-300 hover:text-slate-100 transition-colors flex items-center gap-1.5">
        {dotColor && <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} />}
        {label}
        {count !== undefined && count > 0 && <span className="text-sfblue">{count}</span>}
        <span className="text-[8px] text-slate-500">▼</span>
      </button>
      <Popover open={open} onClose={() => setOpen(false)}>{children}</Popover>
    </div>
  )
}

export default function FilterBar() {
  const { filters, setFilters, resetFilters } = useStore()
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (id: string) => (v: boolean) => setOpen(v ? id : (open === id ? null : open))

  const toggleIn = (key: 'crms' | 'regions' | 'segments' | 'careerFocus', id: string) => {
    const cur = filters[key]
    let next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
    if (key === 'segments' && next.length === 0) next = SEGMENTS.map(s => s.id)
    setFilters({ [key]: next } as Partial<typeof filters>)
  }

  // Option "Tous" : 1er clic = tout sélectionner, 2e clic = ne garder que la 1re option
  const toggleAll = (
    key: 'crms' | 'regions' | 'segments' | 'careerFocus',
    allState: string[],
    firstId: string,
    isAll: (cur: string[]) => boolean,
  ) => {
    setFilters({ [key]: isAll(filters[key]) ? [firstId] : allState } as Partial<typeof filters>)
  }

  const applyPeriod = (id: string) => {
    const p = PERIODS.find(x => x.id === id)
    if (p) setFilters({ period: p.id, from: p.from, to: p.to })
  }

  return (
    <div className="sticky top-0 z-40 mb-2 rounded-2xl border border-b1 bg-bg2/95 backdrop-blur px-5 py-3 shadow-2xl shadow-black/30">
      <div className="flex items-end gap-x-5 gap-y-2.5 flex-wrap py-1">
        <Group label="Écosystèmes">
          <MultiDropdown label="CRM" dotColor={CRM_LIST.find(c => filters.crms.includes(c.id))?.color}
            count={filters.crms.length} open={open === 'crm'} setOpen={toggle('crm')}>
            <button onClick={() => toggleAll('crms', CRM_LIST.map(c => c.id), CRM_LIST[0].id, cur => cur.length === CRM_LIST.length)}
              title="2e clic : ne garder que la 1re option"
              className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold flex items-center gap-2 transition-colors mb-1 border-b border-b1 ${filters.crms.length === CRM_LIST.length ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
              <span className="flex-1">Tous</span>
              {filters.crms.length === CRM_LIST.length && <span className="text-sfblue">✓</span>}
            </button>
            {CRM_LIST.map(c => (
              <button key={c.id} onClick={() => toggleIn('crms', c.id)}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold flex items-center gap-2 transition-colors ${filters.crms.includes(c.id) ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="flex-1">{c.name}</span>
                {c.id === CRM_LIST[0].id && <span className="text-[9px] text-slate-600">défaut</span>}
                {filters.crms.includes(c.id) && <span style={{ color: c.color }}>✓</span>}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <div className="w-px self-stretch bg-b1" />

        <Group label="Période">
          <MultiDropdown label={PERIODS.find(p => p.id === filters.period)?.label ?? 'Custom'}
            dotColor="#00a3e0" open={open === 'period'} setOpen={toggle('period')}>
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => { applyPeriod(p.id); setOpen(null) }}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${filters.period === p.id ? 'bg-sfblue/15 text-sfblue' : 'text-slate-300 hover:bg-bg4'}`}>
                {p.label} <span className="text-slate-600">({p.from}-{p.to})</span>
              </button>
            ))}
          </MultiDropdown>
          <MultiDropdown label={GRAINS.find(g => g.id === filters.grain)?.label ?? 'Année'}
            open={open === 'grain'} setOpen={toggle('grain')}>
            {GRAINS.map(g => (
              <button key={g.id} onClick={() => { setFilters({ grain: g.id }); setOpen(null) }}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${filters.grain === g.id ? 'bg-sfblue/15 text-sfblue' : 'text-slate-300 hover:bg-bg4'}`}>
                {g.label}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <Group label="Régions">
          <MultiDropdown label={filters.regions.includes('global') || !filters.regions.length ? 'Global' : filters.regions.length + ' régions'}
            open={open === 'reg'} setOpen={toggle('reg')}>
            {REGIONS.map(r => (
              <button key={r.id} onClick={() => {
                  if (r.id === 'global') toggleAll('regions', ['global'], REGIONS[1].id, cur => cur.includes('global') || cur.length === 0)
                  else {
                    const base = filters.regions.filter(x => x !== 'global')
                    const next = base.includes(r.id) ? base.filter(x => x !== r.id) : [...base, r.id]
                    setFilters({ regions: next.length ? next : ['global'] })
                  }
                }}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${r.id === 'global' ? 'mb-1 border-b border-b1' : ''} ${filters.regions.includes(r.id) ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
                {r.label}
                {r.id === REGIONS[1].id && <span className="text-[9px] text-slate-600 float-right mr-2">défaut</span>}
                {filters.regions.includes(r.id) && <span className="float-right text-sfblue">✓</span>}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <Group label="Segments">
          <MultiDropdown label={filters.segments.length === SEGMENTS.length ? 'Tous segments' : filters.segments.length + ' segments'}
            open={open === 'seg'} setOpen={toggle('seg')}>
            <button onClick={() => toggleAll('segments', SEGMENTS.map(s => s.id), SEGMENTS[0].id, cur => cur.length === SEGMENTS.length)}
              title="2e clic : ne garder que la 1re option"
              className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold flex items-center gap-2 transition-colors mb-1 border-b border-b1 ${filters.segments.length === SEGMENTS.length ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
              <span className="flex-1">Tous</span>
              {filters.segments.length === SEGMENTS.length && <span className="text-sfblue">✓</span>}
            </button>
            {SEGMENTS.map(s => (
              <button key={s.id} onClick={() => toggleIn('segments', s.id)}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${filters.segments.includes(s.id) ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
                {s.label}
                {s.id === SEGMENTS[0].id && <span className="text-[9px] text-slate-600 float-right mr-2">défaut</span>}
                {filters.segments.includes(s.id) && <span className="float-right text-sfblue">✓</span>}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <Group label="Focus carrière">
          <MultiDropdown label={filters.careerFocus.length ? filters.careerFocus.length + ' rôles' : 'Tous rôles'}
            open={open === 'focus'} setOpen={toggle('focus')}>
            <button onClick={() => toggleAll('careerFocus', [], ANALYSIS_ROLES[0].id, cur => cur.length === 0)}
              title="2e clic : ne garder que la 1re option"
              className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold flex items-center gap-2 transition-colors mb-1 border-b border-b1 ${filters.careerFocus.length === 0 ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
              <span className="flex-1">Tous</span>
              {filters.careerFocus.length === 0 && <span className="text-sfblue">✓</span>}
            </button>
            {ANALYSIS_ROLES.map(r => (
              <button key={r.id} onClick={() => toggleIn('careerFocus', r.id)}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold flex items-center gap-2 transition-colors ${filters.careerFocus.includes(r.id) ? 'bg-bg4 text-slate-100' : 'text-slate-400 hover:bg-bg4'}`}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                <span className="flex-1">{r.name}</span>
                {r.id === ANALYSIS_ROLES[0].id && <span className="text-[9px] text-slate-600">défaut</span>}
                {filters.careerFocus.includes(r.id) && <span style={{ color: r.color }}>✓</span>}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <Group label="Séniorité">
          <MultiDropdown label={SENIORITY.find(s => s.id === filters.seniority)?.label ?? 'Mid'}
            open={open === 'sen'} setOpen={toggle('sen')}>
            {SENIORITY.map(s => (
              <button key={s.id} onClick={() => { setFilters({ seniority: s.id }); setOpen(null) }}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${filters.seniority === s.id ? 'bg-sfblue/15 text-sfblue' : 'text-slate-300 hover:bg-bg4'}`}>
                {s.label}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <Group label="Devise">
          <MultiDropdown label={filters.currency} open={open === 'cur'} setOpen={toggle('cur')}>
            {CURRENCIES.map(c => (
              <button key={c.id} onClick={() => { setFilters({ currency: c.id }); setOpen(null) }}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[11px] font-semibold transition-colors ${filters.currency === c.id ? 'bg-sfblue/15 text-sfblue' : 'text-slate-300 hover:bg-bg4'}`}>
                {c.label}
              </button>
            ))}
          </MultiDropdown>
        </Group>

        <div className="flex-1" />

        <Group label=" ">
          <button onClick={resetFilters} className="px-3 py-1 rounded-md text-[11px] font-semibold border border-b1 bg-bg3 text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1.5">
            ↺ Réinitialiser
            {activeFilterCount(filters) > 0 && (
              <span className="px-1.5 rounded-full bg-sfblue/20 text-sfblue text-[9px]">{activeFilterCount(filters)}</span>
            )}
          </button>
        </Group>
      </div>
    </div>
  )
}
