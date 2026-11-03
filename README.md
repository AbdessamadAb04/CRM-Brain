# 🧠 CRM Brain — Salesforce Career Intelligence

Application web React pour analyser le marché Salesforce, suivre ta progression Trailhead et explorer les opportunités carrière et freelance.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
# → Ouvre http://localhost:3000
```

**C'est tout.** Zéro configuration Electron, zéro base de données externe.

---

## 📁 Structure du projet

```
crm-brain/
├── src/
│   ├── components/
│   │   ├── layout/        # Sidebar, TopBar
│   │   └── pages/         # Dashboard, Roles, Trailhead, Certs...
│   ├── data/
│   │   └── index.ts       # Données SF : rôles, certs, géo, charts
│   ├── services/
│   │   ├── storage.ts     # localStorage (notes, progression, cache)
│   │   └── api.ts         # NewsAPI, GitHub, RSS sync
│   ├── store/
│   │   └── useStore.ts    # Zustand state global
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🔑 Configuration APIs (optionnel)

L'app fonctionne sans clés. Pour les données live :

1. **NewsAPI** : compte gratuit sur newsapi.org/register (100 req/jour)
2. **GitHub Token** : github.com/settings/tokens (augmente les limites)

Configure les clés dans l'app : **Paramètres → API & Paramètres → Sauvegarder**

---

## 💾 Storage

Tout est en **localStorage** — aucune base de données :

| Donnée | Clé localStorage |
|--------|-----------------|
| Progression Trailhead | `crmbrain_progress` |
| Notes personnelles | `crmbrain_notes` |
| Clés API | `crmbrain_apikeys` |
| Cache actualités | `crmbrain_news` |
| Cache jobs | `crmbrain_jobs` |
| Cache GitHub repos | `crmbrain_repos` |

---

## 🖥️ Pages disponibles

| Page | Description |
|------|-------------|
| Dashboard | Stats marché, graphiques, salaires |
| Marché CRM | Croissance 2020–2034, segments, events |
| Événements | Actualités live + événements SF clés |
| Rôles & Postes | 6 rôles détaillés + notes + suivi trails |
| Géographie | Salaires par pays (Maroc, EU, USA) |
| Freelance | Services, plateformes, progression revenus |
| Trailhead | Suivi progression + modules mobile |
| Certifications | Toutes les certs SF avec détails exam |
| Comparaison | Matrices radar, scores, risque AI |
| Paramètres | Clés API, cache, about |

---

## 📦 Build production

```bash
npm run build
# → dossier dist/ prêt à déployer sur Netlify, Vercel, etc.
```

---

## 🖥️ Wrapper Electron (plus tard)

Quand tu veux transformer l'app en .exe Windows :

```bash
npm install --save-dev electron electron-builder concurrently wait-on
```

Puis ajoute `electron/main.js` et `electron/preload.js` — l'app React existante n'a pas besoin d'être modifiée.

---

**Stack** : React 18 · TypeScript · Vite · Tailwind CSS · Zustand · Recharts · Axios  
**Auteur** : Abdessamad Abounouh — EMSI 5IIR Casablanca  
**Données** : Q3 2026 — IDC · Gartner · Fortune BI · ZipRecruiter · Salesforce IR
