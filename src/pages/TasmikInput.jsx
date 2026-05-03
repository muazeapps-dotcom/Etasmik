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
      const { data, error } = await supabase
        .from('students')
        .select('*');

      if (error) throw error;

      if (data) {
        setAllStudents(data);
        // Ambil kelas unik
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
    if (!studentId) return alert('Pilih murid!');
    setLoading(true);
    try {
      const { error } = await supabase.from('tasmik_records').insert([{
        student_id: studentId,
        student_name: studentName,
        class: selectedClass,
        reading_type: readingType,
        level: level,
        page_number: parseInt(pageNumber),
        remarks: remarks,
        date: new Date().toISOString()
      }]);
      if (error) throw error;
      alert('BERJAYA SIMPAN!');
      setStudentId(''); setStudentName(''); setLevel(''); setPageNumber(''); setRemarks('');
    } catch (err) {
      alert('Gagal: ' + err.message);
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
      </div>

      <div className="max-w-md mx-auto p-5 -mt-6 space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
          <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center">Langkah 1: Pilih Kelas</span>
          <div className="grid grid-cols-2 gap-3">
            {classes.length > 0 ? classes.map((c) => (
              <button key={c} onClick={() => { setSelectedClass(c); setStudentId(''); }}
                className={`py-3 px-2 rounded-2xl font-black text-xs transition-all border-2 ${selectedClass === c ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border-gray-100'}`}>
                {c}
              </button>
            )) : <p className="col-span-2 text-center text-xs font-bold text-gray-400">Tiada Data Kelas</p>}
          </div>
        </div>

        {selectedClass && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
             <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center">Langkah 2: Pilih Murid</span>
             <input type="text" placeholder="Cari nama..." className="w-full p-3 rounded-xl bg-gray-50 mb-4 text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
             <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredStudents.map(s => (
                  <button key={s.id} onClick={() => { setStudentId(s.id); setStudentName(s.name); }}
                    className={`w-full p-4 rounded-2xl text-left ${studentId === s.id ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-transparent'} border-2`}>
                    <span className="text-[11px] font-black uppercase">{s.name}</span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {studentId && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl space-y-4">
            <p className="font-black text-green-700 text-center uppercase text-sm">{studentName}</p>
            <div className="grid grid-cols-2 gap-4">
              <select className="p-4 rounded-xl bg-gray-50 font-bold" value={readingType} onChange={(e) => setReadingType(e.target.value)}>
                <option value="Iqra">Iqra</option>
                <option value="Al-Quran">Al-Quran</option>
              </select>
              <input type="text" placeholder="Tahap/Juz" className="p-4 rounded-xl bg-gray-50 font-bold" value={level} onChange={(e) => setLevel(e.target.value)} required />
            </div>
            <input type="number" placeholder="Halaman" className="w-full p-4 rounded-xl bg-gray-50 font-bold" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} required />
            <input type="text" placeholder="Catatan" className="w-full p-4 rounded-xl bg-gray-50 font-bold" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black">
              {loading ? 'MENYIMPAN...' : 'SIMPAN REKOD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TasmikInput;