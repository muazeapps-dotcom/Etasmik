import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/app/utama', icon: 'home', label: 'Utama' },
  { path: '/app/murid', icon: 'group', label: 'Murid' },
  { path: '/app/tasmik', icon: 'menu_book', label: 'Tasmik' },
  { path: '/app/laporan', icon: 'analytics', label: 'Laporan' },
  { path: '/app/profil', icon: 'person', label: 'Profil' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-background-dark">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-background-dark/90 ios-blur border-t border-white/10 pb-6 pt-2 z-50 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-white/50 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
