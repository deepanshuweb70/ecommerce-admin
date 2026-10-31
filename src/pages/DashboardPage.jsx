import { Bell, CircleHelp, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { useCustomers, useOrders, useProducts } from '../api/hooks'
import { ErrorState, LoadingState } from '../components/QueryStates'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function DashboardPage() {
  const productQuery = useProducts()
  const orderQuery = useOrders()
  const customerQuery = useCustomers()
  const queries = [productQuery, orderQuery, customerQuery]
  const retry = () => queries.forEach((query) => query.refetch())
  if (queries.some((query) => query.isPending)) return <main className="min-w-0 flex-1 p-5 md:p-8"><LoadingState label="Loading dashboard" /></main>
  if (queries.some((query) => query.isError)) return <main className="min-w-0 flex-1 p-5 md:p-8"><ErrorState onRetry={retry} /></main>

  const products = productQuery.data
  const orders = orderQuery.data
  const customers = customerQuery.data
  const paidOrders = orders.filter((order) => order.paymentStatus === 'Paid')
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0)
  const stats = [
    { label: 'Revenue', value: money.format(revenue), caption: 'From paid orders', icon: DollarSign, color: 'text-blue-600' },
    { label: 'Orders', value: orders.length.toLocaleString(), caption: 'All orders', icon: ShoppingCart, color: 'text-violet-600' },
    { label: 'Products', value: products.length.toLocaleString(), caption: 'In inventory', icon: Package, color: 'text-amber-600' },
    { label: 'Users', value: customers.length.toLocaleString(), caption: 'Registered users', icon: Users, color: 'text-emerald-600' },
  ]
  const orderStatusData = ['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => ({
    status,
    total: orders.filter((order) => order.status === status).length,
  }))
  const salesTrend = paidOrders.map((order) => ({
    order: order.id.replace('order-', '#'),
    revenue: Number(order.total),
  })).reverse()

  return (
    <main className="min-w-0 flex-1 p-5 md:p-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div><p className="text-sm text-slate-500">Overview</p><h2 className="text-2xl font-bold text-slate-900">Dashboard</h2></div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Help" className="rounded-xl bg-white p-3 text-slate-600 shadow-sm"><CircleHelp size={20} /></button>
          <button type="button" aria-label="Notifications" className="rounded-xl bg-white p-3 text-slate-600 shadow-sm"><Bell size={20} /></button>
          <div className="grid size-10 place-items-center rounded-full bg-blue-600 font-semibold text-white">D</div>
        </div>
      </header>
      <section className="mb-8"><h1 className="text-2xl font-bold text-slate-900">Good morning, Deepanshu 👋</h1><p className="mt-1 text-slate-500">Here’s what’s happening with your store today.</p></section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, caption, icon: Icon, color }) => <article key={label} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><Icon className={color} size={21} /></div><p className="mt-4 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{caption}</p></article>)}
      </section>
      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="mb-5 font-semibold text-slate-900">Orders by status</h3><div className="h-64" role="img" aria-label="Bar chart showing orders by status"><ResponsiveContainer width="100%" height="100%"><BarChart data={orderStatusData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="status" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="total" name="Orders" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></article>
        <article className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="mb-5 font-semibold text-slate-900">Paid sales trend</h3><div className="h-64" role="img" aria-label="Line chart showing revenue for paid orders"><ResponsiveContainer width="100%" height="100%"><LineChart data={salesTrend} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="order" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} /><Tooltip formatter={(value) => money.format(value)} /><Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></article>
      </section>
    </main>
  )
}
