import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import StudentManagement from './pages/StudentManagement';
import TasmikForm from './pages/TasmikForm'; 
import ReportsAdmin from './pages/ReportsAdmin';
import TeacherProfile from './pages/TeacherProfile';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/tasmik" element={<TasmikForm />} /> 
        <Route path="/reports" element={<ReportsAdmin />} />
        <Route path="/profile" element={<TeacherProfile />} />
      </Route>
    </Routes>
  );
}

export default App;