import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function TasmikInput() { // Nama fungsi diselaraskan dengan nama fail
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [readingType, setReadingType] = useState('Al-Quran');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(false);

  const listIqra = ["Iqra 1", "Iqra 2", "Iqra 3", "Iqra 4", "Iqra 5", "Iqra 6"];
  const listJuzuk = Array.from({ length: 30 }, (_, i) => `Juzuk ${i + 1}`);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, class')
        .order('name', { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Ralat ambil murid:", error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Sila pilih murid!");
    
    setLoading(true);
    // Format tarikh YYYY-MM-DD
    const tarikhHariIni = new Date().toLocaleDateString('en-CA'); 

    try {
      // 1. UPDATE maklumat murid
      const { error: updateError } = await supabase
        .from('students')
        .update({ 
          last_tasmik: tarikhHariIni,
          last_level: level,           
          last_page: page,             
          last_reading_type: readingType 
        })
        .eq('id', selectedStudent);

      if (updateError) throw updateError;

      // 2. SIMPAN SEJARAH
      const { error: historyError } = await supabase
        .from('tasmik_records')
        .insert([{
          student_id: selectedStudent,
          reading_type: readingType,
          level: level,
          page_number: page,
          date: tarikhHariIni
        }]);

      if (historyError) throw historyError;

      alert("Rekod Berjaya Disimpan!");
      // Reset form
      setPage('');
      setLevel('');
      setSelectedStudent(''); 
    } catch (error) {
      alert("Ralat Simpan: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto mb-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-green-800 italic uppercase">Borang Tasmik</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Murid</label>
            <select 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold mt-1"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">-- PILIH MURID --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
              ))}
            </select>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-2xl">
            {['Iqra', 'Al-Quran', 'Khatam'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setReadingType(type);
                  setLevel(''); 
                }}
                className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${
                  readingType === type ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {readingType !== 'Khatam' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {readingType === 'Iqra' ? 'Tahap' : 'Juzuk'}
                </label>
                <select 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="">-- PILIH --</option>
                  {readingType === 'Iqra' 
                    ? listIqra.map(i => <option key={i} value={i}>{i}</option>)
                    : listJuzuk.map(j => <option key={j} value={j}>{j}</option>)
                  }
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Halaman</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 text-white p-5 rounded-2xl font-black shadow-xl mt-4 disabled:bg-gray-300 hover:bg-green-800 transition-colors"
          >
            {loading ? 'SEDANG SIMPAN...' : 'SIMPAN REKOD'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TasmikInput;