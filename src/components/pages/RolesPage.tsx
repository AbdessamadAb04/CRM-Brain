import { useState } from 'react'
import { rolesForCareer, careerById } from '../../data/careers'
import { useStore } from '../../store/useStore'
import { getNotes, saveNote } from '../../services/storage'
import type { SFRole, TrailStatus } from '../../types'

const TYPE_COLOR: Record<string,string> = {
  'Trail':'#00a3e0','Module':'#64748b','Superbadge ★':'#f59e0b',
  'Status Trail ★':'#8b5cf6','Project':'#10b981','Cert':'#ef4444'
}

function StatusBtn({ name }: { name:string }) {
  const { progress, updateProgress } = useStore()
  const prog = progress.find(p => p.trail_name === name)
  const status = prog?.status || 'not_started'
  const cycle = () => {
    const next = status==='not_started'?'in_progress':status==='in_progress'?'completed':'not_started'
    updateProgress(name, next as TrailStatus, next==='completed'?100:next==='in_progress'?50:0)
  }
  const s = status==='completed'?{icon:'✓',c:'#10b981',bg:'#10b98115',bc:'#10b98140'}
           :status==='in_progress'?{icon:'◐',c:'#f59e0b',bg:'#f59e0b15',bc:'#f59e0b40'}
           :{icon:'○',c:'#64748b',bg:'#64748b10',bc:'#64748b30'}
  return (
    <button onClick={cycle} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border transition-all"
      style={{background:s.bg,color:s.c,borderColor:s.bc}}>{s.icon}</button>
  )
}

