import { useNavigate } from 'react-router-dom'

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0MieXxW9dFltxBoSwGL6Wj2a440amACrmGujv1BKImq06F2ekdykT37Q_gd_80qn8IhhEKTBOOHV-4PQhX2rOoRH3c___L1ORz7DKmpe_GRZsui0ceTzGAtJ3FGqIoZg1z3Xr_Wd0jGA6ClsV_zyF1e9J4c3KH1cEKnkgksWeuc9LJoLGDxOYSDwPkMTZI82mD6gJbkTtjPQPHUFJYW8mFVPI3kx79IMDN03VCoxCCI7MpWtxrAsgvdJwXBddzyM2um7D4u0LuAT8'

const menuItems = [
  { path: '/app/murid', icon: 'group', label: 'Pengurusan Murid', desc: 'Daftar & urus senarai murid' },
  { path: '/app/tasmik', icon: 'menu_book', label: 'Rekod Tasmik', desc: 'Isi borang rekod bacaan' },
  { path: '/app/kenaikan-kelas', icon: 'trending_up', label: 'Kenaikan Kelas Pukal', desc: 'Migrasi kelas & murid' },
  { path: '/app/arkib', icon: 'archive', label: 'Arkib Rekod Lama', desc: 'Rekod tahun lepas' },
  { path: '/app/laporan', icon: 'analytics', label: 'Laporan & Admin', desc: 'Eksport & tetapan admin' },
  { path: '/app/profil', icon: 'person', label: 'Profil Guru', desc: 'Profil & tetapan akaun' },
]

export default function MainMenu() {
  const navigate = useNavigate()

  return (
    <>
      <div className="sticky top-0 z-40 bg-background-dark/80 ios-blur px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
              <img src={PROFILE_IMG} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-white/70 font-medium">SK SUNGAI MANILA</p>
              <h2 className="text-lg font-bold leading-tight">Modul Tasmik</h2>
            </div>
          </div>
          <button
            type="button"
            className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Notifikasi"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Assalamualaikum, <span className="text-primary">Ustaz / Ustazah</span>
          </h1>
          <p className="text-white/60 mt-1">Sila pilih menu untuk tugasan hari ini.</p>
        </div>

        <div className="mb-8 p-4 rounded-xl bg-white/5 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Status Semasa</p>
              <p className="text-sm font-semibold">12 Murid Selesai Tasmik</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="grid-card flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-left"
            >
              <div className="icon-container w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-3">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-base mb-1">{item.label}</h3>
              <p className="text-xs text-white/50">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
