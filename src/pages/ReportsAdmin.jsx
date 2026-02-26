import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx'; 
import { FileSpreadsheet, RefreshCw, Search, User, LayoutDashboard, ChevronRight, BarChart3 } from 'lucide-react';

const CLASSES = ['SEMUA', '4 ARIF', '4 PINTAR', '4 BIJAK', '4 CERDIK', '5 ARIF', '5 PINTAR', '5 BIJAK', '5 CERDIK', '6 ARIF', '6 PINTAR', '6 BIJAK', '6 CERDIK'];

function ReportsAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('SEMUA');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    // Ambil data terbaru (descending) supaya tidak bertindan di paparan
    const { data, error } = await supabase
      .from('tasmik_records')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error) setRecords(data || []);
    setLoading(false);
  }

  // 1. LOGIK TAPISAN (Filter mengikut Tab & Search)
  const filteredRecords = records.filter(r => {
    const matchClass = activeTab === 'SEMUA' || r.student_name.includes(`(${activeTab})`);
    const matchSearch = r.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  // 2. LOGIK STATISTIK (Ringkasan Keseluruhan Berdasarkan Rekod Terkini Murid)
  const getStats = (dataList) => {
    const latestPerStudent = {};
    // Ambil hanya rekod paling baru untuk setiap murid supaya statistik tepat
    dataList.forEach(r => {
      if (!latestPerStudent[r.student_name]) {
        latestPerStudent[r.student_name] = r;
      }
    });

    const stats = { 'Iqra 1-3': 0, 'Iqra 4-6': 0, 'Al-Quran': 0, 'Jumlah': 0 };
    Object.values(latestPerStudent).forEach(r => {
      stats['Jumlah']++;
      if (r.reading_type === 'Al-Quran') {
        stats['Al-Quran']++;
      } else {
        const lvl = parseInt(r.level);
        if (lvl <= 3) stats['Iqra 1-3']++;
        else stats['Iqra 4-6']++;
      }
    });
    return stats;
  };

  const stats = getStats(filteredRecords);

  // 3. FUNGSI DOWNLOAD EXCEL
  const downloadExcel = () => {
    const exportData = filteredRecords.map((r, i) => ({
      'BIL': i + 1,
      'TARIKH': r.date,
      'NAMA & KELAS': r.student_name,
      'JENIS BACAAN': r.reading_type,
      'TAHAP/JUZ': r.level,
      'HALAMAN': r.page_number,
      'CATATAN': r.remarks
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_Tasmik_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto mb-24 min-h-screen bg-gray-50">
      {/* Header & Excel Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-green-900 uppercase italic flex items-center gap-2">
            <LayoutDashboard size={32} /> Laporan {activeTab}
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Sistem Tasmik Digital 2026</p>
        </div>
        <button onClick={downloadExcel} className="w-full md:w-auto bg-green-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:bg-green-700 active:scale-95 transition-all">
          <FileSpreadsheet size={20} /> MUAT TURUN EXCEL
        </button>
      </div>

      {/* STATISTIK RINGKASAN (Dashboard Atas) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="bg-white p-5 rounded-[2rem] shadow-sm border-b-4 border-green-500">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-gray-400 uppercase">{key}</p>
              <BarChart3 size={16} className="text-green-200" />
            </div>
            <p className="text-3xl font-black text-green-700 mt-1">{val} <span className="text-[10px] text-gray-400">MURID</span></p>
          </div>
        ))}
      </div>

      {/* TOMBOL KELAS (Navigation Tabs) */}
      <div className="mb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveTab(c)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-[10px] transition-all border-2 ${
                activeTab === c 
                ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8">
        <input 
          type="text" placeholder="Cari nama murid..."
          className="w-full p-5 pl-14 rounded-3xl bg-white border-none shadow-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-5 top-5 text-gray-300" />
        <button onClick={fetchReports} className="absolute right-4 top-4 p-1 text-green-600"><RefreshCw size={24} className={loading ? 'animate-spin' : ''}/></button>
      </div>

      {/* SENARAI REKOD */}
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-20 font-black text-green-800 animate-pulse tracking-widest">MEMPROSES DATA...</div>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-black">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-sm uppercase leading-tight">{r.student_name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tighter italic">{r.date} • {r.reading_type} TAHAP {r.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-gray-300 uppercase">Halaman</p>
                  <p className="font-black text-green-600">MS {r.page_number}</p>
                </div>
                <ChevronRight className="text-gray-200 group-hover:text-green-500 transition-colors" size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-100 rounded-[3rem] border-2 border-dashed border-gray-300 font-bold text-gray-400 italic">
            Tiada rekod tasmik ditemui untuk {activeTab}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsAdmin;