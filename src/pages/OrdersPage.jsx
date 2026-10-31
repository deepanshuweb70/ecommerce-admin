import { useMemo, useState } from 'react'
import { useCustomers, useOrders } from '../api/hooks'
import { ErrorState, LoadingState, PageHeading } from '../components/QueryStates'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function OrdersPage() {
  const ordersQuery = useOrders()
  const usersQuery = useCustomers()
  const [status, setStatus] = useState('All statuses')
  const usersById = useMemo(() => Object.fromEntries((usersQuery.data || []).map((user) => [user.id, user])), [usersQuery.data])
  const orders = (ordersQuery.data || []).filter((order) => status === 'All statuses' || order.status === status)
  if (ordersQuery.isPending || usersQuery.isPending) return <main className="min-w-0 flex-1 p-5 md:p-8"><LoadingState label="Loading orders" /></main>
  if (ordersQuery.isError || usersQuery.isError) return <main className="min-w-0 flex-1 p-5 md:p-8"><ErrorState onRetry={() => { ordersQuery.refetch(); usersQuery.refetch() }} /></main>

  return <main className="min-w-0 flex-1 p-5 md:p-8">
    <PageHeading eyebrow="Sales" title="Orders" description="Order history with fulfillment and payment status." />
    <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
      <div className="mb-5 flex justify-end"><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" aria-label="Filter orders by status"><option>All statuses</option>{['Pending', 'Processing', 'Shipped', 'Delivered'].map((value) => <option key={value}>{value}</option>)}</select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-3 font-medium">Order</th><th className="px-3 py-3 font-medium">Customer</th><th className="px-3 py-3 font-medium">Total</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Payment</th></tr></thead><tbody className="divide-y divide-slate-100">
        {orders.map((order) => <tr key={order.id}><td className="px-3 py-4 font-semibold text-slate-900">#{order.id.replace('order-', '')}</td><td className="px-3 py-4">{usersById[order.customerId]?.name || 'Unknown customer'}</td><td className="px-3 py-4">{money.format(order.total)}</td><td className="px-3 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{order.status}</span></td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{order.paymentStatus}</span></td></tr>)}
      </tbody></table>{orders.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No orders in this status.</p>}</div>
    </section>
  </main>
}
