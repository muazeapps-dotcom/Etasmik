import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx'; 
import { FileSpreadsheet, RefreshCw, Search, User, Calendar } from 'lucide-react';

function ReportsAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  // --- FUNGSI AMBIL DATA (Sangat Penting) ---
  async function fetchReports() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasmik_records')
        .select(`
          *,
          students:student_id (
            name,
            class
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- FUNGSI DOWNLOAD EXCEL ---
  const downloadExcel = () => {
    if (records.length === 0) {
      alert("Tiada data untuk dimuat turun");
      return;
    }

    const dataToExport = records.map((r, index) => ({
      No: index + 1,
      Tarikh: r.date,
      Nama_Murid: r.students?.name || 'N/A',
      Kelas: r.students?.class || 'N/A',
      Jenis_Bacaan: r.reading_type,
      Tahap: r.level,
      Halaman: r.page_number,
      Catatan: r.remarks || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekod Tasmik");
    XLSX.writeFile(workbook, `Laporan_Tasmik_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredRecords = records.filter(r => 
    r.students?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.students?.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto mb-24 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-green-900 italic uppercase leading-none">Rekod Laporan</h1>
          <div className="h-1 w-20 bg-green-500 mt-2 rounded-full"></div>
        </div>
        
        <button 
          onClick={downloadExcel}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg transition-all transform active:scale-95"
        >
          <FileSpreadsheet size={24} />
          MUAT TURUN EXCEL
        </button>
      </div>

      {/* Search & Refresh Section */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Cari nama murid atau kelas..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchReports}
          className="p-4 bg-white border-2 border-gray-100 rounded-2xl text-green-600 hover:bg-green-50 shadow-sm transition-colors"
        >
          <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Data List Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw size={40} className="animate-spin text-green-600 mb-4" />
          <p className="font-black text-green-800 animate-pulse">MEMUATKAN DATA...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-green-700 font-black text-xl shadow-inner">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 uppercase text-lg leading-tight">
                      {r.students?.name || 'Nama Tidak Ditemui'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-md font-black uppercase">
                        {r.students?.class || 'N/A'}
                      </span>
                      <span className="text-gray-400 font-bold text-[11px] flex items-center gap-1 uppercase">
                        <Calendar size={12} /> {r.date}
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
              <p className="font-bold text-gray-400 italic">Tiada rekod tasmik ditemui.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsAdmin;