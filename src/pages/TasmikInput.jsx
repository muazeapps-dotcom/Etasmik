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
  // Fungsi untuk pastikan perbandingan kelas sentiasa Huruf Besar & Tiada Ruang Kosong
  const normalizeClass = (value) => String(value || '').trim().toUpperCase();

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

  // Tapis data murid berdasarkan kelas dipilih (Guna Normalization)
  useEffect(() => {
    if (selectedClass) {
      const selectedClassKey = normalizeClass(selectedClass);
      const classStudents = allStudents.filter(
        (student) => normalizeClass(student.class) === selectedClassKey
      );
      setStudents(classStudents);
    } else {
      setStudents([]);
    }
  }, [selectedClass, allStudents]);

  const fetchAllStudents = async () => {
    setLoading(true);
    // Kita panggil semua murid mengikut susunan
    const { data, error } = await supabase
      .from('students')
      .select('id, name, class, tahun, supervisor')
      .order('tahun', { ascending: true })
      .order('class', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Ralat ambil data students:', error);
      setLoading(false);
      return;
    }

    setAllStudents(data || []);

    // Bina senarai kelas unik untuk butang Langkah 1
    const uniqueClassMap = new Map();
    (data || []).forEach((item) => {
      const className = String(item.class || '').trim();
      const classKey = normalizeClass(className);
      if (!className) return;
      if (!uniqueClassMap.has(classKey)) {
        uniqueClassMap.set(classKey, className);
      }
    });

    const classList = Array.from(uniqueClassMap.values()).sort();
    setClasses(classList);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !studentId || !studentName) {
      alert('Sila pilih kelas dan murid terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        student_id: studentId,
        student_name: studentName,
        class: normalizeClass(selectedClass), // Simpan dalam format Huruf Besar
        reading_type: readingType,
        level: String(level).trim(),
        page_number: parseInt(pageNumber, 10),
        remarks: remarks ? String(remarks).trim() : null,
        date: new Date().toISOString()
      };

      // Pastikan table name: tasmik_records
      const { error } = await supabase
        .from('tasmik_records')
        .insert([payload]);

      if (error) throw error;

      alert('✅ REKOD BERJAYA DISIMPAN!');
      setStudentId('');
      setStudentName('');
      setLevel('');
      setPageNumber('');
      setRemarks('');
      
    } catch (error) {
      console.error('Gagal simpan:', error);
      alert(`❌ GAGAL SIMPAN: ${error.message || 'Ralat Database'}`);
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
        <h1 className="text-2xl font-black flex items-center gap-2 uppercase">
          <BookOpen /> Input Tasmik
        </h1>
        <p className="text-green-100 text-[10px] font-bold opacity-80 mt-1 uppercase">Rekod Bacaan Murid Real-Time</p>
      </div>

      <div className="max-w-md mx-auto p-5 -mt-6 space-y-6">
        
        {/* 1. PILIH KELAS */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
          <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">Langkah 1: Pilih Kelas</span>
          <div className="grid grid-cols-2 gap-3">
            {classes.length > 0 ? classes.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedClass(c);
                  setStudentId('');
                  setStudentName('');
                }}
                className={`py-3 px-2 rounded-2xl font-black text-xs transition-all border-2 ${
                  selectedClass === c 
                  ? 'bg-green-600 text-white border-green-600 shadow-md' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-green-200'
                }`}
              >
                {c}
              </button>
            )) : (
              <p className="col-span-2 text-center text-[10px] text-gray-400 font-bold py-2">Memuatkan kelas...</p>
            )}
          </div>
        </div>

        {selectedClass && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* 2. PILIH MURID */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
              <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">Langkah 2: Pilih Murid</span>
              
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
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setStudentId(s.id);
                        setStudentName(s.name);
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${
                        studentId === s.id 
                        ? 'bg-green-50 border-2 border-green-500 shadow-sm' 
                        : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${studentId === s.id ? 'bg-green-600 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                          <User size={16}/>
                        </div>
                        <div>
                          <span className={`text-[11px] font-black uppercase ${studentId === s.id ? 'text-green-800' : 'text-gray-600'}`}>{s.name}</span>
                          <p className="text-[9px] text-gray-500 font-bold mt-0.5 uppercase">Tahun {s.tahun} | {s.class}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={studentId === s.id ? 'text-green-600' : 'text-gray-300'} />
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-[10px] font-bold py-4 uppercase">Nama murid tidak dijumpai</p>
                )}
              </div>
            </div>

            {/* 3. BORANG REKOD */}
            {studentName && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-5">
                 <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                   <div className="bg-green-600 p-2 rounded-xl text-white shadow-sm"><User size={20}/></div>
                   <div className="overflow-hidden">
                     <p className="text-[10px] font-black text-green-600 uppercase">Mengemaskini Rekod:</p>
                     <p className="font-black text-green-900 uppercase text-[11px] truncate">{studentName}</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Jenis</span>
                      <select 
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-green-700 text-sm"
                        value={readingType}
                        onChange={(e) => setReadingType(e.target.value)}
                      >
                        <option value="Iqra">Iqra</option>
                        <option value="Al-Quran">Al-Quran</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">
                        {readingType === 'Iqra' ? 'Tahap' : 'Juzuk'}
                      </span>
                      <input 
                        type="text"
                        placeholder="Cth: 2"
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-sm"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        required
                      />
                    </div>
                 </div>

                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Halaman</span>
                    <input 
                      type="number"
                      placeholder="Cth: 45"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-sm"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(e.target.value)}
                      required
                    />
                 </div>

                 <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Catatan</span>
                    <input 
                      type="text"
                      placeholder="Contoh: Lancar"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-sm"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                 </div>

                 <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> SIMPAN REKOD</>}
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