import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Inventory', icon: Package },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Customers', icon: Users },
]

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-950 px-5 py-6 text-white">
      <h1 className="mb-10 text-2xl font-bold">
        Shop<span className="text-blue-400">Panel</span>
      </h1>

      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Menu
      </p>

      <nav className="flex flex-col gap-2">
        {menuItems.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <a
        href="#"
        className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"
      >
        <Settings size={19} />
        <span>Settings</span>
      </a>
    </aside>
  )
}