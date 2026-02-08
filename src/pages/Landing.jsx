import { useNavigate } from 'react-router-dom'

const STATUS_BAR_TIME = '9:41'
const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIifJaN7Ryy_8PaMovJSshJnuTpULvGjoOYu3hcSjALDcbpnjErXb-4_7GNRx1WIiO2QLxQGzQHNP7EkOA0PuH-HmMSJuWD3q-UtzhBKYo_ZjcUu4KytTYiOJZR7U4Vda8RXhmxBF4D06gkO9agYW6sIr8w_7-_ygPTXfT3gCvC_KcJMiK_d3IgTYPJlX9KAANiIRzjuz7aziBjz54SdUJ2tikCpphUKi2eZXKFJMboPwcDcQcP_Soaus2Ja0iaPdtU_tYVRWPtm_W'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto overflow-hidden shadow-2xl bg-emerald-premium">
      <div className="absolute inset-0 islamic-pattern-overlay opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/20 via-transparent to-black/60 pointer-events-none" aria-hidden />

      {/* Status bar */}
      <div className="relative z-30 flex justify-between items-center px-8 pt-4 pb-2 text-white">
        <span className="text-sm font-semibold">{STATUS_BAR_TIME}</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">signal_cellular_4_bar</span>
          <span className="material-symbols-outlined text-[18px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-between px-8 py-10">
        <div className="flex flex-col items-center w-full">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-125" aria-hidden />
            <img
              alt="Logo SK Sungai Manila"
              className="relative z-10 w-full h-full object-contain brightness-125 contrast-125"
              src={LOGO_URL}
            />
          </div>
          <div className="text-center">
            <p className="text-gold-soft text-[11px] font-bold tracking-[0.5em] uppercase mb-1 drop-shadow-md">
              Unit Pendidikan Islam
            </p>
            <h2 className="text-white text-sm font-medium tracking-[0.2em] mb-4">SK SUNGAI MANILA</h2>
          </div>
        </div>

        <div className="relative w-full flex flex-col items-center justify-center py-4">
          <div className="absolute w-72 h-72 bg-emerald-glow/10 rounded-full blur-[100px]" aria-hidden />
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 border border-gold-metallic/20 rounded-full rotate-45" aria-hidden />
            <div className="absolute w-80 h-80 border border-emerald-glow/20 rounded-full -rotate-45" aria-hidden />
            <div className="absolute w-72 h-72 border-[0.5px] border-gold-metallic/40 rounded-full animate-[spin_30s_linear_infinite]" aria-hidden />
            <div className="relative z-10 book-glow-3d">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <span
                  className="material-symbols-outlined filled text-emerald-glow text-[11rem] opacity-90 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}
                  aria-hidden
                >
                  auto_stories
                </span>
                <div className="absolute inset-0 bg-emerald-glow/30 blur-3xl rounded-full" aria-hidden />
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <h1 className="text-3xl font-light tracking-tight text-white">
              Sistem Tasmik
              <br />
              <span className="text-6xl font-extrabold shimmer-gold-text tracking-tight italic">Digital</span>
            </h1>
          </div>
        </div>

        <div className="w-full space-y-8">
          <div className="flex flex-col gap-5">
            <button
              type="button"
              onClick={() => navigate('/app/utama')}
              className="group relative w-full overflow-hidden h-18 py-4 rounded-2xl transition-all active:scale-95 glass-button gold-border-glow"
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" aria-hidden />
              <div className="relative z-10 flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-metallic/20 flex items-center justify-center border border-gold-metallic/30">
                  <span className="material-symbols-outlined text-gold-soft text-2xl">lock_open</span>
                </div>
                <span className="text-white text-xl font-bold tracking-wide">Log Masuk Guru</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent" aria-hidden />
            </button>
          </div>
          <div className="text-center">
            <div className="inline-flex flex-col items-center opacity-60">
              <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-gold-soft mb-3">
                Premium Emerald Edition
              </span>
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 w-full flex justify-center pb-3">
        <div className="w-32 h-1.5 bg-white/20 rounded-full" aria-hidden />
      </div>
    </div>
  )
}
