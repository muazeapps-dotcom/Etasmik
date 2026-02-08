import { useNavigate } from 'react-router-dom'

const archives = [
  { year: '2023/24', students: 245, classes: 12, locked: '10 Jan 2024', recent: true },
  { year: '2022/23', students: 210, classes: 10, locked: '02 Feb 2023', recent: true },
  { year: '2021/22', students: 198, classes: 9, locked: '15 Jan 2022', recent: false },
  { year: '2020/21', students: 185, classes: 9, locked: '20 Jan 2021', recent: false },
]

export default function Archive() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="h-12 w-full bg-background-dark sticky top-0 z-40" aria-hidden />
      <nav className="sticky top-12 z-30 bg-background-dark/80 ios-blur px-4 py-2 border-b border-emerald-900/30">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('/app/utama')} className="flex items-center text-primary">
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
            <span className="text-lg">Kembali</span>
          </button>
          <button type="button" className="text-primary" aria-label="Penapis">
            <span className="material-symbols-outlined text-[24px]">filter_list</span>
          </button>
        </div>
        <div className="mt-4 pb-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Arkib Rekod Lama</h1>
          <p className="text-sm text-emerald-500/70 mt-1 uppercase tracking-wider font-semibold">SK Sungai Manila</p>
        </div>
      </nav>

      <div className="px-4 py-4">
        <label className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-4 text-emerald-500/50">search</span>
          <input
            type="text"
            className="w-full h-12 pl-12 pr-4 bg-emerald-900/30 border-none rounded-xl focus:ring-2 focus:ring-primary text-white placeholder:text-emerald-700"
            placeholder="Cari tahun atau nama kelas..."
          />
        </label>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Koleksi Arkib Tahunan</h2>
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">Automated Backup On</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {archives.map((a) => (
            <div
              key={a.year}
              className={`group relative flex flex-col p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-2xl transition-all hover:ring-2 hover:ring-primary active:scale-95 ${!a.recent ? 'opacity-80' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="material-symbols-outlined filled text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
                <span className="material-symbols-outlined text-emerald-800">more_vert</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Sesi {a.year}</h3>
                <p className="text-xs text-emerald-500/60 mt-1">{a.students} Pelajar • {a.classes} Kelas</p>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-800/30 flex items-center text-[10px] font-bold text-emerald-700 uppercase">
                Dikunci: {a.locked}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 px-4 pb-24">
        <h2 className="text-lg font-bold mb-4 text-white">Status Simpanan</h2>
        <div className="p-4 bg-emerald-900/10 border border-emerald-800/30 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Storan iCloud / Database</span>
            <span className="text-sm font-bold text-primary">65% Digunakan</span>
          </div>
          <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(17,212,115,0.4)]" />
          </div>
          <p className="text-xs text-emerald-500/60 mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">cloud_done</span>
            Semua rekod telah diselaraskan dengan server utama.
          </p>
        </div>
      </div>

    </div>
  )
}