function RoleDetail({ role }: { role:SFRole }) {
  const [tab, setTab] = useState<'overview'|'trails'|'geo'|'notes'>('overview')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState(() => getNotes(role.id))
  const { progress } = useStore()

  const completed = role.trails.filter(t => progress.find(p=>p.trail_name===t.name)?.status==='completed').length
  const pct = Math.round((completed/role.trails.length)*100)

  const handleAddNote = () => {
    if (!note.trim()) return
    saveNote(role.id, note.trim())
    setNotes(getNotes(role.id))
    setNote('')
  }

  const tabs = [['overview','Vue d\'ensemble'],['trails','Trailhead'],['geo','Salaires'],['notes','Notes']] as const

  return (
    <div className="card border-l-2 h-full overflow-y-auto" style={{borderColor:role.color}}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-b1">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{background:role.color+'15'}}>
          {role.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-extrabold" style={{color:role.color}}>{role.name}</div>
          <div className="text-[11px] text-slate-500">{role.level}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold tabular-nums" style={{color:role.color}}>{role.freelanceUS}</div>
          <div className="text-[10px] text-slate-600">freelance US</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all border"
            style={{background:tab===id?role.color:'#0f1e38',color:tab===id?'#fff':'#94a3b8',borderColor:'#1e3356'}}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <p className="text-[11px] text-slate-400 leading-relaxed">{role.desc}</p>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">🏆 Certifications</div>
            {role.certs.map(c => (
              <div key={c} className="bg-bg3 rounded-lg px-3 py-2 flex items-center gap-2 mb-1.5">
                <span className="text-sfamber text-xs">★</span>
                <span className="text-xs font-semibold text-slate-200">{c}</span>
                <span className="ml-auto text-[10px] text-sfamber font-bold">Obligatoire</span>
              </div>
            ))}
            {role.certsOptional.map(c => (
              <div key={c} className="bg-bg3/50 rounded-lg px-3 py-2 flex items-center gap-2 mb-1.5 opacity-60">
                <span className="text-slate-500 text-xs">◇</span>
                <span className="text-xs text-slate-400">{c}</span>
                <span className="ml-auto text-[10px] text-slate-500">Recommandé</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">🎯 Compétences clés</div>
            <div className="flex flex-wrap gap-1.5">
              {role.skills.map(s => (
                <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded" style={{background:role.color+'15',color:role.color}}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">📋 Expérience</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{role.experience}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-bg3 rounded-lg p-3">
              <div className="text-[10px] text-slate-600 mb-1">Risque AI</div>
              <div className="text-[11px] text-slate-400">{role.aiRisk}</div>
            </div>
            <div className="bg-bg3 rounded-lg p-3">
              <div className="text-[10px] text-slate-600 mb-1">Croissance</div>
              <div className="text-[11px] text-slate-400">{role.growth}</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'trails' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 mb-3 p-2.5 bg-bg3 rounded-lg">
            <div className="prog-bar flex-1"><div className="prog-fill" style={{width:`${pct}%`,background:role.color}}/></div>
            <span className="text-xs font-bold tabular-nums" style={{color:role.color}}>{pct}%</span>
            <span className="text-[11px] text-slate-500">{completed}/{role.trails.length}</span>
          </div>
          {role.trails.map((t,i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 bg-bg3 rounded-lg hover:bg-bg4 transition-colors">
              <StatusBtn name={t.name}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-200">{t.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{background:(TYPE_COLOR[t.type]||'#64748b')+'20',color:TYPE_COLOR[t.type]||'#64748b'}}>{t.type}</span>
                  {t.phoneOnly && <span className="text-[9px] px-1 rounded" style={{background:'#10b98115',color:'#10b981'}}>📱</span>}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.note}</div>
              </div>
              {t.url && <a href={t.url} target="_blank" rel="noreferrer" className="text-[10px] text-sfblue hover:underline shrink-0">→</a>}
            </div>
          ))}
        </div>
      )}

      {tab === 'geo' && (
        <table className="data-table w-full">
          <thead><tr><th>Région</th><th>Salarié/an</th><th>Freelance/jour</th></tr></thead>
          <tbody>
            {[
              {f:'🇺🇸',r:'USA',s:role.salaryUS,fl:role.freelanceUS},
              {f:'🇫🇷',r:'France',s:role.salaryFR,fl:role.freelanceEU},
              {f:'🇩🇪',r:'Allemagne',s:role.salaryDE,fl:role.freelanceEU},
              {f:'🇨🇭',r:'Suisse',s:role.salaryCH,fl:role.freelanceEU},
              {f:'🇲🇦',r:'Maroc CDI',s:role.salaryMaroc,fl:'EU remote ✓'},
            ].map(r => (
              <tr key={r.r}>
                <td><span className="mr-1">{r.f}</span>{r.r}</td>
                <td className="font-bold text-sfamber tabular-nums">{r.s}</td>
                <td className="font-bold text-sfgreen tabular-nums">{r.fl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'notes' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <textarea value={note} onChange={e=>setNote(e.target.value)}
              placeholder="Ajoute tes notes pour ce rôle..."
              className="textarea-field h-20"/>
          </div>
          <button onClick={handleAddNote} className="btn btn-blue w-full">Sauvegarder la note</button>
          <div className="space-y-2 mt-2">
            {notes.map(n => (
              <div key={n.id} className="bg-bg3 rounded-lg p-3">
                <div className="text-[11px] text-slate-300 leading-relaxed">{n.content}</div>
                <div className="text-[10px] text-slate-600 mt-1">{new Date(n.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            ))}
            {notes.length === 0 && <div className="text-[11px] text-slate-600 text-center py-4">Aucune note pour ce rôle</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RolesPage() {
  const { selectedRole, setRole, selectedCareer } = useStore()
  const career = careerById(selectedCareer)
  const roles = rolesForCareer(selectedCareer)
  const role = roles.find(r => r.id === selectedRole) || roles[0]

  return (
    <div className="space-y-4">
      <div><div className="section-title">Rôles & Postes {career.name}</div><div className="section-sub">Sélectionne un rôle — trails, salaires, notes personnelles</div></div>
      <div className="grid grid-cols-2 gap-4" style={{height:'calc(100vh - 200px)'}}>
        <div className="space-y-2 overflow-y-auto">
          {roles.map(r => (
            <div key={r.id} onClick={() => setRole(r.id)}
              className="card-sm cursor-pointer transition-all hover:-translate-y-0.5"
              style={{borderLeftWidth:3,borderLeftColor:r.color,background:selectedRole===r.id?r.color+'08':'',borderColor:selectedRole===r.id?r.color:'#1e3356'}}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{r.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-200">{r.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.level}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="prog-bar flex-1 max-w-20"><div className="prog-fill" style={{width:`${r.demand}%`,background:r.color}}/></div>
                    <span className="text-[10px] font-semibold" style={{color:r.color}}>{r.demandLabel}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold" style={{color:r.color}}>{r.freelanceUS}</div>
                  <div className="text-[10px] text-slate-600">US/h</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-y-auto">
          <RoleDetail role={role}/>
        </div>
      </div>
    </div>
  )
}
