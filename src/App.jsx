import { Bell, CircleHelp, Package, ShoppingCart, Users } from 'lucide-react'
import Sidebar from './components/Sidebar'

const stats = [
  { label: 'Revenue', value: '$24,780', icon: CircleHelp, color: 'text-blue-600' },
  { label: 'Orders', value: '1,284', icon: ShoppingCart, color: 'text-violet-600' },
  { label: 'Products', value: '856', icon: Package, color: 'text-amber-600' },
  { label: 'Customers', value: '3,642', icon: Users, color: 'text-emerald-600' },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Overview</p>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Help"
              className="rounded-xl bg-white p-3 text-slate-600 shadow-sm"
            >
              <CircleHelp size={20} />
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-xl bg-white p-3 text-slate-600 shadow-sm"
            >
              <Bell size={20} />
            </button>
            <div className="grid size-10 place-items-center rounded-full bg-blue-600 font-semibold text-white">
              D
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning, Deepanshu 👋
          </h1>
          <p className="mt-1 text-slate-500">
            Here’s what’s happening with your store today.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <Icon className={color} size={21} />
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-400">Sample data</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App