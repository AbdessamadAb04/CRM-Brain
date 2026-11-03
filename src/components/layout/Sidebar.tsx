import { useStore } from '../../store/useStore'
import { CAREERS } from '../../data/careers'

const NAV = [
    { id: 'overview', group: 'Vue d\'ensemble', items: [
    { id: 'market', icon: '◎', label: 'Accueil' },
    { id: 'dashboard', icon: '◈', label: 'Analytiques' },
    { id: 'events', icon: '◉', label: 'Événements', badge: 'LIVE' },
  ]},
  { id: 'careers', group: 'Carrières', items: [
    { id: 'roles', icon: '◐', label: 'Rôles & Postes' },
    { id: 'geo', icon: '◑', label: 'Géographie' },
    { id: 'freelance', icon: '◒', label: 'Freelance' },
    { id: 'compare', icon: '▤', label: 'Comparaison' },
  ]},
  { id: 'formation', group: 'Formation', items: [
    { id: 'trailhead', icon: '◓', label: 'Trailhead' },
    { id: 'certs', icon: '▣', label: 'Certifications' },
  ]},
  { id: 'system', group: 'Système', items: [
    { id: 'settings', icon: '⚙', label: 'API & Paramètres' },
  ]},
]

export default function Sidebar() {
  const { activeTab, setTab, sidebarCollapsed, selectedCareer, setCareer } = useStore()
  const w = sidebarCollapsed ? 52 : 220

  return (
    <aside className="flex flex-col bg-bg2 border-r border-b1 shrink-0 transition-all duration-200" style={{ width: w }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-b1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
          style={{ background: 'linear-gradient(135deg,#00a3e0,#8b5cf6)', color: '#fff' }}>
          🧠
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="text-xs font-black text-slate-100 leading-tight tracking-wide">CRM Brain</div>
            <div className="text-[10px] text-slate-500">Salesforce Intelligence</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-6">
        {NAV.map(g => (
          <div key={g.id}>
            {!sidebarCollapsed && (
              <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-2 mb-1">{g.group}</div>
            )}
            {g.id === 'careers' && !sidebarCollapsed && (
              <div className="px-2 pb-2">
                <select value={selectedCareer} onChange={e => setCareer(e.target.value)}
                  className="w-full bg-bg3 border border-b1 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 outline-none focus:border-sfblue/50 cursor-pointer"
                  title="Choisis la plateforme CRM">
                  {CAREERS.map(c => (
                    <option key={c.id} value={c.id} className="bg-bg2">{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-0">
              {g.items.map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}>
                  <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: '#10b981', color: '#fff' }}>{item.badge}</span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="px-3 py-3 border-t border-b1">
          <div className="text-[9px] text-slate-600">Données Q3 2026</div>
          <div className="text-[9px] text-slate-600">IDC · Gartner · ZipRecruiter</div>
        </div>
      )}
    </aside>
  )
}
