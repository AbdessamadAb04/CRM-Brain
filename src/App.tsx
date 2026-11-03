import { useEffect, lazy, Suspense } from 'react'
import { useStore } from './store/useStore'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'

const Dashboard     = lazy(() => import('./components/pages/Dashboard'))
const MarketPage    = lazy(() => import('./components/pages/MarketPage'))
const EventsPage    = lazy(() => import('./components/pages/EventsPage'))
const RolesPage     = lazy(() => import('./components/pages/RolesPage'))
const GeoPage       = lazy(() => import('./components/pages/GeoPage'))
const FreelancePage = lazy(() => import('./components/pages/FreelancePage'))
const TrailheadPage = lazy(() => import('./components/pages/TrailheadPage'))
const CertsPage     = lazy(() => import('./components/pages/CertsPage'))
const ComparePage   = lazy(() => import('./components/pages/ComparePage'))
const SettingsPage  = lazy(() => import('./components/pages/SettingsPage'))

const PAGES: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  dashboard: Dashboard, market: MarketPage, events: EventsPage,
  roles: RolesPage, geo: GeoPage, freelance: FreelancePage,
  trailhead: TrailheadPage, certs: CertsPage, compare: ComparePage, settings: SettingsPage,
}

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-slate-500 text-sm">Chargement...</div>
    </div>
  )
}

export default function App() {
  const { activeTab, loadAll } = useStore()
  useEffect(() => { loadAll() }, [])
  const Page = PAGES[activeTab] ?? Dashboard

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg1">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-5">
          <Suspense fallback={<Spinner />}>
            <Page />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
