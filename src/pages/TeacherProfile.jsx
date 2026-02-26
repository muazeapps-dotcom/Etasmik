import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function TeacherProfile() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // State Borang
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error("Ralat ambil data guru:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // Fungsi Pilih Gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Fungsi Muat Naik ke Storage Bucket 'avatar'
  async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('avatar') // Pastikan nama ini 'avatar' sama dengan di Supabase cikgu
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatar').getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);
    try {
      let photo_url = editingId ? teachers.find(t => t.id === editingId).photo_url : '';
      
      if (imageFile) {
        photo_url = await uploadImage(imageFile);
      }

      const teacherData = { 
        name: name.toUpperCase(), 
        position: position.toUpperCase(), 
        phone, 
        photo_url 
      };

      if (editingId) {
        const { error } = await supabase.from('teachers').update(teacherData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('teachers').insert([teacherData]);
        if (error) throw error;
      }

      resetForm();
      fetchTeachers();
      alert("✅ Profil berjaya dikemaskini!");
    } catch (error) {
      alert("Ralat: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setName(''); setPosition(''); setPhone('');
    setImageFile(null); setPreviewUrl(null); setEditingId(null);
  }

  function startEdit(teacher) {
    setEditingId(teacher.id);
    setName(teacher.name);
    setPosition(teacher.position);
    setPhone(teacher.phone);
    setPreviewUrl(teacher.photo_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteTeacher(id) {
    if (window.confirm("🗑️ Padam maklumat Ustaz/Ustazah ini?")) {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (!error) fetchTeachers();
    }
  }

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-green-700 text-3xl font-bold">account_box</span>
        <h1 className="text-2xl font-black text-green-900 uppercase">Profil Guru GPI</h1>
      </div>

      {/* BORANG DAFTAR/EDIT */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl border-t-8 border-green-700 mb-10">
        <div className="flex flex-col items-center mb-6">
          <label className="relative cursor-pointer group">
            <div className="w-28 h-28 bg-green-50 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-green-200">add_a_photo</span>
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-green-700 text-white p-2 rounded-full shadow-md border-2 border-white">
              <span className="material-symbols-outlined text-sm">edit</span>
            </div>
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>

        <div className="space-y-4">
          <input 
            type="text" placeholder="NAMA PENUH" 
            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold uppercase text-sm focus:ring-2 focus:ring-green-500 outline-none" 
            value={name} onChange={(e) => setName(e.target.value)} required 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="JAWATAN" 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none uppercase" 
              value={position} onChange={(e) => setPosition(e.target.value)} 
            />
            <input 
              type="tel" placeholder="NO. TELEFON" 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none" 
              value={phone} onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
          <div className="flex gap-3 pt-2">
            {editingId && (
              <button type="button" onClick={resetForm} className="flex-1 p-4 bg-gray-100 rounded-2xl font-black text-gray-500">BATAL</button>
            )}
            <button 
              type="submit" disabled={uploading} 
              className="flex-[2] p-4 bg-green-700 text-white rounded-2xl font-black shadow-lg hover:bg-green-800 transition-all"
            >
              {uploading ? 'PROSES...' : editingId ? 'SIMPAN PERUBAHAN' : 'DAFTAR AHLI'}
            </button>
          </div>
        </div>
      </form>

      {/* SENARAI GURU */}
      <div className="grid grid-cols-1 gap-4">
        {teachers.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
            <img src={t.photo_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover border-2 border-green-50" />
            <div className="flex-1">
              <p className="font-black text-gray-800 text-sm uppercase leading-tight">{t.name}</p>
              <p className="text-[10px] font-bold text-green-600 uppercase mt-1">{t.position || 'GURU GPI'}</p>
              <a href={`https://wa.me/6${t.phone}`} target="_blank" className="text-[10px] font-black text-gray-400 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-xs">call</span> {t.phone}
              </a>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(t)} className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button onClick={() => deleteTeacher(t.id)} className="p-2 text-red-400 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherProfile;