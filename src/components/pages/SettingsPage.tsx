import { useState, useEffect } from 'react'
import { getApiKeys, saveApiKeys, clearCache } from '../../services/storage'

export default function SettingsPage() {
  const [keys, setKeys] = useState({ newsapi: '', github: '' })
  const [visible, setVisible] = useState({ newsapi: false, github: false })
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)

  useEffect(() => { setKeys(getApiKeys()) }, [])

  const handleSave = () => {
    saveApiKeys(keys)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    clearCache()
    setCleared(true)
    setTimeout(() => setCleared(false), 2000)
  }

  const API_INFO = [
    {
      key: 'newsapi' as const,
      label: 'NewsAPI.org',
      placeholder: 'ex: a1b2c3d4e5f6...',
      url: 'https://newsapi.org/register',
      desc: 'Actualités Salesforce, CRM, Agentforce depuis 80 000+ sources. Gratuit : 100 req/jour.',
      free: true,
    },
    {
      key: 'github' as const,
      label: 'GitHub Personal Access Token',
      placeholder: 'ghp_xxxxxxxxxxxx',
      url: 'https://github.com/settings/tokens',
      desc: 'Augmente la limite API de 60 à 5 000 req/h. Accès public repos uniquement. Optionnel.',
      free: true,
    },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <div className="section-title">API & Paramètres</div>
        <div className="section-sub">Configure les clés API pour activer les données live</div>
      </div>

      {/* Info banner */}
      <div className="card border-sfamber/20" style={{borderLeftWidth:3,borderLeftColor:'#f59e0b'}}>
        <div className="flex gap-3">
          <span className="text-sfamber text-lg shrink-0">ℹ</span>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Sans clés API</strong> : l'app fonctionne avec les données statiques intégrées — toutes les pages sont utilisables.<br/>
            <strong className="text-slate-300">Avec clés API</strong> : le bouton "Sync" récupère les actualités live, les repos GitHub trending et les offres d'emploi récentes.
            <br/><strong className="text-sfamber">Les clés sont stockées localement dans ton navigateur</strong> — elles ne quittent jamais ta machine.
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="space-y-4">
        {API_INFO.map(api => (
          <div key={api.key} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-bold text-slate-200">{api.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{api.desc}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {api.free && <span className="badge badge-green">Gratuit</span>}
                <a href={api.url} target="_blank" rel="noreferrer" className="text-[11px] text-sfblue hover:underline">Obtenir →</a>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type={visible[api.key] ? 'text' : 'password'}
                value={keys[api.key]}
                onChange={e => setKeys(prev => ({...prev, [api.key]: e.target.value}))}
                placeholder={api.placeholder}
                className="input-field font-mono"
              />
              <button
                onClick={() => setVisible(prev => ({...prev, [api.key]: !prev[api.key]}))}
                className="btn btn-ghost px-3 shrink-0">
                {visible[api.key] ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave}
          className="btn flex-1 font-semibold transition-all"
          style={{
            background: saved ? '#10b98120' : '#00a3e015',
            color: saved ? '#10b981' : '#00a3e0',
            borderColor: saved ? '#10b98130' : '#00a3e030',
            border: '1px solid',
          }}>
          {saved ? '✓ Clés sauvegardées' : 'Sauvegarder les clés API'}
        </button>
      </div>

      {/* Cache */}
      <div className="card">
        <div className="text-sm font-bold text-slate-200 mb-2">Gestion du cache</div>
        <div className="text-[11px] text-slate-500 mb-4 leading-relaxed">
          Le cache localStorage stocke les actualités, offres d'emploi et repos GitHub récupérés lors du dernier sync.
          Nettoie-le pour forcer un refresh complet au prochain sync.
        </div>
        <button onClick={handleClear}
          className="btn"
          style={{background:cleared?'#10b98120':'#ef444415',color:cleared?'#10b981':'#ef4444',border:'1px solid',borderColor:cleared?'#10b98130':'#ef444430'}}>
          {cleared ? '✓ Cache nettoyé' : 'Nettoyer le cache'}
        </button>
      </div>

      {/* Plateformes de sync */}
      <div className="card">
        <div className="text-sm font-bold text-slate-200 mb-3">Sources de données activées</div>
        <div className="space-y-2">
          {[
            { name:'Salesforce Blog RSS', status:'✓ Actif', desc:'Officiel — aucune clé requise', color:'#10b981' },
            { name:'NewsAPI.org', status: keys.newsapi ? '✓ Configuré' : '○ Clé manquante', desc:'Actualités SF, CRM, HubSpot', color: keys.newsapi ? '#10b981' : '#64748b' },
            { name:'GitHub API', status: keys.github ? '✓ Token configuré' : '○ Mode public (60 req/h)', desc:'Repos trending Salesforce', color: keys.github ? '#10b981' : '#f59e0b' },
            { name:'Offres emploi (statiques)', status:'✓ Intégrées', desc:'10 offres Maroc + EU — mises à jour manuellement', color:'#10b981' },
            { name:'Stack Overflow Trends', status:'✓ Sans clé', desc:'Questions SF trending', color:'#10b981' },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-3 p-2.5 bg-bg3 rounded-lg">
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-200">{s.name}</div>
                <div className="text-[10px] text-slate-500">{s.desc}</div>
              </div>
              <span className="text-[11px] font-bold" style={{color:s.color}}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="text-sm font-bold text-slate-200 mb-3">À propos — CRM Brain</div>
        <div className="space-y-1 text-[11px] text-slate-500">
          <div>App : <span className="text-slate-300">CRM Brain v1.0.0</span></div>
          <div>Stack : <span className="text-slate-300">React + TypeScript + Vite + Tailwind + Zustand + Recharts</span></div>
          <div>Storage : <span className="text-slate-300">localStorage (progression, notes, cache, clés API)</span></div>
          <div>Auteur : <span className="text-slate-300">Abdessamad Abounouh — EMSI 5IIR Casablanca</span></div>
          <div>Sources données : <span className="text-slate-300">IDC · Gartner · Fortune BI · ZipRecruiter · Salesforce IR</span></div>
          <div>Données marché : <span className="text-slate-300">Q3 2026</span></div>
          <div className="pt-2 text-[10px] text-slate-600">
            💡 Pour wrapper cette app en .exe Windows avec Electron, lance : <code className="font-mono bg-bg3 px-1.5 py-0.5 rounded">npm install electron electron-builder && npx electron-builder</code>
          </div>
        </div>
      </div>
    </div>
  )
}
