import { AlertTriangle, LoaderCircle } from 'lucide-react'

export function LoadingState({ label = 'Loading data' }) {
  return (
    <div className="grid min-h-56 place-items-center rounded-2xl bg-white p-8 text-slate-500 shadow-sm" role="status">
      <span className="flex items-center gap-3"><LoaderCircle className="animate-spin text-blue-600" />{label}…</span>
    </div>
  )
}

export function ErrorState({ onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-800" role="alert">
      <div className="flex items-center gap-2 font-semibold"><AlertTriangle size={19} /> Could not load data</div>
      <p className="mt-2 text-sm">Check that the mock API is running, then try again.</p>
      <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-medium">Retry</button>
    </div>
  )
}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500">{eyebrow}</p>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </header>
  )
}
