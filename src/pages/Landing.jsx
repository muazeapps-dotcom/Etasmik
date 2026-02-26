import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#064e3b] relative overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-metallic/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-12">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="text-gold-soft/80 text-xs font-bold tracking-[0.3em] uppercase">
            Unit Pendidikan Islam
          </div>
          <div className="text-white/90 text-sm font-medium tracking-widest uppercase">
            SK Sungai Manila
          </div>
          
          <div className="relative mt-8">
            <div className="w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full flex items-center justify-center border border-white/10">
              <span className="material-symbols-outlined text-7xl text-emerald-400">menu_book</span>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <h2 className="text-white/80 text-2xl font-light tracking-tight italic">Sistem Tasmik</h2>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-gold-metallic tracking-tighter">
              Digital
            </h1>
          </div>
        </div>

        {/* Button Section */}
        <div className="w-full space-y-8">
          <div className="flex flex-col gap-5">
            <button
              type="button"
              onClick={() => window.location.hash = 'students'}
              className="group relative w-full overflow-hidden h-18 py-5 rounded-2xl transition-all active:scale-95 glass-button gold-border-glow"
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10 flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-metallic/20 flex items-center justify-center border border-gold-metallic/30">
                  <span className="material-symbols-outlined text-gold-soft text-2xl">lock_open</span>
                </div>
                <span className="text-white text-xl font-bold tracking-wide">Log Masuk Guru</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-metallic to-transparent" />
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

      {/* Footer bar */}
      <div className="relative z-30 w-full flex justify-center pb-6 mt-12">
        <div className="w-32 h-1.5 bg-white/20 rounded-full" />
      </div>
    </div>
  );
};

export default Landing;