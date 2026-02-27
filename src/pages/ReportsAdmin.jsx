import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Search, 
  RefreshCw, 
  ChevronRight, 
  Clock, 
  X,
  User,
  BookOpen,
  Calendar
} from 'lucide-react';

function ReportsAdmin() {
  const [allRecords, setAllRecords] = useState([]); 
  const [displayRecords, setDisplayRecords] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [selectedClass, setSelectedClass] = useState('SEMUA');

  const classes = ['SEMUA', '4 ARIF', '4 PINTAR', '4 BIJAK', '4 CERDIK', '5 ARIF', '5 PINTAR', '5 BIJAK', '5 CERDIK', '6 ARIF', '6 PINTAR', '6 BIJAK', '6 CERDIK'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasmik_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        setAllRecords(data);
        processLatestOnly(data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI UTAMA: Menghilangkan tindan di paparan depan
  const processLatestOnly = (data) => {
    const latestMap = new Map();
    // Susun dari tarikh lama ke baru supaya yang terbaru menggantikan yang lama dalam Map
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sorted.forEach(record => {
      latestMap.set(record.student_name, record);
    });
    
    // Tukar kembali ke array dan susun ikut abjad
    const final = Array.from(latestMap.values()).sort((a, b) => a.student_name.localeCompare(b.student_name));
    setDisplayRecords(final);
  };

  // TAPISAN: Mengikut kelas dan carian nama
  const filteredData = displayRecords.filter(r => {
    const matchClass = selectedClass === 'SEMUA' || r.student_name.includes(`(${selectedClass})`);
    const matchSearch = r.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  // SEJARAH: Ambil semua rekod lama untuk murid yang diklik
  const getStudentHistory = (name) => {
    return allRecords
      .filter(r => r.student_name === name)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Terbaru di atas
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mb-24 min-h-screen bg-gray-50/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-black text-green-900 italic tracking-tighter">LAPORAN TASMIK</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sistem Tasmik Digital 2026</p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-3 bg-white rounded-2xl shadow-sm hover:bg-green-50 text-green-600 transition-all border border-gray-100 self-end sm:self-center"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* FILTER KELAS (Scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {classes.map(c => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all whitespace-nowrap border-2 ${
              selectedClass === c 
              ? 'bg-green-600 border-green-600 text-white shadow-lg scale-105' 
              : 'bg-white border-white text-gray-400 shadow-sm hover:border-green-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        <input 
          type="text"
          placeholder="Cari nama murid untuk lihat sejarah..."
          className="w-full pl-14 pr-6 py-5 bg-white rounded-[2rem] border-none shadow-sm font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* SENARAI UTAMA (LATEST ONLY) */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-20 text-gray-300 font-bold italic animate-pulse">Sedang mengemas kini laporan...</div>
        ) : filteredData.length > 0 ? filteredData.map((r) => (
          <div 
            key={r.id}
            onClick={() => setSelectedStudent(r.student_name)}
            className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-green-200 transition-all cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                <User size={20} />
              </div>
              <div>
                <p className="font-black text-gray-800 text-[11px] uppercase leading-tight tracking-tight">{r.student_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-green-600 uppercase italic bg-green-50 px-2 py-0.5 rounded">
                    {r.reading_type} {r.level}
                  </span>
                  <span className="text-[9px] text-gray-300 font-bold flex items-center gap-1">
                    <Calendar size={10} /> {r.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-300 uppercase leading-none">Muka Surat</p>
                <p className="text-xl font-black text-green-700 italic">{r.page_number}</p>
              </div>
              <ChevronRight size={18} className="text-gray-200 group-hover:text-green-600" />
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <BookOpen size={48} className="mx-auto text-gray-100 mb-4" />
             <p className="text-gray-400 font-bold italic text-sm">Tiada rekod untuk paparan ini.</p>
          </div>
        )}
      </div>

      {/* MODAL SEJARAH BACAAN (Pop-up) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-green-950/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            
            {/* Header Modal */}
            <div className="p-8 bg-green-600 text-white relative">
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl"><Clock size={24} /></div>
                <div className="pr-8">
                  <p className="text-[9px] font-black text-green-200 uppercase tracking-widest mb-1">Log Sejarah Murid</p>
                  <h2 className="text-xs font-black uppercase leading-tight tracking-tight">{selectedStudent}</h2>
                </div>
              </div>
            </div>

            {/* Isi Modal (Senarai Sejarah) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {getStudentHistory(selectedStudent).map((h, idx) => (
                <div key={h.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative">
                  {idx === 0 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-[8px] font-black text-white px-3 py-1 rounded-bl-xl uppercase">Terbaharu</span>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {h.date}
                    </span>
                    <span className="text-[11px] font-black text-green-700 uppercase">{h.reading_type} {h.level}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-gray-300 uppercase mb-1">Catatan Guru:</p>
                      <p className="text-[11px] font-bold text-gray-600 italic bg-gray-50 p-2 rounded-lg">"{h.remarks || '-'}"</p>
                    </div>
                    <div className="text-right border-l pl-4 border-gray-100">
                       <p className="text-[8px] font-black text-gray-300 uppercase leading-none">Muka Surat</p>
                       <p className="text-xl font-black text-green-700 italic">{h.page_number}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Butang Tutup */}
            <div className="p-6 bg-white border-t border-gray-50">
               <button 
                onClick={() => setSelectedStudent(null)}
                className="w-full py-4 bg-green-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-200 active:scale-95 transition-all"
               >
                 Kembali ke Senarai
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsAdmin;