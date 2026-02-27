import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Save, Users, BookOpen, CheckCircle, Search, GraduationCap, AlertCircle } from 'lucide-react';

// DATA MURID LENGKAP DARI CSV CIKGU
const STUDENT_DATA = {
  '4 ARIF': ["AAIRA SAFFIAH BINTI NASRI CORPUZ", "ADAM DANIAFDNAN BIN RAZAIMAN", "ADRYAN SHAH BIN JAINUDDIN", "AHMAD SYAZWAN NAZMI BIN AZMIL", "AHMAD ZULHILMI BIN ZAMSARI", "ALIFF NAUFAL BIN MOHD PADLE", "ASHAFIERA DANIA BINTI SHERONSHAFIE", "AULIA IZZATUNNISA BINTI DARMANSHAH", "ELZAVIERAH SOFIAH BINTI MOHD NORZAIM", "ILHAM BIN RAHMAT", "ISABEL SYIFA BINTI ZAIONELL", "KHALISA AQILA BINTI JAINAL ABIDIN", "MOHAMAD AIMAN BIN MOHAMAD ANUAR", "MOHAMAD HADIF DAYYAN BIN MUSCIN", "MOHAMAD JOHAIREL BIN JOHAN", "MOHAMAD MAULUDDIN BIN ABDULLAH", "MOHAMMAD A AFAIZRAN ILDRIN BIN ABDULLAH", "MOHAMMAD DENIAL BIN SAMSON", "MOHAMMAD SAHFIEZAN BIN ABDULLAH", "MOHAMMAD ZULFITRI BIN MOHD ZULKIFLI", "MUHAMMAD ADAM DAYYAN BIN CHARIS", "MUHAMMAD AQEL EZZEDDEN BIN NAJIB", "MUHAMMAD ARIFFIN BIN HUSIN", "MUHAMMAD AUF ZAFRAN BIN ABDUL GAPUR", "MUHAMMAD FATTAH IRFAN BIN RUSTAM", "MUHAMMAD ISRAM BIN ABDUL RAFI", "MUHAMMAD NAZMI BIN NAZIB"],
  '4 PINTAR': ["ABDUL FAHIM BIN MOHAMMAD FIRDAUS", "AFIFUDDIN BIN MEKAEL", "AHMED DEEDAT BIN MIKAIL NELSON", "AIYREEN HAFIENAH BINTI MOHD HIJRAH", "ALIF SYUKRIE BIN ABIRIN", "ALVALE JL WILFRED", "AMIRZA BIN ABDULLAH", "AYRA ADREENA DZAHRA BINTI HAIRUDDIN", "INEZ SYIFA BINTI ISMAIL", "LUTFI AL FATEH ACHONDO BIN LEOPOLDO JR", "MOHAMAD ALMANI MIKAIL BIN ABDULLAH", "MOHAMAD HAIRIL HAKIMI BIN ABDULLAH", "MOHAMAD YUSOF BIN MAHMUD", "MOHAMMAD ED BOY SYAH BIN ABDULLAH", "MOHAMMAD SYAZWAN SHAH BIN ABDULLAH", "MUHAMMAD ADZMEER RAFLI BIN ABDULLAH", "MUHAMMAD AQIL ASYRAF BIN RAYMAN SHAH", "MUHAMMAD ARMAN BIN MOHD YUNUS", "MUHAMMAD AZMIER AIMIN BIN ALDIMIER", "MUHAMMAD FARISH ASYRAF BIN MOHD HAJWAN", "MUHAMMAD HAFIZAL BIN JIGTOL", "MUHAMMAD HARYYAN DAINEL BIN HASSAN BASRI", "MUHAMMAD KHAIRULLAH BIN KARIM", "MUHAMMAD MISARIEL BIN ABDULLAH", "MUHAMMAD RAYQAL BIN MOHD AZMIE", "MUHAMMAD RIEZZ HAIKAL BIN HUSSIN", "MUHAMMAD SHAHRIZAL BIN ABDULLAH"],
  '4 BIJAK': ["ABDUL RAZIF BIN ABDULLAH", "AHMAD AMMAR ARIF BIN JUMARDI", "AINUL MARDHIA BINTI MOHD AIDEL", "ALESYAH BINTI MOHD ARBI", "AMMAR AZHARI BIN MOHAMMAD ARAFAT", "AZIATUL ATILIA BINTI AZIZUL", "FAZRYEYANA HUMAIRA BINTI AL SHAMJA", "JANNATUL QHALEESYA BINTI NAZIB", "MAIZATUL NAFISAH BINTI ABDUL WAHID", "MOHAMAD ARYANSYAH BIN AHMAD ROZAINI", "MOHAMAD HAZIQ HAFIZAN BIN ABDUL RAUP", "MOHAMAD SHARHAN SYAHFIQ BIN ABDULLAH", "MOHAMMAD ADZRIEL HAKIMI BIN MOHD RIZWAN", "MUHAMAD HADIF BIN MUHAMAD ADNAN", "MUHAMMAD ALNAFI BIN ALNATI", "MUHAMMAD ARASH DENIAL BIN MUHAMMAD NORAZIJUL", "MUHAMMAD ARSHAD BIN JAMAIN", "MUHAMMAD BIN ABDULLAH", "MUHAMMAD FAQRUL ZAQWAN BIN ABDULLAH", "MUHAMMAD HAFIZUL ASHRAF BIN ZAINUDDIN", "MUHAMMAD HARAZ NAUFAL", "MUHAMMAD HUZAIFAH BIN ISMAIL", "MUHAMMAD KHALEED ISHAK BIN MUHAMMAD ABUZA", "MUHAMMAD RAYYAN MIKAIL BIN JAY MCLESLIE", "MUHAMMAD SYAFIQ AQIL BIN RAMAKARMA"],
  '4 CERDIK': ["ADRESIA NURAUFA BINTI DATU AZRUN", "AHMAD FARISH BIN MOHD FAIZIL", "AHMAD NUR RIZQI BIN ROSLI", "AISY MIKHAIL BIN ROSDI", "ALIFF HAZIQ BIN ALFIAN", "AQILAH HUMAIRA BINTI MOHD.WAFIUDDIN AUFIQ", "ELYA ADRIANA BINTI AMRAN", "FIRASH WALFIYQ ARSHAD BIN ABDULLAH", "MOHAMAD AIDIL YAZID BIN MOHD FAZIDI", "MOHAMAD AZRUL AFFEDDY BIN ABD MALIK", "MOHAMAD IZZUL HAKIM BIN NASIR", "MOHAMAD JUARFAH", "MOHAMAD SHARHAN SYAHFIE BIN ABDULLAH", "MOHAMMAD AL AZIM SHAH BIN MOHD AMRAN", "MOHAMMAD KAIS", "MOHAMMAD RAYYAN RAMADHANI BIN ABDULLAH", "MOHAMMAD ROZAIME HARRAZ BIN ABDUL AZIZ", "MUHAMAD SHAH MIRZAN BIN HASSAN", "MUHAMMAD AMSYAR BIN AMRASIN", "MUHAMMAD ARFAN BIN ASLAM", "MUHAMMAD HAKIMI BIN ABDULLAH", "MUHAMMAD IRFAN BIN SUKERDI", "MUHAMMAD MIQAIL BIN MOHD FETRI", "MUHAMMAD RAYYAN SYUKRI BIN ABDULLAH", "MUHAMMAD RIDWANN SHAH BIN SALASA", "MUHAMMAD THAQIF SHAFY BIN SAID", "NOFAL UZAIRI BIN SUZAIRI", "NUR DHIA MALINDA"],
  '5 ARIF': ["ADAWIYAH ZAHRA VARISHA BINTI MOHAMAD JAPAR", "ADEELYA EL ZAHRA BINTI MOHAMMAD FAZIR", "ALEESYA EL ZAHRA BINTI MOHAMMAD FAZIR", "AMMAR HAZIQ BIN WAHYU DWICANDRA", "ASYIFF BIN BAHARUDIN", "DAMIA FARISHA BINTI ABDULLAH", "EMAN NOUR SOFEYYA BINTI KHAIRUDDIN", "IRENE SYIFA BINTI ZAIONELL", "LILY TASNEEM BINTI MOHD RHAFIE", "MOHAMAD AMIN FATTAH BIN MOHAMAD AMZANIE", "MOHAMMAD ADAMI BIN JULASRI", "MOHAMMAD ARDHANI AL HAKIM BIN ROSZALIE", "MOHAMMAD FAZRIL HAIDI BIN MD.NOOR", "MOHAMMAD HAZRIQSYAH FITRIE BIN JAMRI", "MOHAMMAD MUAZ BIN AJIS MERAH", "MOHAMMAD SHAZUDDIN BIN SAIFUDDIN", "MUHAMMAD ABDULLAH BIN LARRY VALDUEZA", "MUHAMMAD AISY RAYYAN BIN MUHAMAD MAHATIR", "MUHAMMAD AQIL ZIQRI BIN SUHAIDIR", "MUHAMMAD ASRAF BIN ABDULLAH", "MUHAMMAD ASYRAF ZAQWAN BIN ASRIANSHAH", "MUHAMMAD AZRAIE BIN YANG LOI", "MUHAMMAD FAHRIN FARHIMIE BIN ASMADI", "MUHAMMAD FIRDAUS BIN MOHD"],
  '5 PINTAR': ["ADIRA AZZAHRA BINTI HARDI", "AHMAD AZIM HANAFI BIN SURIYONO", "ALIF ASHRAF BIN ABIRIN", "ALYA ADRIANA BINTI RAMLEE", "ANALISA BINTI ABDULLAH", "ARRYAN ZULFIQAR BIN RAZIMAN", "DAYANG NUR NIYA RAMADHANI BINTI ABDULLAH", "HARNINDA BINTI SHAHIR", "HARNOD FREDDIAN FREDRICK", "IZZ ISAAC BIN ABDULLAH", "JUAN ISKANDAR BIN AWANG", "MOHAMAD FARHAN BIN PARMAN", "MOHAMAD HADIF ZAWIR BIN ABDULLAH", "MOHAMMAD AIRIL SYAHMIL BIN ABDULLAH", "MOHAMMAD ASHRAF HAIKAL BIN MOHAMMAD AMSAR", "MOHAMMAD HARMILZAN WAN SHAH BIN HASMAADI", "MOHAMMAD ZULQAZEM BIN IMRAN", "MUHAMMAD ADIB BIN MOHAMAD YUNUS", "MUHAMMAD ALIF BIN MOHAMAD ZULKEFLI", "MUHAMMAD ALIF SUFI BIN ALIAS", "MUHAMMAD ARYAN IRFAN BIN MASCADI", "MUHAMMAD FARHAN FAKHRI BIN BARKARY @ BAKRI", "MUHAMMAD FIRDAUS SYAH BIN LAGUNTUR", "MUHAMMAD HIFZHAN ZIQRY BIN MOHD FADLY", "MUHAMMAD MIKAIL RIZWAN BIN ARIS", "MUHAMMAD SAHRUL ARDIANSYAH BIN HIDAYAT", "MUHAMMAD SALMAN BIN WAHAB", "NUR ADEMIA FALESHA BINTI ADNAN"],
  '5 BIJAK': ["AFIFAH FITRI BINTI ABDULLAH", "ALIF DANIEL BIN SAHARUDDIN", "ARIESSA SOFEA BINTI MOHD RIDWAN", "ARYAN HAMIZAN BIN SYARIF", "AWANG AFANDI BIN ABDULLAH", "ELFASYAFIAH BINTI ABDULLAH", "HANA MARDHIYAH BINTI MOHD HERMANSHAH", "KHAIRUL IKHWAN BIN MUHAMMAD TAJUDDIN", "MAYA CAMPAS", "MOHAMAD KHAIRUL NIZAM BIN ABDULLAH", "MOHAMAD NAZRIN BIN MOHD NAZRI", "MOHAMMAD ALIF BIN ROMJIALI", "MOHAMMAD AZIMAN HUDZAIRY BIN RAMLI", "MOHAMMAD IMAN FADLI BIN ISAHAK", "MOHAMMAD QUZAIRY BIN ABDULLAH", "MUHAMAD AMIRUL KUZAIRIL BIN AMIRUDIN", "MUHAMAD IZZUL ALIF BIN MALAKU", "MUHAMMAD ATHIFIZAN BIN ABDULLAH", "MUHAMMAD AZRIN BIN MOHD AZRI", "MUHAMMAD DAYYAN BIN SULIMAN", "MUHAMMAD FARID AQASHA BIN MOHD FAUZI", "MUHAMMAD FIRMAN SHAH BIN SALASA", "MUHAMMAD SHAH PUTRA BIN MAZLAN", "NUR ADIBAH SYAKIRA BINTI ASRIZAN", "NUR AISYAH INSYIRAH BINTI RAMAN", "NUR ALIFAH HUSNA BINTI RAZALI", "NUR AMERA ARDINA BINTI MOHAMMAD"],
  '5 CERDIK': ["AINUR MARDHIAH BINTI PAHYUDDIN", "ARYAN RAFIE BIN ALJUN", "AULIA IZZATUNNISA BINTI LADINAR", "DANI ASHRAF BIN NASIR", "DAYANG ROSAQILA BINTI RUSLI", "DHANIYAH IDZZARAH BINTI HAIRUL", "MARISSA BINTI ABDULASIT", "MAWARDI ABDUL HAKIM BIN JEFRY", "MAZLAN BIN ARMAN", "MOHAMAD QUZHAIRIE BIN YAKOB", "MOHAMMAD DANIEL ISMAIL BIN BASTIAN", "MOHAMMAD HAFIZUL BIN KAMSAH", "MOHAMMAD IZZAT BIN JAPAR", "MOHAMMAD SYAHRUL NIZAM BIN RAZJIM", "MUHAMAD AR RAFIF BIN MOHD ISAM", "MUHAMMAD AIRIL BIN AHIDON", "MUHAMMAD AQIB ZAFUAN BIN MOHD MISRA", "MUHAMMAD AZKA ALDRIC BIN JASMAN", "MUHAMMAD EYLMAN BIN MOHD ESWAN", "MUHAMMAD FARIS BIN SHAZLIND RAZIF", "MUHAMMAD IQBAL BIN RIFIN", "MUHAMMAD KHAIRUL MUSTASHIM BIN BASRY", "MUHAMMAD NOOR IKHWAN SYAH BIN BASRAN", "MUHAMMAD RAYYAN ADDAM BIN ROSSDY", "MUHAMMAD RIDHWAN ALHAFIZ BIN ROSLAN", "MUHAMMAD SYUHAFFZAN RAMADHAN BIN RAHMAN ALI"],
  '6 ARIF': ["ABDU RAPHE BIN JERRY", "AFIQAH NUR ADWA BINTI RAHMAT ISKANDAR", "AISYAH AIRIS BINTI MOHD RIZAL", "AKRAMEL BIN TANASAIN", "ANNUR FITRIYANA BINTI MUJI", "ARISYA BINTI ROSLI", "ARMEL ASIHAH BINTI ABDULLAH", "DANG ZARA DHIYA AZZALEA BINTI MOHD FITRY", "FATIAH MUTIARA BINTI FAIN", "HURUL HAYANI BINTI ALI HASSAN", "LUQMANUL HAKIM ACHONDO BIN ABDULLAH", "MOHAMAD AFIK ISYAK BIN ABD.RAJAK", "MOHAMAD ZUL FIRDAUS BIN JAINAL", "MOHAMMAD AMMAR NAIM BIN ABDULLAH", "MOHAMMAD FAHIN HAFIZI BIN RAZLAN", "MOHAMMAD HAZRIESHAH BIN MOHAMMAD JASRI", "MUHAMMAD 'AMMAR HAFIY BIN AB HAMID", "MUHAMMAD ADLI AZIZI BIN ALI", "MUHAMMAD AHNAF ZIQHRI BIN ZAMDIN", "MUHAMMAD ATIF SAFWAN BIN ABDULLAH", "MUHAMMAD FAKHRUDDIN FURQAN BIN MAZLANI", "MUHAMMAD HAFIZ REZKI BIN ARIS", "MUHAMMAD IQRAM BIN E.D ELHAM", "MUHAMMAD LUTH AL BAIHAQI BIN KHAIRUDDIN", "MUHAMMAD MAH'SAH FATHUL ISLAM BIN SAHIRIN", "MUHAMMAD SUZAILI BIN ROSLAN"],
  '6 PINTAR': ["AFIQ FIRDAUS BIN MAHMUD", "AIMAN BIN SALMAN", "AIRISYA SUFYA BINTI AINOLYAKIN", "AISYAH ISFADIAH BINTI MOHD RAFFIE", "AMMAR QAYS FIRDAUS BIN MUSLIM", "AQIL ASYRAFF BIN SARBANEY", "DAMIA MAISARAH BINTI ABDULLAH", "DAYANG NURSYAUQINA ADZMIEYQA BINTI NAZRI", "HAZIQ HAZIM BIN HADSMAN", "JUDIT GAUTIL", "KHALISH HAIKAL BIN JAPAR", "MOHAMAD AZREY AFFELDY BIN ABD MALIK", "MOHAMMAD AIRIEL BIN AYUM", "MOHAMMAD ASYFAR ADYZAL BIN ASYRAF FATHI", "MOHAMMAD QHALIF ADIF BIN ABDULLAH", "MUHAMMAD ADIB ILYAS BIN MAHALAN", "MUHAMMAD AKMAL HILMI BIN FIRMAN", "MUHAMMAD ASYRAAF BIN ISMAIL", "MUHAMMAD DANISH BIN MOHD FAIZAL FAZAWI", "MUHAMMAD FALAH AFI BIN JABARUDDIN", "MUHAMMAD HAIQAL HAFIZUDDIN BIN WAFI", "MUHAMMAD HAZIQ ZHARIF BIN NASRI CORPUZ", "MUHAMMAD ILHAM SHAH BIN MAJIT", "MUHAMMAD KHAIRUL IKHWAN BIN MOHAMMAD KHAIRYZAN", "MUHAMMAD SHAHRIYADH BIN SIBIKTOR", "NOEL FREDDIAN FREDRICK", "NUR ALYA KAISARA BINTI ABDULLAH"],
  '6 BIJAK': ["ADAM ADWA BIN BAHAR", "AHMAD FA'IZ ASNAWI BIN MUSA", "AINUL MARDHIAH BINTI ABDULLAH", "AINUL SALFINAH BINTI SALIM CHAN", "AIREEN AULIA BINTI ABDULLAH", "ALEESYA NURQUZAIRAH BINTI DATU AZRUN", "ASYRAAF BIN SAUFFI", "AWANG ZAHIRUL HAZIQ BIN AWANG HUSSIN", "FATIMAH BINTI MUHSIN AL HAMID", "ILHAM AFIQ BIN FAUZI", "MOHAMAD AIMAN SYAHFIE BIN ABDULLAH", "MOHAMAD AMIRUL RISKY BIN ABDULLAH", "MOHAMAD ARSHAD BIN ABDULLAH", "MOHAMAD FAREED MIRZA BIN KHAMIS", "MOHAMAD FIRMAN BIN ABDULLAH", "MOHAMMAD AFIQ ZUHAILI BIN KEFLYE", "MOHAMMAD AIRIEL HAKIMI BIN ABDULLAH", "MOHAMMAD ALIFF HAKIMI BIN MOHAMMAD AMSAR", "MOHAMMAD IRWAN SYAH BIN JOLPIN", "MOHAMMAD WAFIY ARIFFIN BIN ABDULLAH", "MUHAMAD RASYDAN BIN RAZLAN", "MUHAMMAD AISH DANISH BIN CHARIS", "MUHAMMAD ASHRAF IMAN BIN RIZWAN", "MUHAMMAD AZIM BIN ASMADI", "MUHAMMAD FAUZAN BIN FAIZAL", "MUHAMMAD IZZUDDIN BIN MUHAMMAD KASDI", "MUHAMMAD JULASRI BIN JULASPI"],
  '6 CERDIK': ["ABDUL MAJID FIRDAUS BIN SHAZLIND RAZIF", "AFIF ASYRAF BIN MAZLAN", "AHMAD YUSUF BIN MOHD FARUQI", "ALISHA SAFIYA HAWA BINTI JAY MCLESLIE", "ALZAM BIN BUSRAH", "ARIANA ROSE BINTI MOHD NURHASIDIN", "AZIZUL RAMLI BIN JUNIDY", "DAYANG NUR HUSNA UMAIRAH BINTI OSMAN", "HAYKAL ASYRAF TAUFIK BIN ABDULLAH", "KHAIRAH ZARA ATIYAH BINTI SAMTI", "MOHAMAD AQID DANISH BIN HASLAN", "MOHAMMAD AQMAL BIN MOHAMMAD MOSADDIQ", "MOHAMMAD QAYYUM MUHSIY BIN ABDULLAH", "MOHAMMAD SYAH DANIAL BIN ABDULLAH", "MOHAMMAD ZACK ZIADDIN BIN SAIFUDDIN", "MUHAMMAD AISY ALIFYA BIN AHMADI", "MUHAMMAD AISY RAYFAL BIN RUSLIN", "MUHAMMAD ASRAFF HAQIMIE BIN ARMAN", "MUHAMMAD AZWAR RAYQALD BIN MOHD ANWAR REDZWAND", "MUHAMMAD FIRDAUS BIN MUSJUMADI", "MUHAMMAD HAFIZZUDIN BIN HASAN", "MUHAMMAD KAMIL FAHMI BIN SAPARUDDIN", "MUHAMMAD RIZAFRIE AFIZI BIN ABDULLAH", "MUHAMMAD SHERY FIRAS BIN AZMAN", "MUHAMMAD WAFIQ BIN SAIH", "NADHIM NAFIS BIN ABDULLAH"]
};

