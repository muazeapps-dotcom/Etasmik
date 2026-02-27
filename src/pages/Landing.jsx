import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Users, 
  TrendingUp, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Award,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 0, todayReads: 0 });

  useEffect(() => {
    const getQuickStats = async () => {
      try {
        const { data: allData } = await supabase.from('tasmik_records').select('student_name');
        const uniqueStudents = new Set(allData?.map(item => item.student_name)).size;
        
        const today = new Date().toISOString().split('T')[0];
        const { count } = await supabase
          .from('tasmik_records')
          .select('*', { count: 'exact', head: true })
          .eq('date', today);
          
        setStats({ totalStudents: uniqueStudents || 0, todayReads: count || 0 });
      } catch (err) { 
        console.error(err); 
      }
    };
    getQuickStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#052c16] text-white pb-24 font-sans relative overflow-hidden">
      
      {/* LATAR BELAKANG GEOMETRI */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 pt-12 pb-20 px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 animate-pulse text-[10px] font-black uppercase tracking-widest">
          <Sparkles size={14} className="text-yellow-400" /> Premium Emerald Islamik
        </div>
        
        <div className="mb-10 flex flex-col items-center gap-6">
          <div className="text-3xl font-bold opacity-70 tracking-widest text-emerald-300 italic">﷽</div>
          
          {/* LOGO SEKOLAH DENGAN ANIMASI FLOAT */}
          <div className="p-4 bg-white rounded-[2.5rem] shadow-2xl shadow-green-950/50 animate-float">
            <img 
              src="/logo_sekolah.png" 
              alt="Logo SK Sungai Manila" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>

        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2 text-center">Unit Pendidikan Islam</p>
        <h1 className="text-4xl font-black italic tracking-tighter mb-4 leading-none text-center">
            SISTEM TASMIK <span className="text-emerald-400">DIGITAL</span>
        </h1>
        <p className="text-green-200/40 text-[11px] font-bold uppercase tracking-tight text-center">SK Sungai Manila • Sandakan</p>
      </div>

      {/* QUICK STATS */}
      <div className="px-6 -mt-10 relative z-20 max-w-xl mx-auto grid grid-cols-2 gap-4">
        <div className="bg-[#0a3d21]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl">
          <Users size={18} className="text-emerald-400 mb-2" />
          <span className="text-3xl font-black mb-1">{stats.totalStudents}</span>
          <span className="text-[8px] font-black text-green-200/30 uppercase tracking-[0.2em]">Murid Aktif</span>
        </div>
        <div className="bg-[#0a3d21]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl">
          <TrendingUp size={18} className="text-emerald-400 mb-2" />
          <span className="text-3xl font-black mb-1">{stats.todayReads}</span>
          <span className="text-[8px] font-black text-green-200/30 uppercase tracking-[0.2em]">Bacaan Hari Ini</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="px-6 mt-12 max-w-xl mx-auto space-y-4 relative z-10">
        <button onClick={() => navigate('/tasmik')} className="w-full flex items-center justify-between p-7 bg-emerald-600 rounded-[2.5rem] shadow-xl active:scale-95 transition-all text-white border-none cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white/20 rounded-2xl"><GraduationCap size={26} /></div>
            <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Mula Tasmik</p>
                <p className="text-[9px] opacity-60 font-bold uppercase tracking-wider text-white">Rekod Bacaan Murid</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-40" />
        </button>

        <button onClick={() => navigate('/reports')} className="w-full flex items-center justify-between p-7 bg-white/5 border border-white/10 rounded-[2.5rem] active:scale-95 transition-all cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><Award size={26} /></div>
            <div className="text-left font-black uppercase tracking-tight text-white/90">Laporan Utama</div>
          </div>
          <ChevronRight size={20} className="opacity-10" />
        </button>
      </div>

      <div className="mt-12 flex justify-center opacity-10">
        <Star size={16} />
      </div>

    </div>
  );
}

export default Landing;