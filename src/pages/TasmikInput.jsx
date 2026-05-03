import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  User, 
  Save, 
  Loader2, 
  ChevronRight
} from 'lucide-react';

function TasmikInput() {
  const navigate = useNavigate();
  const classes = [
    '4 ARIF', '4 PINTAR', '4 BIJAK', '4 CERDIK',
    '5 ARIF', '5 PINTAR', '5 BIJAK', '5 CERDIK',
    '6 ARIF', '6 PINTAR', '6 BIJAK', '6 CERDIK'
  ];

  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // State untuk Borang (Gambar 1)
  const [readingType, setReadingType] = useState('Al-Quran');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class', selectedClass)
      .order('name', { ascending: true });

    if (error) {
      console.error('Ralat:', error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert("Sila pilih murid.");

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasmik_records')
        .insert([{
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
      alert("✅ REKOD BERJAYA DISIMPAN!");
      navigate('/reports'); // Automatik ke laporan
      
    } catch (error) {
      alert("❌ GAGAL: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-green-700 p-8 rounded-b-[3rem] shadow-lg text-white">
        <h1 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tight">
          <BookOpen /> Input Tasmik
        </h1>
        <p className="text-green-100 text-xs font-bold opacity-80 mt-1 uppercase">Rekod Bacaan Murid Real-Time</p>
      </div>

      <div className="max-w-md mx-auto p-5 -mt-6 space-y-6">
        
        {/* 1. PILIH KELAS */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
          <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">Langkah 1: Pilih Kelas</span>
          <div className="grid grid-cols-2 gap-3">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedClass(c);
                  setStudentId('');
                  setStudentName('');
                }}
                className={`py-3 px-2 rounded-2xl font-black text-xs border-2 transition-all ${
                  selectedClass === c 
                  ? 'bg-green-600 text-white border-green-600 shadow-md' 
                  : 'bg-white text-gray-400 border-gray-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className="space-y-6">
            
            {/* 2. PILIH MURID (Senarai Nama) */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
              <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">Langkah 2: Pilih Murid</span>
              
              <div className="relative mb-4">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Cari nama murid..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-none font-bold text-sm outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {loading ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-green-600" /></div>
                ) : (
                  filteredStudents.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setStudentId(s.id);
                        setStudentName(s.name);
                        // Skrol ke bawah sikit supaya nampak borang
                        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 200);
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${
                        studentId === s.id 
                        ? 'bg-green-100 border-2 border-green-500 shadow-sm' 
                        : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <span className={`text-[11px] font-black uppercase ${studentId === s.id ? 'text-green-800' : 'text-gray-600'}`}>{s.name}</span>
                      <ChevronRight size={16} className={studentId === s.id ? 'text-green-600' : 'text-gray-300'} />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* 3. BORANG REKOD (BAHAGIAN YANG CIKGU NAK DI GAMBAR 1) */}
            {studentId && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 space-y-5 animate-in fade-in slide-in-from-bottom-4">
                 <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                   <div className="bg-green-600 p-2 rounded-xl text-white shadow-sm"><User size={20}/></div>
                   <div>
                     <p className="text-[10px] font-black text-green-600 uppercase">Sedang Mengunci Rekod:</p>
                     <p className="font-black text-green-900 uppercase text-xs leading-tight">{studentName}</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Jenis Bacaan</span>
                      <select 
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-green-700 outline-none"
                        value={readingType}
                        onChange={(e) => setReadingType(e.target.value)}
                      >
                        <option value="Al-Quran">Al-Quran</option>
                        <option value="Iqra">Iqra</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">
                        {readingType === 'Iqra' ? 'Tahap' : 'Juz (1-30)'}
                      </span>
                      <input 
                        type="text"
                        placeholder="Cth: 2"
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black outline-none"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        required
                      />
                    </div>
                 </div>

                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Nombor Halaman</span>
                    <input 
                      type="number"
                      placeholder="Contoh: 45"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black outline-none"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(e.target.value)}
                      required
                    />
                 </div>

                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Catatan</span>
                    <input 
                      type="text"
                      placeholder="Contoh: Lancar."
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-600 outline-none"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                 </div>

                 <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95"
                 >
                   {loading ? (
                     <Loader2 className="animate-spin" />
                   ) : (
                     <><Save size={24} /> SIMPAN REKOD</>
                   )}
                 </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasmikInput;