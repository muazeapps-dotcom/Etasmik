import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'; // Untuk link ke laporan
import { BookOpen, Search, User, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

function TasmikInput() {
  const navigate = useNavigate(); // Fungsi untuk pindah halaman
  const [classes, setClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk borang
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [readingType, setReadingType] = useState('Al-Quran');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => { fetchAllStudents(); }, []);

  useEffect(() => {
    if (selectedClass) {
      const filtered = allStudents.filter(s => 
        String(s.class || '').trim().toUpperCase() === selectedClass.toUpperCase()
      );
      setStudents(filtered);
    }
  }, [selectedClass, allStudents]);

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (error) throw error;
      if (data) {
        setAllStudents(data);
        const uniqueClasses = [...new Set(data.map(item => String(item.class || '').trim()))]
          .filter(Boolean).sort();
        setClasses(uniqueClasses);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e, student) => {
    e.preventDefault();
    if (!level || !pageNumber) {
      alert("Sila isi Tahap/Juzuk dan Halaman!");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('tasmik_records').insert([{
        student_id: student.id,
        student_name: student.name,
        class: student.class,
        reading_type: readingType,
        level: level,
        page_number: parseInt(pageNumber),
        remarks: remarks,
        date: new Date().toISOString()
      }]);

      if (error) throw error;

      alert('✅ REKOD BERJAYA DISIMPAN! Membuka laporan...');
      
      // Pindah terus ke halaman laporan
      navigate('/reports'); // Pastikan path ini betul mengikut App.jsx cikgu
      
    } catch (err) { 
      alert('Gagal simpan: ' + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* HEADER */}
      <div className="bg-green-800 p-6 text-white rounded-b-3xl shadow-lg">
        <h1 className="text-xl font-black flex items-center gap-2"><BookOpen /> INPUT TASMIK</h1>
        <p className="text-[10px] opacity-80 uppercase font-bold">Pilih murid dan catat bacaan</p>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* LANGKAH 1: PILIH KELAS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-[10px] font-black text-green-600 mb-3 uppercase text-center tracking-widest">1. Pilih Kelas</p>
          <div className="grid grid-cols-3 gap-2">
            {classes.map(c => (
              <button key={c} onClick={() => {setSelectedClass(c); setActiveStudentId(null);}}
                className={`py-2 rounded-xl font-black text-[10px] border-2 transition-all ${selectedClass === c ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-400 border-gray-100'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* LANGKAH 2: CARI & PILIH MURID */}
        {selectedClass && (
          <div className="space-y-3">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <input type="text" placeholder="Cari nama murid..." className="w-full p-2 bg-gray-50 rounded-lg text-sm font-bold outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {filteredStudents.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                {/* Butang Nama Murid */}
                <button onClick={() => setActiveStudentId(activeStudentId === s.id ? null : s.id)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${activeStudentId === s.id ? 'bg-green-700 text-white' : 'text-gray-800'}`}>
                  <div className="flex items-center gap-3">
                    <User size={16} className={activeStudentId === s.id ? 'text-green-200' : 'text-gray-400'}/>
                    <span className="font-black text-xs uppercase text-left">{s.name}</span>
                  </div>
                  {activeStudentId === s.id ? <ChevronUp size={18}/> : <ChevronDown size={18} className="text-gray-300"/>}
                </button>

                {/* BORANG TASMIK (Kembang bila klik nama) */}
                {activeStudentId === s.id && (
                  <div className="p-4 bg-white space-y-4 border-t-2 border-green-100 animate-in fade-in zoom-in-95">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Jenis</label>
                        <select className="w-full p-3 rounded-xl bg-gray-100 font-black text-xs text-green-700 outline-none" value={readingType} onChange={(e) => setReadingType(e.target.value)}>
                          <option value="Iqra">Iqra</option>
                          <option value="Al-Quran">Al-Quran</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">{readingType === 'Iqra' ? 'Tahap (1-6)' : 'Juzuk (1-30)'}</label>
                        <input type="text" placeholder="Cth: 2" className="w-full p-3 rounded-xl bg-gray-100 font-black text-xs outline-none" value={level} onChange={(e) => setLevel(e.target.value)} required />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Halaman</label>
                      <input type="number" placeholder="Cth: 45" className="w-full p-3 rounded-xl bg-gray-100 font-black text-xs outline-none" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} required />
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Catatan</label>
                      <input type="text" placeholder="Cth: Lancar" className="w-full p-3 rounded-xl bg-gray-100 font-bold text-xs outline-none" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>

                    <button onClick={(e) => handleSubmit(e, s)} disabled={loading}
                      className="w-full py-4 bg-green-600 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                      {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> SIMPAN REKOD</>}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasmikInput;