import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Save, Users, BookOpen, CheckCircle, Search } from 'lucide-react';

// Data Nama Murid mengikut Kelas (Dipetik dari fail CSV cikgu)
const STUDENT_DATA = {
  '4 ARIF': ["AAIRA SAFFIAH BINTI NASRI CORPUZ", "ADAM DANIAFDNAN BIN RAZAIMAN", "ADRYAN SHAH BIN JAINUDDIN", "AHMAD SYAZWAN NAZMI BIN AZMIL", "AHMAD ZULHILMI BIN ZAMSARI", "ALIFF NAUFAL BIN MOHD PADLE", "ASHAFIERA DANIA BINTI SHERONSHAFIE", "AULIA IZZATUNNISA BINTI DARMANSHAH", "ELZAVIERAH SOFIAH BINTI MOHD NORZAIM", "ILHAM BIN RAHMAT", "ISABEL SYIFA BINTI ZAIONELL", "KHALISA AQILA BINTI JAINAL ABIDIN", "MOHAMAD AIMAN BIN MOHAMAD ANUAR", "MOHAMAD HADIF DAYYAN BIN MUSCIN", "MOHAMAD JOHAIREL BIN JOHAN", "MOHAMAD MAULUDDIN BIN ABDULLAH", "MOHAMMAD A AFAIZRAN ILDRIN BIN ABDULLAH", "MOHAMMAD DENIAL BIN SAMSON", "MOHAMMAD SAHFIEZAN BIN ABDULLAH", "MOHAMMAD ZULFITRI BIN MOHD ZULKIFLI", "MUHAMMAD ADAM DAYYAN BIN CHARIS", "MUHAMMAD AQEL EZZEDDEN BIN NAJIB", "MUHAMMAD ARIFFIN BIN HUSIN", "MUHAMMAD AUF ZAFRAN BIN ABDUL GAPUR", "MUHAMMAD FATTAH IRFAN BIN RUSTAM", "MUHAMMAD ISRAM BIN ABDUL RAFI", "MUHAMMAD NAZMI BIN NAZIB"],
  '4 BIJAK': ["ABDUL RAZIF BIN ABDULLAH", "AHMAD AMMAR ARIF BIN JUMARDI", "AINUL MARDHIA BINTI MOHD AIDEL", "ALESYAH BINTI MOHD ARBI", "AMMAR AZHARI BIN MOHAMMAD ARAFAT", "AZIATUL ATILIA BINTI AZIZUL", "FAZRYEYANA HUMAIRA BINTI AL SHAMJA", "JANNATUL QHALEESYA BINTI NAZIB", "MAIZATUL NAFISAH BINTI ABDUL WAHID", "MOHAMAD ARYANSYAH BIN AHMAD ROZAINI", "MOHAMAD HAZIQ HAFIZAN BIN ABDUL RAUP", "MOHAMAD SHARHAN SYAHFIQ BIN ABDULLAH", "MOHAMMAD ADZRIEL HAKIMI BIN MOHD RIZWAN", "MUHAMAD HADIF BIN MUHAMAD ADNAN", "MUHAMMAD ALNAFI BIN ALNATI", "MUHAMMAD ARASH DENIAL BIN MUHAMMAD NORAZIJUL", "MUHAMMAD ARSHAD BIN JAMAIN", "MUHAMMAD BIN ABDULLAH", "MUHAMMAD FAQRUL ZAQWAN BIN ABDULLAH", "MUHAMMAD HAFIZUL ASHRAF BIN ZAINUDDIN", "MUHAMMAD HARAZ NAUFAL", "MUHAMMAD HUZAIFAH BIN ISMAIL", "MUHAMMAD KHALEED ISHAK BIN MUHAMMAD ABUZA", "MUHAMMAD RAYYAN MIKAIL BIN JAY MCLESLIE", "MUHAMMAD SYAFIQ AQIL BIN RAMAKARMA", "NAYAZ ZAFRAN BIN"],
  '5 ARIF': ["ADAWIYAH ZAHRA VARISHA BINTI MOHAMAD JAPAR", "ADEELYA EL ZAHRA BINTI MOHAMMAD FAZIR", "ALEESYA EL ZAHRA BINTI MOHAMMAD FAZIR", "AMMAR HAZIQ BIN WAHYU DWICANDRA", "ASYIFF BIN BAHARUDIN", "DAMIA FARISHA BINTI ABDULLAH", "EMAN NOUR SOFEYYA BINTI KHAIRUDDIN", "IRENE SYIFA BINTI ZAIONELL", "LILY TASNEEM BINTI MOHD RHAFIE", "MOHAMAD AMIN FATTAH BIN MOHAMAD AMZANIE", "MOHAMMAD ADAMI BIN JULASRI", "MOHAMMAD ARDHANI AL HAKIM BIN ROSZALIE", "MOHAMMAD FAZRIL HAIDI BIN MD.NOOR", "MOHAMMAD HAZRIQSYAH FITRIE BIN JAMRI", "MOHAMMAD MUAZ BIN AJIS MERAH", "MOHAMMAD SHAZUDDIN BIN SAIFUDDIN", "MUHAMMAD ABDULLAH BIN LARRY VALDUEZA", "MUHAMMAD AISY RAYYAN BIN MUHAMAD MAHATIR", "MUHAMMAD AQIL ZIQRI BIN SUHAIDIR", "MUHAMMAD ASRAF BIN ABDULLAH", "MUHAMMAD ASYRAF ZAQWAN BIN ASRIANSHAH", "MUHAMMAD AZRAIE BIN YANG LOI", "MUHAMMAD FAHRIN FARHIMIE BIN ASMADI", "MUHAMMAD FIRDAUS BIN MOH"],
  '6 ARIF': ["ABDU RAPHE BIN JERRY", "AFIQAH NUR ADWA BINTI RAHMAT ISKANDAR", "AISYAH AIRIS BINTI MOHD RIZAL", "AKRAMEL BIN TANASAIN", "ANNUR FITRIYANA BINTI MUJI", "ARISYA BINTI ROSLI", "ARMEL ASIHAH BINTI ABDULLAH", "DANG ZARA DHIYA AZZALEA BINTI MOHD FITRY", "FATIAH MUTIARA BINTI FAIN", "HURUL HAYANI BINTI ALI HASSAN", "LUQMANUL HAKIM ACHONDO BIN ABDULLAH", "MOHAMAD AFIK ISYAK BIN ABD.RAJAK", "MOHAMAD ZUL FIRDAUS BIN JAINAL", "MOHAMMAD AMMAR NAIM BIN ABDULLAH", "MOHAMMAD FAHIN HAFIZI BIN RAZLAN", "MOHAMMAD HAZRIESHAH BIN MOHAMMAD JASRI", "MUHAMMAD 'AMMAR HAFIY BIN AB HAMID", "MUHAMMAD ADLI AZIZI BIN ALI", "MUHAMMAD AHNAF ZIQHRI BIN ZAMDIN", "MUHAMMAD ATIF SAFWAN BIN ABDULLAH", "MUHAMMAD FAKHRUDDIN FURQAN BIN MAZLANI", "MUHAMMAD HAFIZ REZKI BIN ARIS", "MUHAMMAD IQRAM BIN E.D ELHAM", "MUHAMMAD LUTH AL BAIHAQI BIN KHAIRUDDIN", "MUHAMMAD MAH'SAH FATHUL ISLAM BIN SAHIRIN", "MUHAMMAD SUZAILI BIN ROSLAN"]
  // (Nota: Tambahkan kelas lain mengikut corak yang sama jika perlu)
};

