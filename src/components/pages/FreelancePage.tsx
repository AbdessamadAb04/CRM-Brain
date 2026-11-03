import { useStore } from '../../store/useStore'
import { freelanceForCareer, careerById } from '../../data/careers'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const TT = {contentStyle:{background:'#0f1e38',border:'1px solid #1e3356',borderRadius:6}}

const JOB_FILTER: Record<string,string[]> = {
  salesforce: [],
  hubspot: ['hubspot'],
  oracle: ['oracle', 'siebel'],
}

export default function FreelancePage() {
  const { jobs, selectedCareer } = useStore()
  const career = careerById(selectedCareer)
  const cfg = freelanceForCareer(selectedCareer)

  const kws = JOB_FILTER[selectedCareer] || []
  const visibleJobs = kws.length
    ? jobs.filter(j => kws.some(k => (j.title+' '+j.company+' '+j.location).toLowerCase().includes(k)))
    : jobs

  return (
    <div className="space-y-4">
      <div><div className="section-title">Opportunités Freelance</div><div className="section-sub">Services, plateformes, taux et progression revenus · {career.name}</div></div>
      <div className="grid grid-cols-4 gap-3">
        {cfg.stats.map(s=>(
          <div key={s.l} className="card-sm">
            <div className="text-[10px] text-slate-500 mb-1">{s.l}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{color:s.c}}>{s.v}</div>
            <div className="text-[10px] text-slate-600 mt-1">{s.s}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Services — Demande vs Risque commoditisation</div>
          <div className="space-y-2">
            {cfg.services.map(s=>(
              <div key={s.s} className="p-2.5 bg-bg3 rounded-lg">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-200 leading-tight">{s.s}</span>
                  <span className="text-xs font-bold text-sfamber tabular-nums shrink-0">{s.p}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500">Demande:</span>
                  <span style={{color:'#10b981'}}>{'★'.repeat(s.d)}</span>
                  <span className="text-[10px] text-slate-500 ml-2">Risque:</span>
                  <span style={{color:s.r>=4?'#ef4444':s.r>=3?'#f59e0b':'#10b981'}}>{'●'.repeat(s.r)}{'○'.repeat(5-s.r)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Attractivité freelance — Comparaison rôles</div>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={cfg.radar}>
                <PolarGrid stroke="#1e3356"/>
                <PolarAngleAxis dataKey="subject" tick={{fill:'#64748b',fontSize:10}}/>
                <Radar name={cfg.radarNames[0]} dataKey="A" stroke={cfg.radarColors[0]} fill={cfg.radarColors[0]} fillOpacity={0.25}/>
                <Radar name={cfg.radarNames[1]} dataKey="B" stroke={cfg.radarColors[1]} fill={cfg.radarColors[1]} fillOpacity={0.2}/>
                <Radar name={cfg.radarNames[2]} dataKey="C" stroke={cfg.radarColors[2]} fill={cfg.radarColors[2]} fillOpacity={0.1}/>
                <Tooltip {...TT}/>
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 justify-center flex-wrap mt-2">
              {cfg.radarNames.map((n,i)=>(
                <div key={n} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{background:cfg.radarColors[i]}}/>{n}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Progression revenus freelance ($/mois)</div>
            <div className="space-y-2">
              {cfg.progression.map(r=>(
                <div key={r.p} className="flex items-center gap-3">
                  <div className="text-[11px] text-slate-400 w-20 shrink-0">{r.p}</div>
                  <div className="flex-1 h-5 bg-bg3 rounded overflow-hidden">
                    <div className="h-full rounded flex items-center pl-2 text-[9px] font-bold text-white transition-all"
                      style={{width:`${r.pct}%`,background:r.c}}>{r.v}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 w-28 shrink-0">{r.n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {visibleJobs.length > 0 && (
        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Offres emploi ({visibleJobs.length})</div>
          <div className="grid grid-cols-2 gap-2">
            {visibleJobs.map((j,i)=>(
              <a key={i} href={j.url} target="_blank" rel="noreferrer"
                className="bg-bg3 rounded-lg p-3 hover:bg-bg4 transition-colors cursor-pointer block">
                <div className="text-xs font-bold text-slate-200 mb-1">{j.title}</div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">{j.company} · {j.location}</span>
                  <span className="text-[11px] font-bold text-sfamber">{j.salary}</span>
                </div>
                <div className="flex gap-2 mt-1.5">
                  <span className="badge badge-blue">{j.platform}</span>
                  <span className="text-[10px] text-slate-600">{j.role_type}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}