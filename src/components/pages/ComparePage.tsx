import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { compareForCareer, careerById } from '../../data/careers'
import { useStore } from '../../store/useStore'

const TT = { contentStyle:{background:'#0f1e38',border:'1px solid #1e3356',borderRadius:6} }

export default function ComparePage() {
  const { selectedCareer } = useStore()
  const career = careerById(selectedCareer)
  const cfg = compareForCareer(selectedCareer)

  return (
    <div className="space-y-4">
      <div>
        <div className="section-title">Comparaison des Rôles — {career.name}</div>
        <div className="section-sub">Analyse comparative — salaires, freelance, demande et risque AI</div>
      </div>

      {/* Matrix */}
      <div className="card overflow-x-auto">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Matrice comparative — Top 4 rôles {career.name}</div>
        <table className="data-table w-full min-w-[640px]">
          <thead>
            <tr>
              <th>Critère</th>
              {cfg.headers.map((h,i) => (
                <th key={h} style={{color:cfg.colors[i]}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cfg.matrix.map(([label, ...vals]) => (
              <tr key={label}>
                <td className="text-slate-400 font-semibold">{label}</td>
                {vals.map((v,i) => <td key={i} className="text-slate-300">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Radar */}
        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Score multidimensionnel</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={cfg.radar}>
              <PolarGrid stroke="#1e3356"/>
              <PolarAngleAxis dataKey="subject" tick={{fill:'#64748b',fontSize:10}}/>
              <Radar name={cfg.radarNames[0]} dataKey="A" stroke={cfg.radarColors[0]} fill={cfg.radarColors[0]} fillOpacity={0.25}/>
              <Radar name={cfg.radarNames[1]} dataKey="B" stroke={cfg.radarColors[1]} fill={cfg.radarColors[1]} fillOpacity={0.2}/>
              <Radar name={cfg.radarNames[2]} dataKey="C" stroke={cfg.radarColors[2]} fill={cfg.radarColors[2]} fillOpacity={0.15}/>
              <Radar name={cfg.radarNames[3]} dataKey="D" stroke={cfg.radarColors[3]} fill={cfg.radarColors[3]} fillOpacity={0.1}/>
              <Tooltip {...TT}/>
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 justify-center flex-wrap mt-2">
            {cfg.radarNames.map((n,i) => (
              <div key={n} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-2 h-2 rounded-full" style={{background:cfg.radarColors[i]}}/>{n}
              </div>
            ))}
          </div>
        </div>

        {/* Freelance score bars */}
        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-4">Score attractivité freelance (composite /100)</div>
          <div className="space-y-2.5">
            {cfg.freelance.map(r => (
              <div key={r.name} className="flex items-center gap-3">
                <div className="text-[11px] text-slate-400 w-40 shrink-0 text-right">{r.name}</div>
                <div className="flex-1 h-5 bg-bg3 rounded overflow-hidden">
                  <div className="h-full rounded flex items-center pl-2 text-[9px] font-bold text-white transition-all"
                    style={{width:`${r.score}%`, background:r.color}}>
                    {r.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk vs Demand scatter (CSS) */}
      <div className="card">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Matrice Demande vs Risque AI</div>
        <div className="relative bg-bg3 rounded-xl overflow-hidden" style={{height:200}}>
          {/* Quadrant labels */}
          <div className="absolute top-2 left-2 text-[9px] text-sfgreen font-semibold">⭐ IDÉAL — haute demande, faible risque</div>
          <div className="absolute bottom-2 left-2 text-[9px] text-sfred">⚠ Zone risquée</div>
          <div className="absolute top-2 right-2 text-[9px] text-slate-600">Faible demande, faible risque</div>
          {/* Axis lines */}
          <div className="absolute inset-0 border-b border-r border-b1" style={{bottom:'50%',right:'50%'}}/>
          {/* Bubbles */}
          {cfg.scatter.map(b => (
            <div key={b.name}
              className="absolute rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{
                width:b.size, height:b.size,
                background: b.color + 'cc',
                boxShadow: `0 0 12px ${b.color}60`,
                left: `${(b.demand - 65) / 40 * 80 + 5}%`,
                bottom: `${(100 - b.risk) / 100 * 85 + 5}%`,
                transform: 'translate(-50%, 50%)',
              }}>
              {b.name}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 mt-2 px-2">
          <span>← Faible demande</span>
          <span>Forte demande →</span>
        </div>
      </div>
    </div>
  )
}