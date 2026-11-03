import { GEO_DATA } from '../../data'
import { CAREER_GEO, rolesForCareer, careerById } from '../../data/careers'
import { useStore } from '../../store/useStore'
import { useState } from 'react'

export default function GeoPage() {
  const { selectedCareer } = useStore()
  const [roleId, setRoleId] = useState('')
  const career = careerById(selectedCareer)
  const roles = rolesForCareer(selectedCareer)
  const role = roles.find(r => r.id === roleId) || roles[0]
  const spot = CAREER_GEO[selectedCareer] || CAREER_GEO.salesforce

  return (
    <div className="space-y-4">
      <div><div className="section-title">Géographie & Salaires</div><div className="section-sub">Comparaison par pays — salaires salarié et taux freelance par rôle · {career.name}</div></div>
      <div className="flex gap-2 flex-wrap">
        {roles.map(r => (
          <button key={r.id} onClick={() => setRoleId(r.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={{background:roleId===r.id?r.color:'#0f1e38',color:roleId===r.id?'#fff':'#94a3b8',borderColor:'#1e3356'}}>
            {r.icon} {r.name.split(' ').slice(0,2).join(' ')}
          </button>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-4">Salaires & Taux — {role.name}</div>
        <table className="data-table w-full">
          <thead><tr><th>Pays</th><th>Contexte</th><th>Salarié / An</th><th>Freelance / Jour</th><th>Demande</th><th>Notes</th></tr></thead>
          <tbody>
            {GEO_DATA.map((g,i) => (
              <tr key={i}>
                <td><span className="text-xl mr-2">{g.flag}</span><span className="font-semibold text-slate-200">{g.country}</span></td>
                <td className="text-slate-500 text-[11px]">{g.context}</td>
                <td className="font-bold text-sfamber tabular-nums">{g.salary}</td>
                <td className="font-bold text-sfgreen tabular-nums">{g.freelance}</td>
                <td className="text-sfamber">{g.demand}</td>
                <td className="text-[11px] text-slate-500 max-w-xs">{g.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card" style={{borderColor:'#f59e0b30',borderLeftWidth:3,borderLeftColor:'#f59e0b'}}>
          <div className="text-sm font-bold text-sfamber mb-3">{spot.marocTitle}</div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{spot.marocBlurb}</p>
          <div className="space-y-2">
            {spot.bars.map(r=>(
              <div key={r.l} className="flex items-center gap-3">
                <div className="text-[11px] text-slate-400 w-32 shrink-0">{r.l}</div>
                <div className="flex-1 h-4 bg-bg3 rounded overflow-hidden">
                  <div className="h-full rounded flex items-center pl-2 text-[9px] font-bold text-white" style={{width:`${r.p}%`,background:'#f59e0b'}}>{r.v}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-bg3 rounded-lg text-[11px] text-slate-400 leading-relaxed">
            {spot.tip}
          </div>
        </div>
        <div className="card" style={{borderLeftWidth:3,borderLeftColor:career.color}}>
          <div className="text-sm font-bold mb-3" style={{color:career.color}}>🌐 Remote depuis Maroc → Europe</div>
          <div className="space-y-2">
            {spot.remote.map(r=>(
              <div key={r.c} className="flex items-center gap-3 p-2 bg-bg3 rounded-lg">
                <span className="text-xl">{r.f}</span>
                <div className="flex-1"><div className="text-xs font-bold text-slate-200">{r.c}</div><div className="text-[10px] text-slate-500">{r.n}</div></div>
                <div className="text-xs font-bold text-sfamber tabular-nums">{r.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}