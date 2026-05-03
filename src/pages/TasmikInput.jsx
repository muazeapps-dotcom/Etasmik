import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, Save, Loader2, ChevronRight, CheckCircle } from 'lucide-react';

function TasmikInput() {
  const navigate = useNavigate();

  const classes = ['4 ARIF', '4 PINTAR', '4 BIJAK', '4 CERDIK', '5 ARIF', '5 PINTAR', '5 BIJAK', '5 CERDIK', '6 ARIF', '6 PINTAR', '6 BIJAK', '6 CERDIK'];

  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // State Input Tasmik
  const [readingType, setReadingType] = useState('Al-Quran');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('LANCAR');

  // Generate range untuk Dropdown
  const iqraLevels = ['1', '2', '3', '4', '5', '6'];
  const juzukLevels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const pages = Array.from({ length: 604 }, (_, i) => (i + 1).toString());
  const achievement = ['LANCAR', 'SANGAT LANCAR', 'KURANG LANCAR', 'PERLU BIMBINGAN', 'MENGULANG'];

  useEffect(() => {
    if (selectedClass) { fetchStudents(); }
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').eq('class', selectedClass).order('name', { ascending: true });
    if (!error) setStudents(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !level || !pageNumber) return alert("Sila lengkapkan semua pilihan!");

    setLoading(true);
    try {
      const { error } = await supabase.from('tasmik_records').insert([{
        student_id: studentId, student_name: studentName, class: selectedClass,
        reading_type: readingType, level: level, page_number: parseInt(pageNumber),
        remarks: remarks, date: new Date().toISOString()
      }]);
      if (error) throw error;
      alert("✅ REKOD BERJAYA DISIMPAN!");
      navigate('/reports'); 
    } catch (error) {
      alert("❌ GAGAL: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="bg-green-700 p-8 rounded-b-[3rem] shadow-lg text-white">
        <h1 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tight"><BookOpen /> Input Tasmik</h1>
      </div>

      <div className="max-w-md mx-auto p-5 -mt-6 space-y-6">
        {/* PILIH KELAS */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
          <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">1. Pilih Kelas</span>
          <div className="grid grid-cols-2 gap-2">
            {classes.map((c) => (
              <button key={c} onClick={() => {setSelectedClass(c); setStudentId('');}}
                className={`py-3 rounded-2xl font-black text-[10px] border-2 transition-all ${selectedClass === c ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-400 border-gray-50'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
            <span className="text-[10px] font-black text-green-600 uppercase mb-4 block text-center tracking-widest">2. Pilih Murid</span>
            <input type="text" placeholder="Cari nama murid..." className="w-full p-4 rounded-2xl bg-gray-50 mb-4 font-bold text-sm outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                <button key={s.id} onClick={() => {setStudentId(s.id); setStudentName(s.name);}}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${studentId === s.id ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent'}`}>
                  <span className={`text-[11px] font-black uppercase ${studentId === s.id ? 'text-green-800' : 'text-gray-600'}`}>{s.name}</span>
                  {studentId === s.id && <CheckCircle size={16} className="text-green-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BORANG PILIHAN (Dropdown) */}
        {studentId && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-t-8 border-green-600 space-y-5 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
               <p className="text-[10px] font-black text-green-600 uppercase">Nama Murid:</p>
               <p className="font-black text-green-900 uppercase text-xs">{studentName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Jenis</label>
                <select className="w-full p-4 rounded-2xl bg-gray-100 font-black text-green-700 text-sm outline-none border-none" value={readingType} onChange={(e) => {setReadingType(e.target.value); setLevel('');}}>
                  <option value="Al-Quran">Al-Quran</option>
                  <option value="Iqra">Iqra</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">{readingType === 'Iqra' ? 'Tahap Iqra' : 'Juzuk'}</label>
                <select className="w-full p-4 rounded-2xl bg-gray-100 font-black text-sm outline-none border-none" value={level} onChange={(e) => setLevel(e.target.value)} required>
                  <option value="">Pilih</option>
                  {(readingType === 'Iqra' ? iqraLevels : juzukLevels).map(l => <option key={l} value={l}>{readingType} {l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Halaman</label>
              <select className="w-full p-4 rounded-2xl bg-gray-100 font-black text-sm outline-none border-none" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} required>
                <option value="">Pilih Halaman</option>
                {pages.map(p => <option key={p} value={p}>Halaman {p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block underline">Tahap Pencapaian</label>
              <select className="w-full p-4 rounded-2xl bg-gray-100 font-black text-green-600 text-sm outline-none border-none" value={remarks} onChange={(e) => setRemarks(e.target.value)}>
                {achievement.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-green-700 flex items-center justify-center gap-3 transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={24} /> SIMPAN & LIHAT LAPORAN</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TasmikInput;