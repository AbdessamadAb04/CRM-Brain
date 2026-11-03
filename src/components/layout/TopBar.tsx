import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { syncAll } from '../../services/api'
import { getApiKeys } from '../../services/storage'

const TITLES: Record<string, string> = {
  dashboard: 'Analytiques', market: 'Accueil', events: 'Événements & Actualités',
  roles: 'Rôles & Postes', geo: 'Géographie & Salaires', freelance: 'Opportunités Freelance',
  trailhead: 'Trailhead Learning Paths', certs: 'Certifications', compare: 'Comparaison',
  settings: 'API & Paramètres',
}

export default function TopBar() {
  const { activeTab, toggleSidebar, isSyncing, syncLog, lastSync,
          setSyncing, addLog, clearLog, setLastSync, setNews, setJobs, setRepos } = useStore()
  const [showLog, setShowLog] = useState(false)

  const d = new Date()
  const dateLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

  const handleSync = async () => {
    if (isSyncing) return
    setSyncing(true)
    clearLog()
    const keys = getApiKeys()
    try {
      const result = await syncAll(keys.newsapi, keys.github, (msg) => addLog(msg))
      setNews(result.news)
      setJobs(result.jobs)
      setRepos(result.repos)
      setLastSync(new Date().toISOString())
    } catch {
      addLog('❌ Erreur inattendue')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <header className="h-16 flex items-center gap-3 px-5 bg-bg2 border-b border-b1 shrink-0 relative">
      <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-200 text-lg leading-none transition-colors">☰</button>
      <div className="text-sm font-bold text-slate-200">{TITLES[activeTab] || activeTab}</div>

      <div className="absolute left-1/2 -translate-x-1/2 h-7 flex items-center px-3 rounded-lg border border-b1 text-sm font-semibold text-slate-300 whitespace-nowrap">
        {dateLabel}
      </div>

      <div className="flex-1" />

      {/* Last sync */}
      {lastSync && !isSyncing && (
        <div className="text-[10px] text-slate-600">
          Sync {new Date(lastSync).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* Sync log */}
      {syncLog.length > 0 && (
        <div className="relative">
          <button onClick={() => setShowLog(v => !v)}
            className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors">
            {syncLog[syncLog.length - 1]}
          </button>
          {showLog && (
            <div className="absolute top-8 right-0 z-50 bg-bg3 border border-b2 rounded-lg p-3 min-w-64 shadow-2xl">
              {syncLog.map((l, i) => <div key={i} className="text-[11px] text-slate-300 py-0.5">{l}</div>)}
            </div>
          )}
        </div>
      )}

      {/* Sync button */}
      <button onClick={handleSync} disabled={isSyncing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
        style={{
          background: isSyncing ? '#162240' : '#00a3e012',
          color: isSyncing ? '#64748b' : '#00a3e0',
          borderColor: '#00a3e030',
          cursor: isSyncing ? 'not-allowed' : 'pointer',
        }}>
        <span style={{ display: 'inline-block', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
        {isSyncing ? 'Sync...' : 'Sync'}
      </button>

      {/* Live dot */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-sfgreen animate-pulse" />
        Oct 2026
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </header>
  )
}
