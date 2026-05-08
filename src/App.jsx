import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import MainLayout from './components/pages/layout/MainLayout'
import DoctorDashboard from './components/pages/doctor/DoctorDashboard'
import AdminDashboard from './components/pages/admin/AdminDashboard'
import DoctorsList from './components/pages/admin/DoctorsList'
import DepartmentList from './components/pages/admin/DepartmentList'
import DepartmentDetails from './components/pages/admin/DepartmentDetails'
import AddEditDoctor from './components/pages/admin/AddEditDoctor'
//React toast imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AdminDashboard />} />
           <Route path='/doctors' element={<DoctorsList/>} />
           <Route path='/department' element={<DepartmentList/>}/>
           <Route path='/department-details/:id' element={<DepartmentDetails/>}/>
           <Route path='/add-doctor' element={<AddEditDoctor/>}/>
           <Route path="/edit-doctor/:id" element={<AddEditDoctor />} />
        </Route>
      </Routes>
    </Router>


    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>

  );
}

export default App
