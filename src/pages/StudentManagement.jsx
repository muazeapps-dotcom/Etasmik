import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [tahun, setTahun] = useState('');
  const [className, setClassName] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [quickSupervisor, setQuickSupervisor] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('tahun', { ascending: true, nullsFirst: false })
      .order('class', { ascending: true })
      .order('name', { ascending: true });
    setStudents(data || []);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // POIN 2 & 4: Kemaskini Murid & Penyelia
      await supabase.from('students').update({ name, tahun, class: className, supervisor }).eq('id', editingId);
      setEditingId(null);
    } else {
      // POIN 2: Tambah Manual
      await supabase.from('students').insert([{ name, tahun, class: className, supervisor }]);
    }
    setName(''); setTahun(''); setClassName(''); setSupervisor('');
    fetchStudents();
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setName(s.name);
    setTahun(s.tahun || '');
    setClassName(s.class);
    setSupervisor(s.supervisor || '');
  };

  const handleQuickSupervisorUpdate = async (id) => {
    const supervisorValue = (quickSupervisor[id] ?? '').trim();
    const { error } = await supabase
      .from('students')
      .update({ supervisor: supervisorValue || null })
      .eq('id', id);

    if (error) {
      alert('Gagal kemaskini penyelia. Sila cuba lagi.');
      return;
    }

    alert('Penyelia berjaya dikemaskini.');
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Padam data murid ini?")) {
      await supabase.from('students').delete().eq('id', id);
      fetchStudents();
    }
  };

  return (
    <div className="p-8 bg-[#fdfdfb] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#064e3b] mb-6 underline decoration-[#d4af37]">PENGURUSAN MURID & PENYELIA</h2>
        
        {/* FORM TAMBAH/EDIT */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#064e3b] mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="border p-2 rounded" placeholder="Nama Murid" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="border p-2 rounded" placeholder="Tahun (cth: 4/5/6)" value={tahun} onChange={(e) => setTahun(e.target.value)} required />
          <input className="border p-2 rounded" placeholder="Kelas (cth: 4 ARIF)" value={className} onChange={(e) => setClassName(e.target.value)} required />
          <input className="border p-2 rounded" placeholder="Nama Penyelia" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
          <button type="submit" className="md:col-span-4 bg-[#064e3b] text-white p-2 rounded hover:bg-emerald-900 transition-all font-bold">
            {editingId ? 'KEMASKINI DATA' : 'TAMBAH MURID BARU'}
          </button>
        </form>

        {/* SENARAI MURID */}
        <p className="text-sm font-semibold text-emerald-800 mb-3">Jumlah Murid: {students.length}</p>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {students.map(s => (
            <div key={s.id} className="p-4 border-b hover:bg-gray-50">
              <div className="flex justify-between items-start gap-4">
                <div>
                <p className="font-bold text-gray-800">{s.name}</p>
                <p className="text-sm text-emerald-700">Tahun {s.tahun || '-'} | {s.class} | Penyelia: <span className="font-semibold">{s.supervisor || 'Tiada'}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 font-bold px-3 py-1 border border-blue-600 rounded hover:bg-blue-50">EDIT</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 font-bold px-3 py-1 border border-red-600 rounded hover:bg-red-50">BUANG</button>
                </div>
              </div>

              <div className="mt-3 flex flex-col md:flex-row gap-2 md:items-center">
                <input
                  className="border p-2 rounded md:w-72"
                  placeholder="Kemaskini penyelia terus..."
                  value={quickSupervisor[s.id] ?? s.supervisor ?? ''}
                  onChange={(e) => setQuickSupervisor((prev) => ({ ...prev, [s.id]: e.target.value }))}
                />
                <button
                  onClick={() => handleQuickSupervisorUpdate(s.id)}
                  className="text-emerald-700 font-bold px-3 py-2 border border-emerald-700 rounded hover:bg-emerald-50"
                >
                  SIMPAN PENYELIA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;