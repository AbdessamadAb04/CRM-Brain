import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { MARKET_GROWTH, SF_REVENUE } from '../../data'

const TT = { contentStyle:{background:'#0f1e38',border:'1px solid #1e3356',borderRadius:6}, labelStyle:{color:'#e2e8f0'} }

const EVENTS = [
  { date:'Oct 2024', title:'Lancement Agentforce', desc:'$500M ARR en 6 mois — ramp le plus rapide de l\'histoire SF', color:'#f59e0b' },
  { date:'Avr 2026', title:'HubSpot MCP Server GA', desc:'Claude et GPT lisent/écrivent HubSpot nativement. Disruption workflow consultant.', color:'#00a3e0' },
  { date:'Août 2025', title:'SF Enterprise License +6%', desc:'Hausse tarifaire accélère migration PMEs vers HubSpot. HubSpot : +23% Q1 2026.', color:'#ef4444' },
  { date:'2025', title:'Support Workforce -44%', desc:'9,000 → 5,000 employés support. Agentforce gère 380K interactions/mois.', color:'#8b5cf6' },
]

const SEGMENTS = [
  { name:'Customer Service', share:22.5, growth:14, color:'#00a3e0' },
  { name:'Sales Automation', share:20, growth:13, color:'#8b5cf6' },
  { name:'Marketing CRM', share:18, growth:11, color:'#10b981' },
  { name:'CRM Analytics', share:15, growth:18, color:'#f59e0b' },
  { name:'SMB CRM', share:12, growth:22, color:'#ef4444' },
]

export default function MarketPage() {
  return (
    <div className="space-y-4">
      <div><div className="section-title">Marché CRM Global</div><div className="section-sub">Données financières, croissance et dynamiques sectorielles — 2026</div></div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { l:'CRM Market 2026', v:'$126.2B', d:'+12.4%', c:'#00a3e0', s:'Fortune BI' },
          { l:'Prévision 2030', v:'$200B+', d:'CAGR 12.4%', c:'#10b981', s:'Fortune BI' },
          { l:'AI in CRM 2025', v:'$11B', d:'→$48B en 2033', c:'#8b5cf6', s:'Research firms' },
          { l:'HubSpot Q1 2026', v:'+23%', d:'YoY revenue', c:'#ef4444', s:'HubSpot IR' },
        ].map(s => (
          <div key={s.l} className="card-sm">
            <div className="text-[10px] text-slate-500 mb-1">{s.l}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{color:s.c}}>{s.v}</div>
            <div className="text-[11px] text-sfgreen mt-1">▲ {s.d}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">{s.s}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Projections 2020–2034 ($B)</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={MARKET_GROWTH}>
              <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00a3e0" stopOpacity={0.3}/><stop offset="95%" stopColor="#00a3e0" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3356"/>
              <XAxis dataKey="year" tick={{fill:'#64748b',fontSize:9}}/>
              <YAxis tick={{fill:'#64748b',fontSize:9}}/>
              <Tooltip {...TT} formatter={(v:number) => [`$${v}B`,'']}/>
              <Area type="monotone" dataKey="value" stroke="#00a3e0" fill="url(#mg)" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Segments — Part & Croissance</div>
          <div className="space-y-2.5">
            {SEGMENTS.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="text-[11px] text-slate-300 w-32 shrink-0">{s.name}</div>
                <div className="flex-1 h-4 bg-bg3 rounded overflow-hidden">
                  <div className="h-full rounded flex items-center pl-1.5 text-[9px] font-bold text-white"
                    style={{width:`${(s.share/25)*100}%`, background:s.color}}>{s.share}%</div>
                </div>
                <div className="text-[11px] tabular-nums text-sfgreen">+{s.growth}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Salesforce Revenue FY21–FY26e ($B)</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={SF_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3356"/>
            <XAxis dataKey="year" tick={{fill:'#64748b',fontSize:10}}/>
            <YAxis tick={{fill:'#64748b',fontSize:10}} domain={[0,50]}/>
            <Tooltip {...TT} formatter={(v:number) => [`$${v}B`,'Revenue']}/>
            <Bar dataKey="value" fill="#f59e0b" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-3">Événements majeurs 2025–2026</div>
        <div className="grid grid-cols-2 gap-3">
          {EVENTS.map(e => (
            <div key={e.title} className="bg-bg3 rounded-lg p-3 border-l-2" style={{borderColor:e.color}}>
              <div className="text-[10px] text-slate-500 mb-1">{e.date}</div>
              <div className="text-xs font-bold text-slate-100 mb-1">{e.title}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{e.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
