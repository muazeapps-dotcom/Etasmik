import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx'; // Import library excel
import { Download, FileSpreadsheet } from 'lucide-react';

function ReportsAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
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

  // FUNGSI UTAMA UNTUK DOWNLOAD EXCEL
  const downloadExcel = () => {
    const dataToExport = records.map(r => ({
      Tarikh: r.date,
      Nama: r.students?.name || 'N/A',
      Kelas: r.students?.class || 'N/A',
      Jenis: r.reading_type,
      Tahap: r.level,
      Halaman: r.page_number
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Tasmik");
    XLSX.writeFile(workbook, `Laporan_Tasmik_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-green-800 uppercase italic">Rekod Laporan</h1>
        
        {/* BUTANG EXCEL */}
        <button 
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all"
        >
          <FileSpreadsheet size={20} />
          MUAT TURUN EXCEL
        </button>
      </div>

      {loading ? (
        <p className="text-center font-bold">Memuatkan data...</p>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-3xl shadow-md border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-gray-800 uppercase">{r.students?.name}</h3>
                  <p className="text-xs font-bold text-gray-400">{r.students?.class} • {r.date}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                  {r.reading_type}
                </span>
              </div>
              <div className="mt-2 text-sm font-bold text-gray-600">
                {r.level} - Halaman {r.page_number}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportsAdmin;