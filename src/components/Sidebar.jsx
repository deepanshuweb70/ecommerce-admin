import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Inventory', icon: Package, to: '/inventory' },
  { label: 'Orders', icon: ShoppingCart, to: '/orders' },
  { label: 'Users', icon: Users, to: '/users' },
]

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`

export default function Sidebar() {
  return (
    <aside className="sidebar flex w-full shrink-0 flex-col bg-slate-950 px-4 py-4 text-white md:min-h-screen md:w-64 md:px-5 md:py-6">
      <h1 className="mb-5 text-2xl font-bold md:mb-10">
        Shop<span className="text-blue-400">Panel</span>
      </h1>

      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Menu
      </p>

      <nav aria-label="Main navigation" className="flex flex-row gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
        {menuItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${linkClasses({ isActive })} whitespace-nowrap`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}
