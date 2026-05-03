import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  BookOpen, 
  Search, 
  User, 
  Save, 
  Loader2, 
  ChevronRight
} from 'lucide-react';

function TasmikInput() {
  const [classes, setClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State penting untuk borang
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  const [readingType, setReadingType] = useState('Al-Quran');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const filtered = allStudents.filter(s => 
        String(s.class || '').trim().toUpperCase() === selectedClass.toUpperCase()
      );
      setStudents(filtered);
    } else {
      setStudents([]);
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
          .filter(Boolean)
          .sort();
        setClasses(uniqueClasses);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert('Sila pilih murid!');
    
    setLoading(true);
    try {
      const { error } = await supabase.from('tasmik_records').insert([{
        student_id: studentId,
        student_name: studentName,
        class: selectedClass,
        reading_type: readingType,
        level: String(level),
        page_number: parseInt(pageNumber),
        remarks: remarks,
        date: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      alert('✅ BERJAYA SIMPAN!');
      // Reset borang lepas simpan
      setStudentId('');
      setStudentName('');
      setLevel('');
      setPageNumber('');
      setRemarks('');
      
    } catch (err) {
      alert('Gagal simpan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-green-700 p-8 rounded-b-[3rem] shadow-lg text-white">
        <h1 className="text-2xl font-black flex items-center gap-2 uppercase"><BookOpen /> Input Tasmik</h1>
        <p className="text-green-100 text-[10px] font-bold mt-1 uppercase">Rekod Bacaan Murid</p>
      </div>

      <div className="max-w-md mx-auto p-5 -mt-6 space-y-6">
        {/* LANGKAH 1 */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
          <span className="text-[10px] font-black text-green-600 uppercase mb-4 block tracking-widest">Langkah 1: Pilih Kelas</span>
          <div className="grid grid-cols-2 gap-3">
            {classes.map((c) => (
              <button key={c} onClick={() => { setSelectedClass(c); setStudentId(''); }}
                className={`py-3 px-2 rounded-2xl font-black text-xs transition-all border-2 ${selectedClass === c ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-100'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* LANGKAH 2 */}
        {selectedClass && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
             <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">Langkah 2: Pilih Murid</span>
             <div className="relative mb-4">
                <Search className="absolute left-4 top-3 text-gray-400" size={16} />
                <input type="text" placeholder="Cari nama..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 text-sm font-bold outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
             <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {filteredStudents.map(s => (
                  <button key={s.id} 
                    onClick={() => { 
                      setStudentId(s.id); 
                      setStudentName(s.name);
                      // Scroll ke bawah sikit supaya nampak borang
                      setTimeout(() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}), 100);
                    }}
                    className={`w-full p-4 rounded-2xl text-left flex items-center justify-between transition-all ${studentId === s.id ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-50 text-gray-700'}`}>
                    <span className="text-[11px] font-black uppercase">{s.name}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* LANGKAH 3: BORANG (Hanya keluar bila studentId ada) */}
        {studentId && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-2 border-green-500 space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg text-white"><User size={18}/></div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-green-600 uppercase">Merekod Tasmik:</p>
                <p className="font-black text-green-900 uppercase text-xs truncate">{studentName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Jenis</label>
                <select className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-sm text-green-700" value={readingType} onChange={(e) => setReadingType(e.target.value)}>
                  <option value="Iqra">Iqra</option>
                  <option value="Al-Quran">Al-Quran</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">{readingType === 'Iqra' ? 'Tahap' : 'Juzuk'}</label>
                <input type="text" placeholder="Cth: 2" className="w-full p-4 rounded-2xl bg-gray-50 font-black text-sm outline-none" value={level} onChange={(e) => setLevel(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Halaman</label>
              <input type="number" placeholder="Contoh: 45" className="w-full p-4 rounded-2xl bg-gray-50 font-black text-sm outline-none" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} required />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Catatan</label>
              <input type="text" placeholder="Contoh: Lancar" className="w-full p-4 rounded-2xl bg-gray-50 font-bold text-sm outline-none" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> SIMPAN REKOD</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TasmikInput;