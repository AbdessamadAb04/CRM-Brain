import { useState } from 'react'
import { useStore } from '../../store/useStore'

const EVENTS = [
  { date:'Oct 2025', title:'Agentforce 360 — Dreamforce', desc:'Voice capabilities + Data 360 rebrand. 12,000 clients. $15B investissement Inde.', tags:['Agentforce','AI'], color:'#f59e0b', type:'critical' },
  { date:'Avr 2026', title:'HubSpot MCP Server GA', desc:'Claude et GPT-4o interagissent directement avec HubSpot. Révolution workflow consultant.', tags:['HubSpot','MCP'], color:'#00a3e0', type:'critical' },
  { date:'Q3 FY26', title:'Agentforce ARR : $1.4B', desc:'+114% YoY. 18,500 clients. Produit SF à la croissance la plus rapide de son histoire.', tags:['Finance','Record'], color:'#8b5cf6', type:'finance' },
  { date:'Août 2025', title:'SF Enterprise License +6%', desc:'Hausse tarifaire accélère migration PMEs vers HubSpot. HubSpot : +23% Q1 2026.', tags:['Pricing'], color:'#ef4444', type:'critical' },
  { date:'Déc 2025', title:'Blueprint ADM-201 mis à jour', desc:'Agentforce AI 8% (nouveau), Data & Analytics 17% (hausse). Process Builder retiré.', tags:['ADM-201','Cert'], color:'#10b981', type:'certification' },
  { date:'2026', title:'Agentblazer Status — Reset annuel', desc:'Champion → Innovator → Legend. Seul badge Trailhead annuel. Signal fort RH.', tags:['Trailhead','AI'], color:'#10b981', type:'certification' },
  { date:'2025', title:'SF Support Workforce -44%', desc:'9,000 → 5,000. Agentforce gère 380K+/mois. Crée nouveaux rôles design agents.', tags:['Jobs'], color:'#ef4444', type:'jobs' },
  { date:'2026', title:'NBS Consulting Maroc — Recrutement', desc:'60+ offres SF sur Indeed Maroc. NBS, Inetum, Devoteam Casa = cibles prioritaires.', tags:['Maroc','Emploi'], color:'#f59e0b', type:'jobs' },
]

const FILTERS = ['Tous','critical','finance','certification','jobs']

export default function EventsPage() {
  const { news } = useStore()
  const [filter, setFilter] = useState('Tous')
  const filtered = filter === 'Tous' ? EVENTS : EVENTS.filter(e => e.type === filter)

  return (
    <div className="space-y-4">
      <div><div className="section-title">Événements & Actualités</div><div className="section-sub">Derniers développements Salesforce, CRM et IA — 2025–2026</div></div>

      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize border"
            style={{ background:filter===f?'#00a3e0':'#0f1e38', color:filter===f?'#fff':'#94a3b8', borderColor:'#1e3356' }}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Événements clés</div>
          {filtered.map((e,i) => (
            <div key={i} className="card-sm border-l-2" style={{borderColor:e.color}}>
              <div className="flex gap-3">
                <div className="text-[10px] text-slate-500 font-mono w-16 shrink-0 pt-0.5">{e.date}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-100 mb-1">{e.title}</div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mb-1.5">{e.desc}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {e.tags.map(t => <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{background:e.color+'20',color:e.color}}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Agenda — À venir</div>
            {[
              { date:'Sept–Oct 2026', title:'Dreamforce 2026', desc:'San Francisco — annonces Agentforce majeures attendues', color:'#f59e0b' },
              { date:'Q1 2027', title:'Reset Agentblazer 2027', desc:'Renouveler Champion avant expiration du cycle annuel', color:'#8b5cf6' },
              { date:'Hiver 2026', title:'SF Winter \'27 Release', desc:'Nouvelles features Agentforce + maintenance certs requise', color:'#10b981' },
            ].map((u,i) => (
              <div key={i} className="bg-bg3 rounded-lg p-3 border-l-2 mb-2" style={{borderColor:u.color}}>
                <div className="text-[10px] text-slate-500 mb-1">{u.date}</div>
                <div className="text-xs font-bold text-slate-100 mb-1">{u.title}</div>
                <div className="text-[11px] text-slate-400">{u.desc}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              Actualités Live {news.length > 0 && <span className="text-sfgreen">({news.length})</span>}
            </div>
            {news.length === 0 ? (
              <div className="card-sm text-center py-8">
                <div className="text-3xl mb-2">📡</div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Aucune actualité chargée</div>
                <div className="text-[11px] text-slate-600">Configure ta clé NewsAPI dans Paramètres → Sync</div>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {news.slice(0,15).map((n,i) => (
                  <a key={i} href={n.url} target="_blank" rel="noreferrer"
                    className="block bg-bg3 rounded-lg p-2.5 hover:bg-bg4 transition-colors cursor-pointer">
                    <div className="text-xs font-semibold text-slate-200 leading-tight mb-1">{n.title}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{background:'#00a3e015',color:'#00a3e0'}}>{n.category}</span>
                      <span className="text-[10px] text-slate-500">{n.source}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
