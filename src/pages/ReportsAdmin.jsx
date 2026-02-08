import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ReportsAdmin() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('daily')
  const [adminEmail, setAdminEmail] = useState('')

  const admins = [
    { email: 'ustaz.ahmad@edu.my', role: 'Super Admin' },
    { email: 'cikgu.siti@edu.my', role: 'Editor' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-dark/80 ios-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/app/utama')} className="text-primary p-1" aria-label="Kembali">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Laporan & Admin</h1>
            <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">SK Sungai Manila</p>
          </div>
        </div>
        <button type="button" className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Tetapan">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="pb-24">
        <div className="px-4 py-4">
          <div className="flex h-10 w-full items-center justify-center rounded-xl bg-white/5 p-1">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <label
                key={p}
                className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-[#234836] has-[:checked]:shadow-sm text-white/50 has-[:checked]:text-primary text-sm font-semibold transition-all"
              >
                <span>{p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}</span>
                <input
                  type="radio"
                  name="report-period"
                  value={p}
                  checked={period === p}
                  onChange={() => setPeriod(p)}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 mb-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-medium text-white/50 mb-1">Ayat Dibaca</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">1,240</span>
              <span className="text-[10px] font-bold text-primary pb-1">+12%</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-medium text-white/50 mb-1">Pelajar Aktif</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">85</span>
              <span className="text-[10px] font-bold text-red-500 pb-1">-2%</span>
            </div>
          </div>
        </div>

        <section className="px-4 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4 ml-1">Eksport Data</h2>
          <div className="flex gap-4">
            <button type="button" className="flex-1 flex flex-col items-center justify-center gap-3 bg-white/5 py-5 rounded-2xl border border-white/10 active:scale-95 transition-transform">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
              </div>
              <span className="text-xs font-bold">Eksport PDF</span>
            </button>
            <button type="button" className="flex-1 flex flex-col items-center justify-center gap-3 bg-white/5 py-5 rounded-2xl border border-white/10 active:scale-95 transition-transform">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <span className="material-symbols-outlined text-3xl">table_chart</span>
              </div>
              <span className="text-xs font-bold">Google Sheets</span>
            </button>
          </div>
        </section>

        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Prestasi Mengikut Kelas</h2>
            <span className="text-[10px] font-bold text-primary">LIHAT SEMUA</span>
          </div>
          <div className="space-y-3">
            {[
              { name: '1 Ibnu Sina', pct: 92 },
              { name: '2 Al-Farabi', pct: 78 },
              { name: '3 Al-Ghazali', pct: 65 },
            ].map((c) => (
              <div key={c.name} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{c.name}</span>
                  <span className="text-xs font-semibold text-primary">{c.pct}% Selesai</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4 ml-1">Pengurusan Admin</h2>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
            <p className="text-xs font-medium text-white/50 mb-3">Tambah emel admin baru</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary placeholder:text-white/30 outline-none transition-all"
                placeholder="contoh@emel.com"
              />
              <button type="button" className="bg-primary text-background-dark p-2 rounded-xl flex items-center justify-center aspect-square active:scale-95">
                <span className="material-symbols-outlined">person_add</span>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2">Admin Berdaftar</p>
            {admins.map((a) => (
              <div key={a.email} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{a.email}</p>
                    <p className="text-[10px] text-white/50">{a.role}</p>
                  </div>
                </div>
                <button type="button" className="text-white/40 hover:text-red-500 transition-colors p-1">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
