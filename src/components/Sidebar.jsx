import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Inventory', icon: Package, to: '/inventory' },
  { label: 'Orders', icon: ShoppingCart, to: '/orders' },
  { label: 'Customers', icon: Users, to: '/customers' },
]

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-950 px-5 py-6 text-white">
      <h1 className="mb-10 text-2xl font-bold">
        Shop<span className="text-blue-400">Panel</span>
      </h1>

      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Menu
      </p>

      <nav aria-label="Main navigation" className="flex flex-col gap-2">
        {menuItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={linkClasses}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/settings" className={`${linkClasses} mt-auto`}>
        <Settings size={19} />
        <span>Settings</span>
      </NavLink>
    </aside>
  )
}
