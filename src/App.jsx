import { lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Moon, Sun } from 'lucide-react'
import { signIn, signOut, toggleTheme } from './app/store'
import Sidebar from './components/Sidebar'
import { LoadingState } from './components/QueryStates'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const InventoryPage = lazy(() => import('./pages/InventoryPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function enterDemo(event) {
    event.preventDefault()
    dispatch(signIn())
    navigate('/', { replace: true })
  }

  return <main className="grid min-h-screen place-items-center bg-slate-100 p-5"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-blue-600">ShopPanel</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Welcome to the demo</h1><p className="mt-2 text-sm text-slate-500">Sign in to open the e-commerce admin dashboard.</p><form onSubmit={enterDemo} className="mt-6 grid gap-4"><label className="grid gap-1.5 text-sm font-medium">Email<input required type="email" defaultValue="admin@example.com" className="rounded-xl border border-slate-200 px-3 py-2.5" /></label><label className="grid gap-1.5 text-sm font-medium">Password<input required type="password" defaultValue="demopassword" className="rounded-xl border border-slate-200 px-3 py-2.5" /></label><button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"><LogIn size={18} /> Continue to demo</button></form><p className="mt-4 text-xs text-slate-400">Demo-only sign-in; no credentials are sent to a server.</p></section></main>
}

function ProtectedLayout() {
  const isAuthenticated = useSelector((state) => state.app.authenticated)
  const theme = useSelector((state) => state.app.theme)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!isAuthenticated) return <Navigate to="/login" replace />

  function logout() {
    dispatch(signOut())
    navigate('/login', { replace: true })
  }

  return <div className={`app-shell min-h-screen md:flex ${theme === 'dark' ? 'dark' : ''}`}>
    <Sidebar onLogout={logout} />
    <div className="flex min-h-screen min-w-0 flex-1 flex-col">
      <div className="flex justify-end px-5 pt-4 md:px-8"><button type="button" onClick={() => dispatch(toggleTheme())} className="theme-toggle inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm" aria-label="Toggle color theme">{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}{theme === 'light' ? 'Dark mode' : 'Light mode'}</button><button type="button" onClick={logout} className="ml-2 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"><LogOut size={17} /> Sign out</button></div>
      <Suspense fallback={<main className="min-w-0 flex-1 p-5 md:p-8"><LoadingState label="Opening page" /></main>}><Outlet /></Suspense>
    </div>
  </div>
}

function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedLayout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/customers" element={<Navigate to="/users" replace />} />
      <Route path="/settings" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
}

export default App
