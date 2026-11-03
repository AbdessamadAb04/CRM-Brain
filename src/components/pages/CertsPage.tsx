import { useState } from 'react'
import { CERTIFICATIONS } from '../../data'
import type { Certification } from '../../types'

const TIERS = ['Entry','Associate','Consultant','Specialist','Expert']
const TIER_FR: Record<string,string> = {Entry:'Débutant',Associate:'Associate',Consultant:'Consultant',Specialist:'Spécialiste',Expert:'Expert'}

function CertDetail({ cert }: { cert: Certification }) {
  return (
    <div className="card border-l-2 sticky top-0" style={{borderColor:cert.color}}>
      <div className="text-base font-extrabold mb-1" style={{color:cert.color}}>{cert.name}</div>
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="badge badge-green">{cert.cost}</span>
        <span className="badge badge-blue">Score min : {cert.passing}</span>
        <span className="badge badge-amber">Valeur : {cert.value}</span>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{cert.desc}</p>
      <div className="space-y-0">
        {[
          ['Questions', cert.questions],
          ['Durée', cert.duration],
          ['Score minimum', cert.passing],
          ['Difficulté', cert.difficulty],
          ['Valeur marché', cert.value],
          ['Niveau', TIER_FR[cert.tier] || cert.tier],
        ].map(([l,v]) => (
          <div key={l} className="flex justify-between py-2 border-b border-b1 text-xs">
            <span className="text-slate-500">{l}</span>
            <span className="text-slate-200 font-semibold">{v}</span>
          </div>
        ))}
      </div>
      <a href={cert.examUrl} target="_blank" rel="noreferrer"
        className="mt-4 block w-full py-2 rounded-lg text-xs font-bold text-center transition-all hover:opacity-90"
        style={{background:cert.color,color:'#fff'}}>
        Voir sur Trailhead →
      </a>
    </div>
  )
}

export default function CertsPage() {
  const [selected, setSelected] = useState<string>(CERTIFICATIONS[0].name)
  const cert = CERTIFICATIONS.find(c => c.name === selected)!

  return (
    <div className="space-y-4">
      <div><div className="section-title">Certifications Salesforce</div><div className="section-sub">Toutes les certifications officielles — coût, difficulté et valeur marché</div></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {TIERS.map(tier => {
            const certs = CERTIFICATIONS.filter(c => c.tier === tier)
            if (!certs.length) return null
            return (
              <div key={tier}>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 px-1">{TIER_FR[tier]}</div>
                <div className="space-y-1.5">
                  {certs.map(c => (
                    <div key={c.name} onClick={() => setSelected(c.name)}
                      className="p-3 rounded-lg cursor-pointer transition-all border"
                      style={{
                        background: selected === c.name ? c.color + '08' : '#0b1629',
                        borderColor: selected === c.name ? c.color : '#1e3356',
                        borderLeftWidth: 3, borderLeftColor: c.color,
                      }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold" style={{color:c.color}}>{c.name}</div>
                        <span className="badge badge-green shrink-0">{c.cost}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-sfamber">{c.difficulty}</span>
                        <span className="text-[10px] text-slate-500">Min : {c.passing}</span>
                        <span className="text-[10px] text-slate-500">{c.questions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <CertDetail cert={cert} />
        </div>
      </div>
    </div>
  )
}
