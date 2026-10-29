import {
  Bell,
  CircleHelp,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Pencil,
  Plus,
  Search,
  Package,
  ShoppingCart,
  Trash2,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { customers, orders, products } from './data/mockData'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function DashboardPage() {
  const orderStatusData = ['Pending', 'Processing', 'Shipped', 'Delivered'].map(
    (status) => ({
      status,
      total: orders.filter((order) => order.status === status).length,
    }),
  )
  const revenueData = orders
    .filter((order) => order.paymentStatus === 'Paid')
    .map((order) => ({ order: order.id.replace('order-', '#'), revenue: order.total }))

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

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" size={19} />
            <h3 className="font-semibold text-slate-900">Orders by status</h3>
          </div>
          <div className="h-64" role="img" aria-label="Bar chart showing orders by status">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="total" name="Orders" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <DollarSign className="text-emerald-600" size={19} />
            <h3 className="font-semibold text-slate-900">Paid order revenue</h3>
          </div>
          <div className="h-64" role="img" aria-label="Bar chart showing revenue by paid order">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="order" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => currencyFormatter.format(value)} />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
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

function InventoryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [inventory, setInventory] = useState(products)
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formValues, setFormValues] = useState({ name: '', category: '', price: '', stock: '' })
  const pageSize = 5
  const categories = [...new Set(inventory.map((product) => product.category))]
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return inventory.filter((product) => {
      const matchesQuery = `${product.name} ${product.category}`
        .toLowerCase()
        .includes(normalizedQuery)
      const matchesCategory = category === 'All categories' || product.category === category
      return matchesQuery && matchesCategory
    })
  }, [category, inventory, query])
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

  function openProductForm(product = null) {
    setEditingProduct(product)
    setFormValues(product
      ? { name: product.name, category: product.category, price: String(product.price), stock: String(product.stock) }
      : { name: '', category: '', price: '', stock: '' })
    setIsFormOpen(true)
  }

  function saveProduct(event) {
    event.preventDefault()
    const productData = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      price: Number(formValues.price),
      stock: Number(formValues.stock),
    }
    if (editingProduct) {
      setInventory((current) => current.map((item) => item.id === editingProduct.id ? { ...item, ...productData } : item))
    } else {
      setInventory((current) => [{ id: crypto.randomUUID(), ...productData }, ...current])
      setPage(1)
    }
    setIsFormOpen(false)
  }

  function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name} from inventory?`)) return
    const remaining = filteredProducts.length - 1
    setInventory((current) => current.filter((item) => item.id !== product.id))
    setPage((current) => Math.min(current, Math.max(1, Math.ceil(remaining / pageSize))))
  }

  return (
    <main className="min-w-0 flex-1 p-5 md:p-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Catalog</p>
          <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
          <p className="mt-1 text-sm text-slate-500">Browse products and check stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{filteredProducts.length} products</span>
          <button type="button" onClick={() => openProductForm()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={18} /> Add product
          </button>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="search"
              placeholder="Search product or category..."
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              aria-label="Search inventory"
            />
          </label>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700 outline-none focus:border-blue-500"
            value={category}
            onChange={(event) => { setCategory(event.target.value); setPage(1) }}
            aria-label="Filter by category"
          >
            <option>All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3 font-medium">Product</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Stock</th>
                <th className="px-3 py-3 font-medium">Availability</th>
                <th className="px-3 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleProducts.map((product) => (
                <tr key={product.id} className="text-slate-700">
                  <td className="px-3 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-3 py-4">{product.category}</td>
                  <td className="px-3 py-4">{currencyFormatter.format(product.price)}</td>
                  <td className="px-3 py-4">{product.stock} units</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.stock < 15 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {product.stock < 15 ? 'Low stock' : 'In stock'}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openProductForm(product)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Edit ${product.name}`}><Pencil size={16} /></button>
                      <button type="button" onClick={() => deleteProduct(product)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">
              <Package className="mx-auto mb-2 text-slate-300" size={28} />
              No products match your search.
            </div>
          )}
        </div>
        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <span>Showing {filteredProducts.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length}</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-lg border border-slate-200 p-2 enabled:hover:bg-slate-50 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={18} /></button>
            <span className="px-2">Page {page} of {pageCount}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="rounded-lg border border-slate-200 p-2 enabled:hover:bg-slate-50 disabled:opacity-40" aria-label="Next page"><ChevronRight size={18} /></button>
          </div>
        </footer>
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsFormOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="product-form-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="product-form-title" className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit product' : 'Add product'}</h3>
            <form className="mt-5 grid gap-4" onSubmit={saveProduct}>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">Product name
                <input required maxLength={80} className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" value={formValues.name} onChange={(event) => setFormValues({ ...formValues, name: event.target.value })} />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">Category
                <input required maxLength={40} className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" value={formValues.category} onChange={(event) => setFormValues({ ...formValues, category: event.target.value })} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-slate-700">Price (USD)
                  <input required type="number" min="0.01" step="0.01" className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" value={formValues.price} onChange={(event) => setFormValues({ ...formValues, price: event.target.value })} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-slate-700">Stock units
                  <input required type="number" min="0" step="1" className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" value={formValues.stock} onChange={(event) => setFormValues({ ...formValues, stock: event.target.value })} />
                </label>
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{editingProduct ? 'Save changes' : 'Add product'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
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
