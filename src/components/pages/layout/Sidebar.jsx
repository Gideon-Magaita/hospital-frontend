import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  logout,
  isAdminUser,
  isReceptionistUser,
  isDoctorUser
} from "../services/AuthService";

export default function Sidebar() {

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdmin = isAdminUser();
  const isReceptionist = isReceptionistUser();
  const isDoctor = isDoctorUser();

  return (
    <aside className="main-sidebar sidebar-dark-primary">

      {/* BRAND */}
      <Link to="#" className="brand-link">
        <span className="brand-text font-weight-light">HMS</span>
      </Link>

      <div className="sidebar p-0">

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column">

            {/* ================= ADMIN ================= */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink to="/admin-dashboard" className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }>
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/department" className="nav-link">
                    <i className="nav-icon fas fa-building"></i>
                    <p>Departments</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/specialization" className="nav-link">
                    <i className="nav-icon fas fa-book"></i>
                    <p>Specialization</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/doctors" className="nav-link">
                    <i className="nav-icon fas fa-user-md"></i>
                    <p>Doctors</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>
              </>
            )}

            {/* ================= RECEPTIONIST ================= */}
            {isReceptionist && (
              <>
                <li className="nav-item">
                  <NavLink to="/reception-dashboard" className="nav-link">
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/patient" className="nav-link">
                    <i className="nav-icon fas fa-user-injured"></i>
                    <p>Register Patients</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/appointment" className="nav-link">
                    <i className="nav-icon fas fa-calendar"></i>
                    <p>Appointments</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/billing" className="nav-link">
                    <i className="nav-icon fas fa-file-invoice-dollar"></i>
                    <p>Billing</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>
              </>
            )}

            {/* ================= DOCTOR ================= */}
            {isDoctor && (
              <>
                <li className="nav-item">
                  <NavLink to="/doctor-dashboard" className="nav-link">
                    <i className="nav-icon fas fa-user-md"></i>
                    <p>Dashboard</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/doctor/patients" className="nav-link">
                    <i className="nav-icon fas fa-procedures"></i>
                    <p>My Patients</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/doctor/consultation" className="nav-link">
                    <i className="nav-icon fas fa-notes-medical"></i>
                    <p>Consultation</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/doctor/lab-requests" className="nav-link">
                    <i className="nav-icon fas fa-flask"></i>
                    <p>Lab Requests</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/doctor/profile" className="nav-link">
                    <i className="nav-icon fas fa-user"></i>
                    <p>Profile</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>
              </>
            )}

            {/* ================= SETTINGS ================= */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-cog"></i>
                <p>Settings</p>
              </Link>
            </li>

            <div className="dropdown-divider"></div>

          </ul>
        </nav>

      </div>
    </aside>
  );
}