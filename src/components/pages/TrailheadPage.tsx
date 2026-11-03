import { useState } from 'react'
import { SF_ROLES, PHONE_TRAILS } from '../../data'
import { useStore } from '../../store/useStore'
import type { TrailStatus } from '../../types'

const TYPE_COLOR: Record<string,string> = {
  'Trail':'#00a3e0','Module':'#64748b','Superbadge ★':'#f59e0b',
  'Status Trail ★':'#8b5cf6','Project':'#10b981','Cert':'#ef4444'
}

function TrailRow({ name, note, type, time, phoneOnly, url }: {
  name:string; note:string; type:string; time?:string; phoneOnly?:boolean; url?:string
}) {
  const { progress, updateProgress } = useStore()
  const status = progress.find(p=>p.trail_name===name)?.status
  const next = status==='not_started'?'in_progress':status==='in_progress'?'completed':'not_started'
  const s = status==='completed'?{icon:'✓',c:'#10b981',bg:'#10b98115',bc:'#10b98140'}
    :status==='in_progress'?{icon:'◐',c:'#f59e0b',bg:'#f59e0b15',bc:'#f59e0b40'}
    :{icon:'○',c:'#64748b',bg:'#64748b10',bc:'#64748b30'}
  const color = TYPE_COLOR[type]||'#64748b'
  const sup = type.includes('Superbadge')||type.includes('Status')

  return (
    <div onClick={()=>updateProgress(name, next as TrailStatus, next==='completed'?100:next==='in_progress'?50:0)}
      className="card-sm p-6 flex items-start gap-4 cursor-pointer transition-colors"
      style={{background:status==='completed'?'#10b98108':status==='in_progress'?'#f59e0b08':'',borderLeftWidth:4,borderLeftColor:color}}>
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5 border-2"
        style={{background:s.bg,color:s.c,borderColor:s.bc}}>{s.icon}</button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-semibold" style={{color:sup?'#f59e0b':'#e2e8f0'}}>{name}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded"
            style={{background:color+'20',color}}>{type}</span>
          {phoneOnly&&<span className="text-[11px] px-1.5 rounded" style={{background:'#10b98115',color:'#10b981'}}>📱</span>}
        </div>
        <div className="text-sm text-slate-500 mt-1 leading-snug">{note}</div>
      </div>
      {time&&<span className="text-sm text-slate-600 shrink-0 mt-1">{time}</span>}
      {url&&<a href={url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-sm text-sfblue hover:underline shrink-0 mt-1">→</a>}
    </div>
  )
}

export default function TrailheadPage() {
  const { progress } = useStore()
  const [roleId, setRoleId] = useState('admin')
  const role = SF_ROLES.find(r=>r.id===roleId)!

  const st = (name:string) => progress.find(p=>p.trail_name===name)?.status || 'not_started'
  const total = role.trails.length + PHONE_TRAILS.length
  const completed = role.trails.filter(t=>st(t.name)==='completed').length
    + PHONE_TRAILS.filter(m=>st(m.name)==='completed').length
  const inProg = role.trails.filter(t=>st(t.name)==='in_progress').length
    + PHONE_TRAILS.filter(m=>st(m.name)==='in_progress').length
  const pct = Math.round((completed/total)*100)

  return (
    <div className="space-y-4">
      <div><div className="section-title">Trailhead</div><div className="section-sub">Tous tes parcours et modules en un seul endroit · clique sur un élément pour changer son statut</div></div>

      <div className="flex gap-2 flex-wrap">
        {SF_ROLES.map(r=>(
          <button key={r.id} onClick={()=>setRoleId(r.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={{background:roleId===r.id?r.color:'#0f1e38',color:roleId===r.id?'#fff':'#94a3b8',borderColor:'#1e3356'}}>
            {r.icon} {r.name.split(' ').slice(0,2).join(' ')}
          </button>
        ))}
      </div>

      <div className="card">
        {/* Header: progression globale du rôle */}
        <div className="flex items-center gap-3 pb-3 mb-2 border-b border-b1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background:role.color+'15'}}>{role.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-sm font-bold text-slate-200">{role.name}</span>
              <span className="text-sm font-bold tabular-nums" style={{color:role.color}}>{pct}%</span>
            </div>
            <div className="prog-bar mt-1.5"><div className="prog-fill" style={{width:`${pct}%`,background:role.color}}/></div>
            <div className="flex gap-4 mt-1.5 text-[11px] text-slate-500">
              <span><span style={{color:'#10b981'}}>✓ {completed}</span> complétés</span>
              <span><span style={{color:'#f59e0b'}}>◐ {inProg}</span> en cours</span>
              <span>○ {total-completed-inProg} restants</span>
            </div>
          </div>
        </div>

        {/* Liste unique : trails du rôle + modules mobiles */}
        <div className="space-y-2">
          {role.trails.map((t,i)=>(
            <TrailRow key={i} name={t.name} note={t.note} type={t.type} url={t.url} phoneOnly={t.phoneOnly}/>
          ))}
          <div className="flex items-center gap-3 pt-3 pb-1">
            <span className="text-xs font-bold text-slate-100">📱 Modules 100% Mobile</span>
            <div className="flex-1 h-px bg-b1"/>
            <span className="text-[10px] text-slate-500">Quiz uniquement</span>
          </div>
          {PHONE_TRAILS.map((m,i)=>(
            <TrailRow key={`p-${i}`} name={m.name} note={m.note} type="Module" time={m.time}/>
          ))}
        </div>
      </div>
    </div>
  )
}