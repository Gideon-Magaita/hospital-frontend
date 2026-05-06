import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import MainLayout from './components/pages/layout/MainLayout'
import DoctorDashboard from './components/pages/doctor/DoctorDashboard'
import AdminDashboard from './components/pages/admin/AdminDashboard'
import AddDoctors from './components/pages/admin/AddDoctors'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AdminDashboard />} />
           <Route path='/doctors' element={<AddDoctors/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
