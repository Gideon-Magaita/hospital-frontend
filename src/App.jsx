import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import MainLayout from './components/pages/layout/MainLayout'
import DoctorDashboard from './components/pages/doctor/DoctorDashboard'
import AdminDashboard from './components/pages/admin/AdminDashboard'
import DoctorsList from './components/pages/admin/DoctorsList'
import DepartmentList from './components/pages/admin/DepartmentList'
import DepartmentDetails from './components/pages/admin/DepartmentDetails'
import SpecializationList  from './components/pages/admin/SpecializationList'
import PatientList from './components/pages/receptionist/PatientList'
import AddEditDoctor from './components/pages/admin/AddEditDoctor'
import ReceptionDashboard from './components/pages/receptionist/ReceptionDashboard'
import AppointmentList from './components/pages/receptionist/AppointmentList'
import BillingList from './components/pages/receptionist/BillingList'

import Login from './components/auth/Login'
//React toast imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Route protection
import { isUserLoggedIn } from './components/pages/services/AuthService'



function App() {

//function to secure routes
  function AuthenticatedRoute({children}){
   const isAuth = isUserLoggedIn();

   if(isAuth){

    return children;
    
   }else{

    return<Navigate to="/login"/>

   }

  }
  //function ends here
  

  return (
    <>
    <Router>

      <Routes>

        {/* ================= PUBLIC ROUTE ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <MainLayout />
            </AuthenticatedRoute>
          }
        >

          <Route
            path="admin-dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="doctors"
            element={<DoctorsList />}
          />

          <Route
            path="department"
            element={<DepartmentList />}
          />

          <Route
            path="department-details/:id"
            element={<DepartmentDetails />}
          />

          <Route
            path="add-doctor"
            element={<AddEditDoctor />}
          />

          <Route
            path="edit-doctor/:id"
            element={<AddEditDoctor />}
          />

          <Route
          path="specialization"
          element={<SpecializationList/>}
          />

          <Route
            path="reception-dashboard"
            element={<ReceptionDashboard />}
          />

          <Route
            path="patient"
            element={<PatientList />}
          />

          <Route
            path="appointment"
            element={<AppointmentList />}
          />

          <Route
            path="billing"
            element={<BillingList />}
          />

          {/**DOCTOR URLS */}
          <Route
            path="doctor-dashboard"
            element={<DoctorDashboard />}
          />

        </Route>

      
        {/* ================= DEFAULT ROUTE ================= */}
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

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