const CLASSES = Object.keys(STUDENT_DATA);

function TasmikInput() {
  const [selectedClass, setSelectedClass] = useState('');
  const [studentName, setStudentName] = useState('');
  const [readingType, setReadingType] = useState('Iqra');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchMurid, setSearchMurid] = useState('');

  // Tapis nama murid berdasarkan kelas dan carian
  const filteredStudents = (STUDENT_DATA[selectedClass] || []).filter(name => 
    name.toLowerCase().includes(searchMurid.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !studentName || !level || !pageNumber) {
      alert("Sila pilih kelas, nama murid, tahap dan halaman.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasmik_records')
        .insert([{
          student_name: `${studentName} (${selectedClass})`,
          reading_type: readingType,
          level: level,
          page_number: parseInt(pageNumber),
          remarks: remarks,
          date: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
        }]);

      if (error) throw error;
      
      alert("✅ Rekod " + studentName + " berjaya disimpan!");
      
      // Reset form kecuali kelas
      setStudentName('');
      setSearchMurid('');
      setLevel('');
      setPageNumber('');
      setRemarks('');
    } catch (error) {
      alert("Ralat Simpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto mb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg">
          <BookOpen size={28} />
        </div>
        <h1 className="text-3xl font-black text-green-900 italic uppercase">Input Tasmik</h1>
      </div>

      {/* 1. PILIH KELAS */}
      <div className="mb-8">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Langkah 1: Pilih Kelas</label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => { setSelectedClass(c); setStudentName(''); }}
              className={`py-3 px-2 rounded-2xl font-black text-[10px] transition-all transform active:scale-95 border-2 ${
                selectedClass === c 
                ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {selectedClass && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 2. PILIH NAMA MURID */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">Langkah 2: Pilih Murid ({selectedClass})</label>
            
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text"
                placeholder="Cari nama murid..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-green-500"
                value={searchMurid}
                onChange={(e) => setSearchMurid(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {filteredStudents.map((name) => (
                <button
                  key={name}
                  onClick={() => setStudentName(name)}
                  className={`w-full text-left p-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                    studentName === name 
                    ? 'bg-green-50 text-green-700 border-2 border-green-500' 
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {name}
                  {studentName === name && <CheckCircle size={16} className="text-green-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. INPUT BACAAN */}
          {studentName && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-4">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Langkah 3: Rekod Bacaan</label>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2">Jenis</span>
                    <select 
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-green-700"
                      value={readingType}
                      onChange={(e) => setReadingType(e.target.value)}
                    >
                      <option>Iqra</option>
                      <option>Al-Quran</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2">Tahap / Juz</span>
                    <input 
                      type="text"
                      placeholder="Cth: 1 / Juz 30"
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    />
                  </div>
               </div>

               <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase ml-2">Muka Surat</span>
                  <input 
                    type="number"
                    placeholder="Masukkan no. halaman"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                  />
               </div>

               <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase ml-2">Catatan (Opsional)</span>
                  <input 
                    type="text"
                    placeholder="Cth: Lancar / Perlu ulang"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
               </div>

               <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
               >
                 {loading ? 'SEDANG MENYIMPAN...' : <><Save size={20} /> SIMPAN REKOD</>}
               </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default TasmikInput;