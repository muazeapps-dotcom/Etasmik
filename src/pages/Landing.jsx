import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Award,
  Star,
  Circle
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
      
      {/* 1. LATAR BELAKANG GEOMETRI ISLAMIK (Lembut) */}
      <div className="absolute inset-0 opacity-[0.03] z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="islamicPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0l5 15h15l-12 9 5 15-13-10-Star3 10 5-15-12-9h15z" fill="currentColor"/>
              <Circle cx="20" cy="20" r="2" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicPattern)" />
        </svg>
      </div>

      {/* 2. HERO SECTION */}
      <div className="relative overflow-hidden pt-12 pb-20 px-6 bg-gradient-to-b from-[#0a4d27] to-[#052c16] z-10">
        {/* Dekorasi Cahaya Bulan Bintang */}
        <div className="absolute top-10 right-10 opacity-20 text-yellow-300">
           <Star size={60} strokeWidth={1}/>
           <Circle size={40} className="absolute -top-3 -left-3" strokeWidth={1}/>
        </div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-pulse">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Premium Emerald Islamik</span>
          </div>
          
          <div className="mb-10 flex flex-col items-center gap-4">
            {/* KALIGRAFI BASMALAH (Gaya Kufi Lembut) */}
            <div className="text-3xl font-bold opacity-70 tracking-widest text-emerald-300 italic">
                ﷽
            </div>
            
            {/* Ikon Buku Terapung */}
            <div className="p-6 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-[2.5rem] shadow-2xl shadow-green-950/50 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <BookOpen size={50} className="text-white" />
            </div>
          </div>

          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">Unit Pendidikan Islam</p>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 leading-none">
            SISTEM TASMIK <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">DIGITAL</span>
          </h1>
          <p className="text-green-200/40 text-[11px] font-bold max-w-[280px] mx-auto leading-relaxed uppercase tracking-tight">
            SK Sungai Manila • Digitalisasi Pengurusan Tasmik Efisien
          </p>
        </div>
      </div>

      {/* 3. QUICK STATS */}
      <div className="px-6 -mt-10 relative z-20 max-w-xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0a3d21]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-2 bg-emerald-500/10 rounded-lg mb-3">
               <Users size={18} className="text-emerald-400" />
            </div>
            <span className="text-3xl font-black mb-1 group-hover:scale-110 transition-transform">{stats.totalStudents}</span>
            <span className="text-[8px] font-black text-green-200/30 uppercase tracking-[0.2em]">Murid Aktif</span>
          </div>
          <div className="bg-[#0a3d21]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-2 bg-emerald-500/10 rounded-lg mb-3">
               <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <span className="text-3xl font-black mb-1 group-hover:scale-110 transition-transform">{stats.todayReads}</span>
            <span className="text-[8px] font-black text-green-200/30 uppercase tracking-[0.2em]">Bacaan Hari Ini</span>
          </div>
        </div>
      </div>

      {/* 4. MENU NAVIGATION */}
      <div className="px-6 mt-12 max-w-xl mx-auto space-y-4 relative z-10">
        <h3 className="text-[9px] font-black text-green-200/20 uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
            <Star size={12} className="text-emerald-500" /> Menu Pintas
        </h3>
        
        <button 
          onClick={() => navigate('/tasmik')}
          className="w-full flex items-center justify-between p-7 bg-gradient-to-br from-emerald-500 to-green-700 rounded-[2.5rem] shadow-xl group active:scale-95 transition-all relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
             <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#islamicPattern)" /></svg>
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
              <GraduationCap size={26} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-black text-sm uppercase tracking-tight">Mula Tasmik</p>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">Rekod Bacaan Murid</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/40 group-hover:translate-x-1 transition-all" />
        </button>

        <button 
          onClick={() => navigate('/reports')}
          className="w-full flex items-center justify-between p-7 bg-white/5 border border-white/10 rounded-[2.5rem] group active:scale-95 transition-all hover:bg-white/10 relative overflow-hidden"
        >
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <Award size={26} />
            </div>
            <div className="text-left">
              <p className="font-black text-sm uppercase tracking-tight text-white/90">Laporan Utama</p>
              <p className="text-[9px] text-green-200/30 font-bold uppercase tracking-wider">Analisis & Sejarah</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/10 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* FOOTER */}
      <div className="mt-20 text-center opacity-20 relative z-10 flex flex-col items-center gap-2">
        <Star size={16} className="text-yellow-300" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em]">Premium Emerald Islamik • 2026</p>
      </div>
    </div>
  );
}

export default Landing;