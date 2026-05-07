import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import MainLayout from './components/pages/layout/MainLayout'
import DoctorDashboard from './components/pages/doctor/DoctorDashboard'
import AdminDashboard from './components/pages/admin/AdminDashboard'
import DoctorsList from './components/pages/admin/DoctorsList'
import DepartmentList from './components/pages/admin/DepartmentList'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AdminDashboard />} />
           <Route path='/doctors' element={<DoctorsList/>} />
           <Route path='/department' element={<DepartmentList/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App
