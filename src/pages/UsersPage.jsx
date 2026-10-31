import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useCustomerMutations, useCustomers } from '../api/hooks'
import { ErrorState, LoadingState, PageHeading } from '../components/QueryStates'

const userSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(60, 'Name is too long.'),
  email: z.string().trim().email('Enter a valid email address.'),
})

export default function UsersPage() {
  const { data: users = [], isPending, isError, refetch } = useCustomers()
  const mutations = useCustomerMutations()
  const [editingUser, setEditingUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(userSchema), defaultValues: { name: '', email: '' },
  })

  function openForm(user = null) {
    setEditingUser(user)
    reset(user ? { name: user.name, email: user.email } : { name: '', email: '' })
    setIsOpen(true)
  }

  async function saveUser(values) {
    try {
      if (editingUser) await mutations.edit.mutateAsync({ id: editingUser.id, ...values })
      else await mutations.add.mutateAsync(values)
      setIsOpen(false)
      reset({ name: '', email: '' })
    } catch { /* The API error appears above the table. */ }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}?`)) return
    try { await mutations.remove.mutateAsync(user.id) } catch { /* The API error appears above the table. */ }
  }

  if (isPending) return <main className="min-w-0 flex-1 p-5 md:p-8"><LoadingState label="Loading users" /></main>
  if (isError) return <main className="min-w-0 flex-1 p-5 md:p-8"><ErrorState onRetry={refetch} /></main>
  const hasMutationError = mutations.add.isError || mutations.edit.isError || mutations.remove.isError

  return <main className="min-w-0 flex-1 p-5 md:p-8">
    <PageHeading eyebrow="People" title="Users" description="Manage customer accounts and contact details." action={<button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={18} /> Add user</button>} />
    <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
      {hasMutationError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Could not save changes. Check the mock API and try again.</p>}
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-3 font-medium">User</th><th className="px-3 py-3 font-medium">Email</th><th className="px-3 py-3 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
        {users.map((user) => <tr key={user.id}><td className="px-3 py-4"><span className="flex items-center gap-3 font-medium text-slate-900"><span className="grid size-9 place-items-center rounded-full bg-blue-50 text-blue-700"><Users size={17} /></span>{user.name}</span></td><td className="px-3 py-4 text-slate-600">{user.email}</td><td className="px-3 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openForm(user)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Edit ${user.name}`}><Pencil size={16} /></button><button type="button" onClick={() => deleteUser(user)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${user.name}`}><Trash2 size={16} /></button></div></td></tr>)}
      </tbody></table>{users.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No users yet. Add the first user to get started.</p>}</div>
    </section>
    {isOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}><section role="dialog" aria-modal="true" aria-labelledby="user-form-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h3 id="user-form-title" className="text-xl font-bold text-slate-900">{editingUser ? 'Edit user' : 'Add user'}</h3><form className="mt-5 grid gap-4" onSubmit={handleSubmit(saveUser)}>
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">Full name<input {...register('name')} className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal" />{errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}</label>
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">Email address<input type="email" {...register('email')} className="rounded-xl border border-slate-200 px-3 py-2.5 font-normal" />{errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}</label>
      <div className="mt-2 flex justify-end gap-3"><button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? 'Saving…' : editingUser ? 'Save changes' : 'Add user'}</button></div>
    </form></section></div>}
  </main>
}
