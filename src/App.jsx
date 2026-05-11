import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import MainLayout from './components/pages/layout/MainLayout'
import DoctorDashboard from './components/pages/doctor/DoctorDashboard'
import AdminDashboard from './components/pages/admin/AdminDashboard'
import DoctorsList from './components/pages/admin/DoctorsList'
import DepartmentList from './components/pages/admin/DepartmentList'
import DepartmentDetails from './components/pages/admin/DepartmentDetails'
import PatientList from './components/pages/receptionist/PatientList'
import AddEditDoctor from './components/pages/admin/AddEditDoctor'
import ReceptionDashboard from './components/pages/receptionist/ReceptionDashboard'
import AppointmentList from './components/pages/receptionist/AppointmentList'
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
        {/* === PUBLIC ROUTES ===*/}
          <Route path="/login" element={<Login />} />

        {/*=== PROTECTED ROUTES ===*/}
        <Route path="/" element={<MainLayout />}>
          <Route path='/admin-dashboard' element={
            <AuthenticatedRoute>
                <AdminDashboard />
            </AuthenticatedRoute>
          
            }/>
           <Route path='/doctors' element={
              <AuthenticatedRoute>
                <DoctorsList/>
              </AuthenticatedRoute>
            } />
           <Route path='/department' element={
              <AuthenticatedRoute>
                <DepartmentList/>
              </AuthenticatedRoute>

          }/>
           <Route path='/department-details/:id' element={
            <AuthenticatedRoute>
            <DepartmentDetails/>
          </AuthenticatedRoute>
 
            }/>

           <Route path='/add-doctor' element={
            <AuthenticatedRoute>
               <AddEditDoctor/>
            </AuthenticatedRoute>
          
            }/>
           <Route path="/edit-doctor/:id" element={
             <AuthenticatedRoute>
               <AddEditDoctor />
            </AuthenticatedRoute>
           
            } />

            <Route
              path="/reception-dashboard"
              element={
                <AuthenticatedRoute>
                  <ReceptionDashboard />
                </AuthenticatedRoute>
              }
            />

            <Route path="/patient" element={
             <AuthenticatedRoute>
               <PatientList/>
            </AuthenticatedRoute>
           
            } />

            <Route path="/appointment" element={
             <AuthenticatedRoute>
               <AppointmentList/>
            </AuthenticatedRoute>
           
            } />


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
