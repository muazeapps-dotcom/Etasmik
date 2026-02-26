import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  const menus = [
    { title: 'PENGURUSAN MURID', path: '/student-management', icon: '👥', color: 'border-blue-200' },
    { title: 'REKOD TASMIK', path: '/tasmik', icon: '📖', color: 'border-emerald-200' },
    { title: 'LAPORAN PRESTASI', path: '/reports', icon: '📊', color: 'border-amber-200' },
    { title: 'PROFIL GURU', path: '/profile', icon: '🕌', color: 'border-purple-200' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#064e3b] mb-2">E-TASMIK DIGITAL</h1>
          <div className="h-1 w-24 bg-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-600 italic">Selamat Datang ke Dashboard Guru</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menus.map((m) => (
            <button
              key={m.path}
              onClick={() => navigate(m.path)}
              className={`bg-white p-8 rounded-3xl shadow-sm border-2 ${m.color} hover:shadow-xl hover:border-[#d4af37] transition-all duration-300 flex flex-col items-center group`}
            >
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{m.icon}</span>
              <span className="text-xl font-bold text-gray-700 tracking-wide">{m.title}</span>
            </button>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Sistem Tasmik Al-Quran Moden
        </footer>
      </div>
    </div>
  );
};

export default MainMenu;