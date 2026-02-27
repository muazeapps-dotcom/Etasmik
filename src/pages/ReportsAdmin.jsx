import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import { 
  Search, 
  RefreshCw, 
  ChevronRight, 
  Clock, 
  X,
  User,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Users,
  BarChart3
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
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const processLatestOnly = (data) => {
    const latestMap = new Map();
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(record => {
      latestMap.set(record.student_name, record);
    });
    const final = Array.from(latestMap.values()).sort((a, b) => a.student_name.localeCompare(b.student_name));
    setDisplayRecords(final);
  };

  const filteredData = displayRecords.filter(r => {
    const matchClass = selectedClass === 'SEMUA' || r.student_name.includes(`(${selectedClass})`);
    const matchSearch = r.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  const getStudentHistory = (name) => {
    return allRecords
      .filter(r => r.student_name === name)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // --- FUNGSI DOWNLOAD EXCEL ---
  const downloadExcel = () => {
    const dataToExport = filteredData.map(r => ({
      'Nama Murid': r.student_name,
      'Jenis': r.reading_type,
      'Tahap/Juz': r.level,
      'Muka Surat': r.page_number,
      'Catatan': r.remarks,
      'Tarikh': r.date
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Tasmik");
    XLSX.writeFile(workbook, `Laporan_Tasmik_${selectedClass}_${new Date().toLocaleDateString()}.xlsx`);
  };

  // --- PENGIRAAN STATISTIK ---
  const stats = {
    iqra13: filteredData.filter(r => r.reading_type === 'Iqra' && ['1','2','3'].includes(r.level)).length,
    iqra46: filteredData.filter(r => r.reading_type === 'Iqra' && ['4','5','6'].includes(r.level)).length,
    alquran: filteredData.filter(r => r.reading_type === 'Al-Quran').length,
    total: filteredData.length
  };

  return (
    <div className="p-4 max-w-6xl mx-auto mb-24 min-h-screen bg-gray-50/30">
      
      {/* HEADER & EXCEL BUTTON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-black text-green-900 italic tracking-tighter uppercase">Laporan Semua</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sistem Tasmik Digital 2026</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-100 hover:bg-green-800 transition-all"
          >
            <FileSpreadsheet size={18} /> Muat Turun Excel
          </button>
          <button onClick={fetchData} className="p-3 bg-white rounded-2xl shadow-sm text-green-600 border border-gray-100">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* STATS CARDS (KAD HIJAU) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Iqra 1-3', value: stats.iqra13, color: 'text-green-600' },
          { label: 'Iqra 4-6', value: stats.iqra46, color: 'text-emerald-600' },
          { label: 'Al-Quran', value: stats.alquran, color: 'text-teal-600' },
          { label: 'Jumlah', value: stats.total, color: 'text-green-900' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-green-50 flex items-center justify-between overflow-hidden relative group">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
              <BarChart3 size={60} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                <span className="text-[8px] font-bold text-gray-300 uppercase">Murid</span>
              </div>
            </div>
            <BarChart3 size={20} className="text-green-100" />
          </div>
        ))}
      </div>

      {/* FILTER KELAS */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {classes.map(c => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all whitespace-nowrap border-2 ${
              selectedClass === c ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-white text-gray-400 shadow-sm'
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
          placeholder="Cari nama murid..."
          className="w-full pl-14 pr-6 py-5 bg-white rounded-[2rem] border-none shadow-sm font-bold text-sm outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* LIST TABLE */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-gray-300 font-bold italic">Mengemas kini laporan...</div>
        ) : filteredData.length > 0 ? filteredData.map((r) => (
          <div 
            key={r.id}
            onClick={() => setSelectedStudent(r.student_name)}
            className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-green-200 transition-all cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                <User size={20} />
              </div>
              <div>
                <p className="font-black text-gray-800 text-[11px] uppercase leading-tight tracking-tight">{r.student_name}</p>
                <div className="flex items-center gap-3 mt-1 text-[9px] font-bold">
                   <span className="text-gray-300 flex items-center gap-1"><Calendar size={10}/> {r.date}</span>
                   <span className="text-green-600 uppercase italic bg-green-50 px-2 py-0.5 rounded">{r.reading_type} {r.level}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              <div>
                <p className="text-[8px] font-black text-gray-300 uppercase leading-none mb-1 text-center">Halaman</p>
                <p className="text-xl font-black text-green-700 italic leading-none">MS {r.page_number}</p>
              </div>
              <ChevronRight size={18} className="text-gray-200 group-hover:text-green-600" />
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic text-gray-300 font-bold">
            Tiada rekod untuk paparan ini.
          </div>
        )}
      </div>

      {/* MODAL HISTORY (SEJARAH MURID) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-green-950/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 bg-green-800 text-white relative">
              <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-all"><X size={20} /></button>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl"><Clock size={24} /></div>
                <div>
                  <p className="text-[9px] font-black text-green-300 uppercase tracking-widest mb-1 italic">Log Sejarah Murid</p>
                  <h2 className="text-xs font-black uppercase leading-tight tracking-tight pr-10">{selectedStudent}</h2>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {getStudentHistory(selectedStudent).map((h, idx) => (
                <div key={h.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative">
                  {idx === 0 && <span className="absolute top-0 right-0 bg-green-600 text-[8px] font-black text-white px-3 py-1 rounded-bl-xl uppercase italic">Terkini</span>}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Calendar size={12} /> {h.date}</span>
                    <span className="text-[11px] font-black text-green-700 uppercase">{h.reading_type} {h.level}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-gray-300 uppercase mb-1">Catatan:</p>
                      <p className="text-[11px] font-bold text-gray-600 italic">"{h.remarks || '-'}"</p>
                    </div>
                    <div className="text-right pl-4">
                       <p className="text-[8px] font-black text-gray-300 uppercase leading-none">Muka Surat</p>
                       <p className="text-xl font-black text-green-700 italic">MS {h.page_number}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white border-t border-gray-50">
               <button onClick={() => setSelectedStudent(null)} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all">Kembali</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsAdmin;