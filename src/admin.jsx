import { useState } from 'react'
import DashboardPage from './pages/admin-db/dashboard'
import DatasetPage from './pages/admin-db/dataset'
import UserPage from './pages/admin-db/user'
import AiResponsePage from './pages/admin-db/ai-response'
import DatasetRetrievalPage from './pages/admin-db/dataset-retrieval'
import DatasetReleasePage from './pages/admin-db/dataset-release'

const navItems = [
  'Dashboard',
  'Dataset',
  'User Management',
  'AI Responses',
  'Dataset Retrieval',
  'Dataset Release',
]

function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 shrink-0 border-r border-surface bg-white/90 p-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex items-center gap-3 pb-8">
        <span className="grid h-9 w-9 place-content-center rounded-xl bg-primary text-sm font-bold text-white">B</span>
        <p className="text-lg font-semibold text-accent">FreshLens</p>
      </div>
      <nav className="space-y-2 text-sm text-accent/80">
        {navItems.map((item) => {
          const isActive = item === activeNav
          return (
            <button
              key={item}
              type="button"
              onClick={() => onNavChange(item)}
              className={`w-full rounded-xl px-4 py-2 text-left transition ${
                isActive ? 'bg-primary font-medium text-white' : 'hover:bg-surface'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-surface p-4">
        <p className="text-sm font-semibold text-accent">Emily Jonson</p>
        <p className="text-xs text-accent/70">jonson@bress.com</p>
      </div>
    </aside>
  )
}

function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  function handleNavChange(nextNav) {
    setActiveNav(nextNav)
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-accent">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-surface bg-white/95 text-accent shadow-[0_8px_20px_rgba(15,23,42,0.12)] backdrop-blur"
          aria-label="Open sidebar menu"
        >
          <span className="sr-only">Open menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 rounded-full bg-accent" />
            <span className="h-0.5 w-5 rounded-full bg-accent" />
            <span className="h-0.5 w-5 rounded-full bg-accent" />
          </span>
        </button>

        {isMobileSidebarOpen && (
          <>
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="fixed inset-0 z-40 bg-slate-900/40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-50 flex h-screen w-[85vw] max-w-xs flex-col border-r border-surface bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-2 pb-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-content-center rounded-xl bg-primary text-sm font-bold text-white">B</span>
                  <p className="text-lg font-semibold text-accent">FreshLens</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-lg border border-surface px-2.5 py-1.5 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
              <nav className="space-y-2 text-sm text-accent/80">
                {navItems.map((item) => {
                  const isActive = item === activeNav
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleNavChange(item)}
                      className={`w-full rounded-xl px-4 py-2 text-left transition ${
                        isActive ? 'bg-primary font-medium text-white' : 'hover:bg-surface'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  )
                })}
              </nav>
              <div className="mt-auto rounded-2xl bg-surface p-4">
                <p className="text-sm font-semibold text-accent">Emily Jonson</p>
                <p className="text-xs text-accent/70">jonson@bress.com</p>
              </div>
            </aside>
          </>
        )}
      </div>

      <div className="flex min-h-screen w-full gap-5">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

        <main className="flex-1 space-y-5 p-4 pt-20 sm:p-6 sm:pt-24 lg:ml-72 lg:p-8 lg:pt-8">
          <header className="rounded-3xl border border-surface bg-white/90 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="rounded-xl border border-surface bg-white px-3 py-2 font-medium text-accent">{activeNav}</p>
              <p className="rounded-xl bg-surface px-3 py-2 font-medium text-accent/80">Tuesday, 9th March</p>
            </div>
          </header>

          {activeNav === 'Dashboard' && <DashboardPage />}
          {activeNav === 'Dataset' && <DatasetPage />}
          {activeNav === 'User Management' && <UserPage />}
          {activeNav === 'AI Responses' && <AiResponsePage />}
          {activeNav === 'Dataset Retrieval' && <DatasetRetrievalPage />}
          {activeNav === 'Dataset Release' && <DatasetReleasePage />}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
