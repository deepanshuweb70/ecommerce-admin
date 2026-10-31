import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useProductMutations, useProducts } from '../api/hooks'
import { ErrorState, LoadingState, PageHeading } from '../components/QueryStates'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const emptyForm = { name: '', category: '', price: '', stock: '' }

export default function InventoryPage() {
  const { data: products = [], isPending, isError, refetch } = useProducts()
  const mutations = useProductMutations()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const pageSize = 5
  const categories = [...new Set(products.map((product) => product.category))]

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products.filter((item) => (
      `${item.name} ${item.category}`.toLowerCase().includes(term)
      && (category === 'All categories' || item.category === category)
    )).sort((a, b) => {
      const first = a[sort.key]
      const second = b[sort.key]
      const comparison = typeof first === 'string' ? first.localeCompare(second) : Number(first) - Number(second)
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [category, products, query, sort])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageProducts = filtered.slice((page - 1) * pageSize, page * pageSize)

  function openForm(product = null) {
    setEditingProduct(product)
    setForm(product ? { name: product.name, category: product.category, price: String(product.price), stock: String(product.stock) } : emptyForm)
    setIsFormOpen(true)
  }

  async function saveProduct(event) {
    event.preventDefault()
    const changes = { name: form.name.trim(), category: form.category.trim(), price: Number(form.price), stock: Number(form.stock) }
    try {
      if (editingProduct) await mutations.edit.mutateAsync({ id: editingProduct.id, ...changes })
      else {
        await mutations.add.mutateAsync(changes)
        setPage(1)
      }
      setIsFormOpen(false)
    } catch { /* The mutation error is shown in the form. */ }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name} from inventory?`)) return
    try {
      await mutations.remove.mutateAsync(product.id)
      setPage((current) => Math.min(current, Math.max(1, Math.ceil((filtered.length - 1) / pageSize))))
    } catch { /* The shared error message below explains the failure. */ }
  }

  function toggleSort(key) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
  }

  if (isPending) return <main className="min-w-0 flex-1 p-5 md:p-8"><LoadingState label="Loading inventory" /></main>
  if (isError) return <main className="min-w-0 flex-1 p-5 md:p-8"><ErrorState onRetry={refetch} /></main>

  return (
    <main className="min-w-0 flex-1 p-5 md:p-8">
      <PageHeading eyebrow="Catalog" title="Inventory" description="Search, sort, and manage your products."
        action={<button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={18} /> Add product</button>} />
      <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" type="search" placeholder="Search product or category..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} aria-label="Search inventory" /></label>
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }} aria-label="Filter by category"><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        {(mutations.add.isError || mutations.edit.isError || mutations.remove.isError) && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Could not save the product. Please check the API and try again.</p>}
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr>
            {[["name", "Product"], ["category", "Category"], ["price", "Price"], ["stock", "Stock"]].map(([key, label]) => <th key={key} className="px-3 py-3 font-medium"><button type="button" onClick={() => toggleSort(key)}>{label} {sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : ''}</button></th>)}
            <th className="px-3 py-3 font-medium">Availability</th><th className="px-3 py-3 text-right font-medium">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">{pageProducts.map((product) => <tr key={product.id} className="text-slate-700">
            <td className="px-3 py-4 font-medium text-slate-900">{product.name}</td><td className="px-3 py-4">{product.category}</td><td className="px-3 py-4">{money.format(product.price)}</td><td className="px-3 py-4">{product.stock} units</td>
            <td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.stock < 15 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{product.stock < 15 ? 'Low stock' : 'In stock'}</span></td>
            <td className="px-3 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openForm(product)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Edit ${product.name}`}><Pencil size={16} /></button><button type="button" disabled={mutations.remove.isPending} onClick={() => deleteProduct(product)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></div></td>
          </tr>)}</tbody>
        </table>{filtered.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No products match your search.</p>}</div>
        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500"><span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={18} /></button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40" aria-label="Next page"><ChevronRight size={18} /></button></div></footer>
      </section>
      {isFormOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsFormOpen(false) }}><section role="dialog" aria-modal="true" aria-labelledby="product-form-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><h3 id="product-form-title" className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit product' : 'Add product'}</h3><form className="mt-5 grid gap-4" onSubmit={saveProduct}>
        <label className="grid gap-1.5 text-sm font-medium">Product name<input required maxLength={80} className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label className="grid gap-1.5 text-sm font-medium">Category<input required maxLength={40} className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-medium">Price (USD)<input required type="number" min="0.01" step="0.01" className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label><label className="grid gap-1.5 text-sm font-medium">Stock units<input required type="number" min="0" step="1" className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label></div>
        <div className="mt-2 flex justify-end gap-3"><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">Cancel</button><button type="submit" disabled={mutations.add.isPending || mutations.edit.isPending} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{mutations.add.isPending || mutations.edit.isPending ? 'Saving…' : editingProduct ? 'Save changes' : 'Add product'}</button></div>
      </form></section></div>}
    </main>
  )
}
