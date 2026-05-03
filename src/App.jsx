import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import StudentManagement from './pages/StudentManagement';
import TasmikInput from './pages/TasmikInput'; 
import ReportsAdmin from './pages/ReportsAdmin';
import TeacherProfile from './pages/TeacherProfile';

function App() {
  return (
    <Routes>
      {/* Semua halaman di bawah akan menggunakan layout AppLayout (Sidebar/Navbar) */}
      <Route element={<AppLayout />}>
        {/* Halaman Utama */}
        <Route path="/" element={<Landing />} />
        
        {/* Pengurusan Murid */}
        <Route path="/students" element={<StudentManagement />} />
        
        {/* Input Tasmik (Tempat cikgu isi data) */}
        <Route path="/tasmik" element={<TasmikInput />} /> 
        
        {/* Laporan (Tempat cikgu tengok hasil jadual) */}
        <Route path="/reports" element={<ReportsAdmin />} />
        
        {/* Profil Guru */}
        <Route path="/profile" element={<TeacherProfile />} />
        
        {/* Jika cikgu tersalah taip alamat, dia akan hantar ke Landing */}
        <Route path="*" element={<Landing />} />
      </Route>
    </Routes>
  );
}

export default App;