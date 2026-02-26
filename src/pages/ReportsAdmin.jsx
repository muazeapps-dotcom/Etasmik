import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

const ReportsAdmin = () => {
  const [groupedReports, setGroupedReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState(null);
  
  // State untuk Pengurusan Murid (Edit)
  const [editingMurid, setEditingMurid] = useState(null);
  const [formData, setFormData] = useState({ name: '', class: '', supervisor: '' });

  // SENARAI 12 KELAS RASMI (Wajib Muncul)
  const senaraiKelasRasmi = [
    '4 ARIF', '4 BIJAK', '4 CERDIK', '4 PINTAR',
    '5 ARIF', '5 BIJAK', '5 CERDIK', '5 PINTAR',
    '6 ARIF', '6 BIJAK', '6 CERDIK', '6 PINTAR'
  ];

  const fetchTasmikReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      const groups = data.reduce((acc, student) => {
        const className = student.class.toUpperCase().trim();
        if (!acc[className]) acc[className] = [];
        acc[className].push(student);
        return acc;
      }, {});
      setGroupedReports(groups);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasmikReports();
  }, []);

  // --- FUNGSI TINDAKAN (EDIT & PADAM) ---
  const handleEdit = (murid) => {
    setEditingMurid(murid.id);
    setFormData({ 
      name: murid.name, 
      class: murid.class, 
      supervisor: murid.supervisor || '' 
    });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('students')
      .update({ 
        name: formData.name.toUpperCase(), 
        class: formData.class.toUpperCase(), 
        supervisor: formData.supervisor.toUpperCase() 
      })
      .eq('id', editingMurid);

    if (!error) {
      setEditingMurid(null);
      fetchTasmikReports(); // Refresh data supaya tidak bertindan
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Padam data murid ini secara kekal?")) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (!error) fetchTasmikReports();
    }
  };

  const downloadExcel = (className, students) => {
    const data = students.map(s => ({
      'KELAS': s.class,
      'NAMA MURID': s.name,
      'PENYELIA': s.supervisor || 'Tiada'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_Tasmik_${className}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#102219] p-4 md:p-10 text-white font-display pb-28">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#D4AF37] tracking-widest uppercase">PENGURUSAN & LAPORAN</h1>
          <p className="text-[#10b981] text-xs mt-2 italic">Sistem Tasmik Digital SK Sungai Manila</p>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto mt-4 rounded-full shadow-[0_0_10px_#D4AF37]"></div>
        </header>

        {/* MODAL EDIT (Popup) */}
        {editingMurid && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#064e3b] p-8 rounded-3xl border-2 border-[#D4AF37] w-full max-w-md shadow-2xl">
              <h2 className="text-[#D4AF37] font-bold mb-6 text-center tracking-widest">KEMASKINI MURID</h2>
              <div className="space-y-4">
                <input 
                  className="w-full bg-[#102219] p-4 rounded-xl border border-[#D4AF37]/30 uppercase text-sm text-white focus:border-[#D4AF37] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="NAMA MURID"
                />
                <select 
                  className="w-full bg-[#102219] p-4 rounded-xl border border-[#D4AF37]/30 text-sm text-white outline-none"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  {senaraiKelasRasmi.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <input 
                  className="w-full bg-[#102219] p-4 rounded-xl border border-[#D4AF37]/30 uppercase text-sm text-white focus:border-[#D4AF37] outline-none"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                  placeholder="GURU PENYELIA"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={handleUpdate} className="flex-1 bg-[#D4AF37] text-[#022c22] py-3 rounded-xl font-black text-xs uppercase hover:bg-[#F9E2AF]">Simpan</button>
                <button onClick={() => setEditingMurid(null)} className="flex-1 bg-red-900/50 text-white py-3 rounded-xl font-bold text-xs uppercase hover:bg-red-800">Batal</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-[#D4AF37] font-bold animate-pulse">MEMPROSES DATA...</div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {senaraiKelasRasmi.map((className) => (
              <div key={className} className="rounded-3xl overflow-hidden border border-[#064e3b] bg-[#022c22]/40 shadow-xl">
                
                {/* BUTANG KELAS */}
                <button 
                  onClick={() => setActiveClass(activeClass === className ? null : className)}
                  className={`w-full flex justify-between items-center p-6 transition-all ${
                    activeClass === className ? 'bg-[#064e3b] text-[#F9E2AF]' : 'text-[#D4AF37] hover:bg-[#064e3b]/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">📁 {className}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#D4AF37]/20 text-[#F9E2AF] px-3 py-1 rounded-full text-[10px] font-bold border border-[#D4AF37]/30">
                      {groupedReports[className]?.length || 0} MURID
                    </span>
                    <span className="text-xl transition-transform duration-300">
                      {activeClass === className ? '▲' : '▼'}
                    </span>
                  </div>
                </button>

                {/* SENARAI MURID DALAM KELAS */}
                {activeClass === className && (
                  <div className="p-5 bg-[#102219]/50 border-t border-[#064e3b] animate-fadeIn">
                    {!groupedReports[className] || groupedReports[className].length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-gray-500 italic text-xs tracking-widest uppercase">Belum ada murid didaftarkan</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm mb-6">
                          <thead>
                            <tr className="text-[#D4AF37] text-[10px] uppercase tracking-widest border-b border-[#064e3b]/50">
                              <th className="p-3">NAMA PENUH</th>
                              <th className="p-3">PENYELIA</th>
                              <th className="p-3 text-center">AKSI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedReports[className].map((murid) => (
                              <tr key={murid.id} className="border-b border-[#064e3b]/20 hover:bg-[#064e3b]/10 transition-colors">
                                <td className="p-4 font-bold uppercase text-[11px] leading-tight text-gray-200">{murid.name}</td>
                                <td className="p-4 text-[#10b981] text-[10px] italic uppercase">{murid.supervisor || '-'}</td>
                                <td className="p-4 flex justify-center gap-4">
                                  <button onClick={() => handleEdit(murid)} className="text-blue-400 font-bold text-[10px] uppercase hover:underline">Edit</button>
                                  <button onClick={() => handleDelete(murid.id)} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Padam</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button 
                          onClick={() => downloadExcel(className, groupedReports[className])}
                          className="w-full bg-[#D4AF37] text-[#022c22] py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-lg hover:bg-[#F9E2AF] transition-all"
                        >
                          MUAT TURUN EXCEL {className}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAdmin;