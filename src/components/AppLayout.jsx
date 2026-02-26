import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'home', label: 'Utama' },
  { path: '/students', icon: 'groups', label: 'Murid' },
  { path: '/tasmik', icon: 'menu_book', label: 'Tasmik' },
  { path: '/reports', icon: 'analytics', label: 'Laporan' },
  { path: '/profile', icon: 'person', label: 'Profil' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Bahagian Atas (Content) */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Bahagian Bawah (Menu) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-green-900 text-white shadow-lg z-50">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                location.pathname === item.path ? 'text-white bg-green-800' : 'text-green-300'
              }`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
} 