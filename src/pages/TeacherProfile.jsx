import { useNavigate } from 'react-router-dom'

const PROFILE_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQEvTGIQ9RB01BHRuqjOmDacszKBdy_FJ4LgaWcAHXwOEGAWUobZUOo1Uq5bo2vK9xRky8_nUHDf5pB-J6yhW8lpVjiTZpduK6ME3EQ1lf9Ia0aITeokcG6I21fm0SutFzOYHs1NQYnP6rK1V8UsK9XGDfSddXMj_zyR8VGRX0URGocCjsixKgobgCLrWosZUsauZpRBtX_wFhtkWFxHmFX7G_QT_J9eg31Jy6D5RWZ0ty6Gpctpgeg86puUbMyAYVMAiaKdOBohY1'

const serviceInfo = [
  { icon: 'badge', label: 'ID Kakitangan', value: 'GPI-770921-01' },
  { icon: 'calendar_today', label: 'Tarikh Berkhidmat', value: '15 Januari 2012' },
  { icon: 'school', label: 'Pengkhususan', value: 'Al-Quran & Tajwid' },
]

const contactInfo = [
  { icon: 'email', label: 'E-mel Rasmi', value: 'ahmad.zaki@moe.edu.my' },
  { icon: 'phone', label: 'No. Telefon', value: '+60 12-345 6789' },
]

export default function TeacherProfile() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background-dark text-white">
      <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button type="button" onClick={() => navigate('/app/utama')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors" aria-label="Kembali">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Profil Guru</h1>
        <button type="button" className="text-primary font-medium hover:opacity-80 transition-opacity">Edit</button>
      </header>

      <main className="max-w-md mx-auto px-6 pb-24">
        <div className="relative flex flex-col items-center mt-6 mb-10">
          <div className="absolute -top-4 w-64 h-64 islamic-pattern rounded-full pointer-events-none" aria-hidden />
          <div className="relative z-10 p-1.5 rounded-full bg-gradient-to-tr from-primary to-emerald-400">
            <div className="bg-background-dark p-1 rounded-full">
              <img
                alt="Profil Guru"
                className="w-32 h-32 rounded-full object-cover shadow-2xl"
                src={PROFILE_IMG}
              />
            </div>
            <div className="absolute bottom-1 right-2 bg-primary text-background-dark p-1.5 rounded-full border-4 border-background-dark">
              <span className="material-symbols-outlined text-sm">verified_user</span>
            </div>
          </div>
          <div className="mt-6 text-center z-10">
            <h2 className="text-2xl font-bold tracking-tight">Ustaz Ahmad Zaki</h2>
            <p className="text-primary font-medium mt-1">Guru Pendidikan Islam (GPI)</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              SK Sungai Manila
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">42</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mt-1">Pelajar Tasmik</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">12</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mt-1">Tahun Khidmat</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest px-1 mb-3">Maklumat Perkhidmatan</h3>
            <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
              {serviceInfo.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center px-5 py-4 ${i < serviceInfo.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-primary">{row.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/50">{row.label}</p>
                    <p className="font-medium">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest px-1 mb-3">Hubungi</h3>
            <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
              {contactInfo.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center px-5 py-4 ${i < contactInfo.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                    <span className="material-symbols-outlined text-primary">{row.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/50">{row.label}</p>
                    <p className="font-medium">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-3">
          <button
            type="button"
            className="w-full bg-primary hover:bg-emerald-500 text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profil Lengkap
          </button>
          <button
            type="button"
            className="w-full bg-red-500/10 text-red-500 font-semibold py-4 rounded-xl transition-all hover:bg-red-500 hover:text-white flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Log Keluar Akaun
          </button>
        </div>
        <div className="h-8" aria-hidden />
      </main>

    </div>
  )
}
