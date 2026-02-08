import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MainMenu from './pages/MainMenu'
import StudentManagement from './pages/StudentManagement'
import TasmikForm from './pages/TasmikForm'
import ReportsAdmin from './pages/ReportsAdmin'
import BulkClassPromotion from './pages/BulkClassPromotion'
import Archive from './pages/Archive'
import TeacherProfile from './pages/TeacherProfile'
import AppLayout from './components/AppLayout'

function App() {
  return (
    <div className="min-h-screen bg-background-dark text-white font-display antialiased">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/utama" replace />} />
          <Route path="utama" element={<MainMenu />} />
          <Route path="murid" element={<StudentManagement />} />
          <Route path="tasmik" element={<TasmikForm />} />
          <Route path="laporan" element={<ReportsAdmin />} />
          <Route path="kenaikan-kelas" element={<BulkClassPromotion />} />
          <Route path="arkib" element={<Archive />} />
          <Route path="profil" element={<TeacherProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
