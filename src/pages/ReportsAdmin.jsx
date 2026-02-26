import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx'; 
import { FileSpreadsheet, RefreshCw, Search } from 'lucide-react';

function ReportsAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasmik_records')
        .select(`
          *,
          students (name, class)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // FUNGSI MUAT TURUN EXCEL
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
    
    // Simpan fail
    XLSX.writeFile(workbook, `Laporan_Tasmik_Digital_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredRecords = records.filter(r => 
    r.students?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.students?.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto mb-24">
      {/* Header & Butang Excel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-green-900 italic uppercase">Laporan Pentadbir</h1>
          <p className="text-gray-500 font-bold text-sm">Urus dan muat turun rekod tasmik murid.</p>
        </div>
        
        <button 
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black shadow-xl transition-all transform active:scale-95"
        >
          <FileSpreadsheet size={24} />
          MUAT TURUN EXCEL
        </button>
      </div>

      {/* Carian & Refresh */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Cari nama murid atau kelas..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchReports}
          className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Senarai Rekod */}
      {loading ? (
        <div className="text-center py-10 font-black text-green-800 animate-pulse">MEMUATKAN DATA...</div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-black text-xl">
                    {r.students?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 uppercase leading-tight">{r.students?.name}</h3>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">{r.students?.class} • {r.date}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                    {r.reading_type}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                    {r.level}
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                    M/S: {r.page_number}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="font-bold text-gray-400 italic">Tiada rekod dijumpai.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsAdmin;