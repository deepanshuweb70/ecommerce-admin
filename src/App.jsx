import {
  Bell,
  CircleHelp,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { customers, orders, products } from './data/mockData'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function DashboardPage() {
  const revenue = orders
    .filter((order) => order.paymentStatus === 'Paid')
    .reduce((total, order) => total + order.total, 0)

  const stats = [
    {
      label: 'Revenue',
      value: currencyFormatter.format(revenue),
      caption: 'From paid orders',
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      label: 'Orders',
      value: orders.length.toLocaleString(),
      caption: 'In the sample dataset',
      icon: ShoppingCart,
      color: 'text-violet-600',
    },
    {
      label: 'Products',
      value: products.length.toLocaleString(),
      caption: 'In the inventory',
      icon: Package,
      color: 'text-amber-600',
    },
    {
      label: 'Customers',
      value: customers.length.toLocaleString(),
      caption: 'Registered customers',
      icon: Users,
      color: 'text-emerald-600',
    },
  ]

  return (
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
        {stats.map(({ label, value, caption, icon: Icon, color }) => (
          <article key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <Icon className={color} size={21} />
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{caption}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

function PlaceholderPage({ title, description }) {
  return (
    <main className="min-w-0 flex-1 p-5 md:p-8">
      <header className="mb-8">
        <p className="text-sm text-slate-500">ShopPanel</p>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
        <p className="mt-4 text-sm text-slate-400">
          This page is connected. We’ll build its features in the next steps.
        </p>
      </section>
    </main>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/inventory"
          element={
            <PlaceholderPage
              title="Inventory"
              description="View and manage the products in your store."
            />
          }
        />
        <Route
          path="/orders"
          element={
            <PlaceholderPage
              title="Orders"
              description="Review customer orders and their current status."
            />
          }
        />
        <Route
          path="/customers"
          element={
            <PlaceholderPage
              title="Customers"
              description="View and manage your store’s customers."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Store preferences and account settings will go here."
            />
          }
        />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page not found"
              description="Use the sidebar to choose a page."
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