function TasmikInput() {
  const [selectedClass, setSelectedClass] = useState('');
  const [studentName, setStudentName] = useState('');
  const [readingType, setReadingType] = useState('Iqra');
  const [level, setLevel] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchMurid, setSearchMurid] = useState('');

  const CLASSES = Object.keys(STUDENT_DATA);

  const filteredStudents = (STUDENT_DATA[selectedClass] || []).filter(name => 
    name.toLowerCase().includes(searchMurid.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !studentName || !level || !pageNumber) {
      alert("⚠️ Sila lengkapkan pilihan murid, tahap dan halaman.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        student_name: `${studentName} (${selectedClass})`,
        reading_type: readingType,
        level: level.toString(),
        page_number: parseInt(pageNumber),
        remarks: remarks || '-',
        date: new Date().toLocaleDateString('en-CA') 
      };

      console.log("Menghantar data ke Supabase:", payload);

      const { data, error } = await supabase
        .from('tasmik_records')
        .insert([payload])
        .select();

      if (error) throw error;
      
      console.log("Respon berjaya:", data);
      alert(`✅ Berjaya! Rekod ${studentName} telah disimpan.`);
      
      // Reset input selepas simpan
      setStudentName('');
      setSearchMurid('');
      setLevel('');
      setPageNumber('');
      setRemarks('');
      
    } catch (error) {
      console.error("Ralat simpan data:", error);
      alert("❌ GAGAL SIMPAN: " + error.message + "\n\nSila pastikan jadual 'tasmik_records' wujud di Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto mb-24 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-600 p-4 rounded-3xl text-white shadow-xl">
          <GraduationCap size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-green-900 italic uppercase">Input Tasmik</h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-tighter">Pilih murid & kemaskini bacaan</p>
        </div>
      </div>

      {/* 1. PILIH KELAS */}
      <div className="mb-8">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block italic">Langkah 1: Pilih Kelas</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => { setSelectedClass(c); setStudentName(''); setSearchMurid(''); }}
              className={`py-4 rounded-2xl font-black text-xs transition-all transform active:scale-95 border-2 ${
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
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block italic">Langkah 2: Pilih Nama Murid ({selectedClass})</label>
            
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text"
                placeholder="Cari nama murid..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchMurid}
                onChange={(e) => setSearchMurid(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredStudents.length > 0 ? filteredStudents.map((name) => (
                <button
                  key={name}
                  onClick={() => setStudentName(name)}
                  className={`w-full text-left p-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                    studentName === name 
                    ? 'bg-green-50 text-green-700 border-2 border-green-500' 
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="uppercase">{name}</span>
                  {studentName === name && <CheckCircle size={18} className="text-green-600" />}
                </button>
              )) : (
                <div className="text-center py-6 text-gray-400 italic">
                   <AlertCircle className="mx-auto mb-2 opacity-20" size={32} />
                   <p className="text-xs">Tiada nama ditemui...</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. BORANG INPUT */}
          {studentName && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-5">
               <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-2">
                 <p className="text-[10px] font-black text-green-600 uppercase mb-1">Murid Terpilih:</p>
                 <p className="font-black text-green-900 uppercase text-sm">{studentName}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Jenis Bacaan</span>
                    <select 
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black text-green-700 outline-none focus:ring-2 focus:ring-green-500"
                      value={readingType}
                      onChange={(e) => setReadingType(e.target.value)}
                    >
                      <option>Iqra</option>
                      <option>Al-Quran</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">{readingType === 'Iqra' ? 'Tahap (1-6)' : 'Juz (1-30)'}</span>
                    <input 
                      type="text"
                      placeholder={readingType === 'Iqra' ? "Cth: 3" : "Cth: 15"}
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black outline-none focus:ring-2 focus:ring-green-500"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    />
                  </div>
               </div>

               <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Nombor Halaman</span>
                  <input 
                    type="number"
                    placeholder="Masukkan nombor sahaja"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none font-black outline-none focus:ring-2 focus:ring-green-500"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                  />
               </div>

               <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Catatan Tambahan</span>
                  <input 
                    type="text"
                    placeholder="Cth: Lancar, perlu ulang, dsb."
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-600 outline-none focus:ring-2 focus:ring-green-500"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
               </div>

               <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50"
               >
                 {loading ? (
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>MENYIMPAN...</span>
                   </div>
                 ) : (
                   <><Save size={24} /> SIMPAN REKOD</>
                 )}
               </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default TasmikInput;