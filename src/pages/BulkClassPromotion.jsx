import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAiT3OXc0B4yfixtmwAx8VsSVvK34tT7bBiAbg_jG4DIjWRuVjFZnVzEUE14kqmTKh2Q3YgK9F1JCTmoJtMqp7ACaSxybD12GTZt70GPiz4qQSzYKbnS1DvBzwnSye1OQKsgQZ727EOxL2JXzi7_-Cuyz0Cv6VFFg1n50fR_8p6Rp6jAFNguBR4srlXY2_VMqHHEEipGdSfaoqCCd5RHV2RBbvV07rbG6WX0wZ-iLkdDa--GAATVvrHpzREUpa_uQoytRInLxVEJbus',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJt0OuReLAbXSEzoDGrMnzefrQ4LA4crGcmEn05sdPQfdim4_xrDBUreNG5NtRQ2MCIp5J_sBAtt8TbhpAY-ZgUMq2P5AfLrosum_cJ1cYSeJKixzt4cv-B7TTtB06qa-8FaqEVzNUNoyhPvOA9MWS1ooIBd-r65IosnKfwV3iDjLCPLH2YuBnpto6dsNUrCoToc_t80KOai9fmhLuUZbxdMG-kfjD_f2lkyrprKNgunuYoyAOC8cfzsHmMOIvfnKvlXf9LaEUgCLT',
]

const classes = [
  { from: '1 Arif', to: '2 Arif', count: 32, teacher: 'Ustazah Fatimah', selected: true, type: 'normal' },
  { from: '2 Bijak', to: '3 Bestari', count: 28, teacher: 'Ustaz Ahmad', selected: true, type: 'normal' },
  { from: '6 Cerdik', to: 'Alumni', count: 35, teacher: 'Tamat Sekolah', selected: true, type: 'alumni' },
  { from: '3 Dinamik', to: '4 Dinamik', count: 30, teacher: 'Ustazah Aminah', selected: false, type: 'normal' },
  { from: '5 Ehsan', to: '?', count: 0, teacher: 'Kelas sasaran tidak ditetapkan.', selected: false, type: 'error' },
]

export default function BulkClassPromotion() {
  const navigate = useNavigate()
  const [selectAll, setSelectAll] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen flex flex-col bg-background-dark">
      <nav className="sticky top-0 z-40 bg-background-dark/80 ios-blur border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button type="button" onClick={() => navigate('/app/utama')} className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors" aria-label="Kembali">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">Kenaikan Kelas Pukal</h1>
          <button type="button" className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors" aria-label="Sejarah">
            <span className="material-symbols-outlined text-2xl">history</span>
          </button>
        </div>
      </nav>

      <header className="p-5 space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Sesi Akademik 2024/2025</span>
          <h2 className="text-3xl font-extrabold leading-tight">Migrasi Kelas & Murid</h2>
          <p className="text-white/60 text-sm">Pilih kelas yang akan dinaikkan ke tahap seterusnya secara berkelompok.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-white/70">Status Pemilihan</span>
            <span className="text-sm font-bold text-primary">4 dari 12 Kelas</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '33%' }} />
          </div>
        </div>
      </header>

      <div className="px-5 mb-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm text-white placeholder:text-white/30"
            placeholder="Cari nama kelas..."
          />
        </div>
      </div>

      <main className="flex-1 px-5 pb-32">
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-transparent cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => setSelectAll(e.target.checked)}
              className="size-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-sm font-bold">Pilih Semua Kelas</span>
          </label>

          {classes.map((c) => (
            <div
              key={c.from}
              className={`group relative rounded-xl p-4 transition-all active:scale-[0.98] border ${
                c.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-white/5 border-white/10'
              } ${!c.selected && c.type !== 'error' ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {c.type === 'error' ? (
                    <div className="size-6 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={c.selected}
                      readOnly
                      className="size-6 rounded-lg border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{c.from}</span>
                      <span className={`material-symbols-outlined text-sm ${c.type === 'alumni' ? 'text-orange-400' : 'text-primary'}`}>
                        {c.type === 'alumni' ? 'school' : 'trending_up'}
                      </span>
                      <span className={`font-bold text-lg ${c.type === 'alumni' ? 'text-orange-400' : 'text-primary'}`}>{c.to}</span>
                    </div>
                    <p className={`text-xs font-medium mt-1 ${c.type === 'error' ? 'text-red-400' : 'text-white/50'}`}>
                      {c.type === 'error' ? c.teacher : `${c.count} Murid • ${c.teacher}`}
                    </p>
                  </div>
                </div>
                {c.type === 'error' ? (
                  <button type="button" className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Tetapkan</button>
                ) : (
                  <button type="button" className="text-white/40 hover:text-white">
                    <span className="material-symbols-outlined">edit_note</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-20 left-0 right-0 p-5 bg-background-dark/90 ios-blur border-t border-white/10 flex flex-col gap-4 max-w-md mx-auto z-40">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Jumlah Murid Terlibat</span>
            <span className="text-lg font-bold">125 Murid</span>
          </div>
          <div className="flex -space-x-3">
            {AVATARS.map((src, i) => (
              <div key={i} className="size-8 rounded-full border-2 border-background-dark overflow-hidden bg-white/10">
                <img src={src} alt="" className="size-full object-cover" />
              </div>
            ))}
            <div className="size-8 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center text-[10px] font-bold text-background-dark">
              +123
            </div>
          </div>
        </div>
        <button
          type="button"
          className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Sahkan Kenaikan Kelas
        </button>
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none opacity-20" aria-hidden>
        <div className="absolute top-[-10%] left-[-10%] size-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-primary/10 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
