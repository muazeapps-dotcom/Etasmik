import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LEVELS = ['Iqra 1', 'Iqra 2', 'Iqra 3', 'Iqra 4']

export default function TasmikForm() {
  const navigate = useNavigate()
  const [readingType, setReadingType] = useState('Iqra')
  const [levelIndex, setLevelIndex] = useState(0)
  const [page, setPage] = useState('')

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
      <header className="flex items-center bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-white/10">
        <button
          type="button"
          onClick={() => navigate('/app/utama')}
          className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Kembali"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Borang Rekod Tasmik
        </h2>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-2">
          <p className="text-xs text-primary font-semibold uppercase tracking-wider">Pelajar Sedang Dinilai</p>
          <h1 className="text-xl font-bold text-white">Muhammad Rizqi Bin Ahmad</h1>
          <p className="text-sm text-white/50">SK Sungai Manila • Tahun 4 Amanah</p>
        </div>

        <section className="space-y-3">
          <h3 className="text-white text-md font-semibold px-1">Jenis Bacaan</h3>
          <div className="flex bg-white/5 p-1 rounded-xl">
            <label className="flex cursor-pointer h-11 grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-primary has-[:checked]:text-background-dark text-white/50 text-sm font-semibold transition-all">
              <span className="truncate">Iqra</span>
              <input
                type="radio"
                name="reading_type"
                value="Iqra"
                checked={readingType === 'Iqra'}
                onChange={() => setReadingType('Iqra')}
                className="hidden"
              />
            </label>
            <label className="flex cursor-pointer h-11 grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-primary has-[:checked]:text-background-dark text-white/50 text-sm font-semibold transition-all">
              <span className="truncate">Al-Quran</span>
              <input
                type="radio"
                name="reading_type"
                value="Al-Quran"
                checked={readingType === 'Al-Quran'}
                onChange={() => setReadingType('Al-Quran')}
                className="hidden"
              />
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-white text-md font-semibold">Peringkat / Juzuk</h3>
            <span className="text-xs text-primary font-medium">Sila Pilih Satu</span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {LEVELS.map((l, i) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevelIndex(i)}
                className={`flex h-12 shrink-0 items-center justify-center rounded-xl px-6 font-bold border-2 transition-all ${
                  i === levelIndex
                    ? 'bg-primary text-background-dark border-primary shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-sm">{l}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest px-1">Tatal ke kanan untuk lebih banyak pilihan</p>
        </section>

        <div className="grid grid-cols-1 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-white text-md font-semibold px-1">Muka Surat</label>
            <div className="relative">
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary placeholder:text-white/40"
                placeholder="Masukkan nombor muka surat"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40">auto_stories</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white/50 text-xs font-semibold px-1 uppercase">Tarikh & Masa</label>
              <div className="flex items-center h-12 px-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium border border-white/10">
                <span className="material-symbols-outlined text-sm mr-2">schedule</span>
                24/05/2024, 10:45 AM
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white/50 text-xs font-semibold px-1 uppercase">Nama Guru</label>
              <div className="flex items-center h-12 px-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium border border-white/10">
                <span className="material-symbols-outlined text-sm mr-2">person</span>
                ustazah fatimah
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2 px-1 border-l-4 border-gold-custom">
            <h3 className="text-white text-md font-bold">Konfigurasi Penghantaran Data</h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">admin_panel_settings</span>
                Destinasi Data (Admin)
              </label>
              <div className="relative">
                <select className="w-full h-12 pl-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary appearance-none text-sm">
                  <option value="all">Semua Pentadbir</option>
                  <option value="admin1">Emel Pentadbir 1 (S/U Tasmik)</option>
                  <option value="admin2">Emel Pentadbir 2 (Ketua Panitia)</option>
                  <option value="admin3">Emel Pentadbir 3 (Guru Besar)</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">alternate_email</span>
                Emel Tambahan (Opsional)
              </label>
              <input
                type="email"
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary placeholder:text-white/40 text-sm"
                placeholder="contoh: penjaga@email.com"
              />
            </div>
          </div>
        </section>

        <div className="relative w-full h-24 rounded-2xl overflow-hidden mt-2 shadow-lg opacity-80">
          <img
            alt="Quran reading"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApOU99Wx_CigC3KC128sWpC6IqRdzEy79G-xHDvQ3VRifNDyXjxYUuJYPlze4nCzmmiTfqambWuuAokHaOKs-fZhXuONrrIMT4080B5bwYbjCS5MC44KMG41W-Z-bJOfpbL_sJD_WhTkhT9T6NSHW8yHRXQHozy-kUA3QsaJODnOtUk4AqDGJXbGz0lz6i12x8Ez0p-kFxXp4BLreYSehmSxNn3XNqIJTm7IDzqH5ddLFulGSniICqyE46KnF7zXceVehsKVxmUSHL"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent flex flex-col justify-end p-4">
            <p className="text-white text-[10px] font-light italic">
              &quot;Sebaik-baik kamu adalah yang mempelajari Al-Quran dan mengajarkannya.&quot;
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-background-dark border-t border-white/10 pb-8">
        <button
          type="button"
          className="w-full relative group overflow-hidden bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-primary/30"
        >
          <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,_#ffffff,_transparent)]" aria-hidden />
          <span className="material-symbols-outlined animate-pulse text-[28px] drop-shadow-sm">cloud_sync</span>
          <span className="tracking-wide">SIMPAN & HANTAR DATA</span>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gold-custom opacity-50" aria-hidden />
        </button>
        <div className="flex flex-col items-center mt-4">
          <p className="text-center text-[10px] text-white/40 uppercase tracking-tighter">SK Sungai Manila - Sistem Rekod Tasmik Digital v3.0</p>
          <div className="h-1 w-12 bg-gold-custom/30 rounded-full mt-1" aria-hidden />
        </div>
      </footer>
    </div>
  )
}
