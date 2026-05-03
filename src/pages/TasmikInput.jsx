import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  User, 
  Save, 
  Loader2, 
  ChevronRight,
  CheckCircle
} from 'lucide-react';

function TasmikInput() {
  const navigate = useNavigate();

  // Senarai Kelas
  const classes = [
    '4 ARIF', '4 PINTAR', '4 BIJAK', '4 CERDIK',
    '5 ARIF', '5 PINTAR', '5 BIJAK', '5 CERDIK',
    '6 ARIF', '6 PINTAR', '6 BIJAK', '6 CERDIK'
  ];

  // State
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State Murid Terpilih
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // State Pilihan Borang (Dropdown)
  const [readingType, setReadingType] = useState('Al-Quran');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('LANCAR');

  // Data untuk Dropdown
  const iqraLevels = ['1', '2', '3', '4', '5', '6'];
  const juzukLevels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const pages = Array.from({ length: 604 }, (_, i) => (i + 1).toString());
  const achievements = ['LANCAR', 'SANGAT LANCAR', 'KURANG LANCAR', 'PERLU BIMBINGAN', 'MENGULANG'];

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
      console.error('Error fetch:', error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !level || !pageNumber) {
      alert("Sila pilih murid dan lengkapkan maklumat tasmik!");
      return;
    }

    setLoading(true);
    try {
      // PENTING: Pastikan nama kolum ini (reading_type, level, dll) 
      // SAMA dengan nama kolum dalam table tasmik_records di Supabase cikgu.
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
      
      // Navigate ke /reports (ikut App.jsx cikgu)
      navigate('/reports');
      
    } catch (error) {
      console.error('Error saving:', error);
      alert("❌ GAGAL SIMPAN: " + error.message);
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
        <p className="text-green-100 text-[10px] font-bold opacity-80 mt-1 uppercase">Rekod Perkembangan Murid</p>
      </div>

      <div className="max-w-md mx-auto p-5 -mt-6 space-y-6">
        
        {/* LANGKAH 1: PILIH KELAS */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
          <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest underline decoration-2 underline-offset-4">Langkah 1: Pilih Kelas</span>
          <div className="grid grid-cols-2 gap-2">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedClass(c);
                  setStudentId(''); // Reset bila tukar kelas
                }}
                className={`py-3 rounded-2xl font-black text-[10px] border-2 transition-all ${
                  selectedClass === c 
                  ? 'bg-green-600 text-white border-green-600 shadow-md' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-green-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* LANGKAH 2: PILIH MURID */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
              <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest underline decoration-2 underline-offset-4">Langkah 2: Pilih Murid</span>
              
              <div className="relative mb-4">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Cari nama murid..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-green-500"
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
                        // Skrol ke bawah sikit untuk nampak borang
                        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 300);
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${
                        studentId === s.id 
                        ? 'bg-green-100 border-2 border-green-500 shadow-sm' 
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${studentId === s.id ? 'bg-green-600 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                          <User size={16}/>
                        </div>
                        <span className={`text-[11px] font-black uppercase ${studentId === s.id ? 'text-green-800' : 'text-gray-600'}`}>{s.name}</span>
                      </div>
                      {studentId === s.id && <CheckCircle size={16} className="text-green-600" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* LANGKAH 3: BORANG REKOD (DI BAWAH) */}
            {studentId && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-t-8 border-green-600 space-y-5 animate-in fade-in slide-in-from-bottom-8">
                 <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                   <div className="bg-green-600 p-2 rounded-xl text-white shadow-sm"><User size={20}/></div>
                   <div>
                     <p className="text-[10px] font-black text-green-600 uppercase leading-none mb-1">Merekod Tasmik:</p>
                     <p className="font-black text-green-900 uppercase text-xs leading-tight">{studentName}</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Jenis Bacaan</span>
                      <select 
                        className="w-full p-4 rounded-2xl bg-gray-100 border-none font-black text-green-700 text-sm outline-none"
                        value={readingType}
                        onChange={(e) => {
                          setReadingType(e.target.value);
                          setLevel(''); // Reset tahap bila tukar jenis
                        }}
                      >
                        <option value="Al-Quran">Al-Quran</option>
                        <option value="Iqra">Iqra</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">
                        {readingType === 'Iqra' ? 'Tahap Iqra' : 'Juzuk'}
                      </span>
                      <select 
                        className="w-full p-4 rounded-2xl bg-gray-100 border-none font-black text-sm outline-none"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        required
                      >
                        <option value="">Pilih</option>
                        {(readingType === 'Iqra' ? iqraLevels : juzukLevels).map(l => (
                          <option key={l} value={l}>{readingType} {l}</option>
                        ))}
                      </select>
                    </div>
                 </div>

                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Halaman</span>
                    <select 
                      className="w-full p-4 rounded-2xl bg-gray-100 border-none font-black text-sm outline-none"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(e.target.value)}
                      required
                    >
                      <option value="">Pilih Halaman</option>
                      {pages.map(p => (
                        <option key={p} value={p}>Halaman {p}</option>
                      ))}
                    </select>
                 </div>

                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-tighter underline">Tahap Pencapaian</span>
                    <select 
                      className="w-full p-4 rounded-2xl bg-gray-100 border-none font-black text-green-600 text-sm outline-none"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    >
                      {achievements.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                 </div>

                 <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {loading ? (
                     <Loader2 className="animate-spin" size={24} />
                   ) : (
                     <><Save size={24} /> SIMPAN & KE LAPORAN</>
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