import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx'; 
import { FileSpreadsheet, RefreshCw, Search, User, Calendar, BookOpen } from 'lucide-react';

function ReportsAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Ambil data setiap kali halaman dibuka
  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasmik_records')
        .select('*')
        .order('date', { ascending: false }) // Tarikh terbaru di atas
        .order('created_at', { ascending: false }); // Jika tarikh sama, masa terbaru di atas

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Ralat mengambil data:', error.message);
      alert("Gagal memuatkan data. Sila semak sambungan internet.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Fungsi Muat Turun Excel (Direct to Device)
  const downloadExcel = () => {
    if (records.length === 0) {
      alert("Tiada data untuk dimuat turun.");
      return;
    }

    // Susun data untuk Excel
    const dataToExport = records.map((r, index) => ({
      'BIL': index + 1,
      'TARIKH': r.date,
      'NAMA & KELAS': r.student_name,
      'JENIS BACAAN': r.reading_type,
      'TAHAP/IQRA': r.level,
      'HALAMAN': r.page_number,
      'CATATAN': r.remarks || '-'
    }));

    // Proses bina fail Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Tasmik 2026");
    
    // Nama fail mengikut tarikh semasa muat turun
    const fileName = `Laporan_Tasmik_Digital_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Perintah muat turun ke peranti
    XLSX.writeFile(workbook, fileName);
  };

  // 3. Fungsi Carian (Filter)
  const filteredRecords = records.filter(r => 
    r.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto mb-24 min-h-screen bg-gray-50">
      {/* Header & Butang Muat Turun */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-green-900 italic uppercase flex items-center gap-2">
            <BookOpen className="text-green-600" size={32} /> Laporan Pentadbir
          </h1>
          <p className="text-gray-500 font-bold text-sm ml-1">Urus & pantau rekod tasmik murid 2026</p>
        </div>
        
        <button 
          onClick={downloadExcel}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all transform active:scale-95"
        >
          <FileSpreadsheet size={24} />
          MUAT TURUN EXCEL
        </button>
      </div>

      {/* Bar Carian & Butang Refresh */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Cari nama murid atau kelas..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button 
          onClick={fetchReports}
          title="Refresh Data"
          className="p-4 bg-white border-2 border-gray-100 rounded-2xl text-green-600 hover:bg-green-50 shadow-sm transition-colors"
        >
          <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Senarai Rekod (Laporan) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-green-800">
          <RefreshCw size={48} className="animate-spin mb-4" />
          <p className="font-black animate-pulse uppercase tracking-widest">Memproses Data Terkini...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((r) => (
              <div 
                key={r.id} 
                className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-green-700 font-black">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 uppercase text-sm md:text-base leading-tight">
                      {r.student_name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-gray-400 font-bold text-[11px]">
                      <span className="flex items-center gap-1 uppercase tracking-tighter">
                        <Calendar size={12} className="text-green-500" /> {r.date}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <span className="bg-gray-100 text-gray-700 text-[10px] px-4 py-2 rounded-xl font-black uppercase border border-gray-200">
                    {r.reading_type}
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] px-4 py-2 rounded-xl font-black uppercase border border-blue-100">
                    {r.level}
                  </span>
                  <span className="bg-orange-50 text-orange-700 text-[10px] px-4 py-2 rounded-xl font-black uppercase border border-orange-100">
                    Halaman: {r.page_number}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="font-bold text-gray-400 italic">Tiada rekod tasmik ditemui untuk carian ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsAdmin;