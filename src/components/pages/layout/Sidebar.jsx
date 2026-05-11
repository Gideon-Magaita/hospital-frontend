import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  logout,
  isAdminUser,
  isReceptionistUser
} from "../services/AuthService";

export default function Sidebar() {

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdmin = isAdminUser();
  const isReceptionist = isReceptionistUser();

  return (
    <aside className="main-sidebar sidebar-dark-primary">

      {/* ================= BRAND ================= */}
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
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink
                    to="/department"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <i className="nav-icon fas fa-building"></i>
                    <p>Departments</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/doctors" 
                  className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    >
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
                  <NavLink
                    to="/reception-dashboard"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/patient" 
                  className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    >
                    <i className="nav-icon fas fa-user-injured"></i>
                    <p>Register Patients</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/appointment" 
                  className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    >
                    <i className="nav-icon fas fa-calendar"></i>
                    <p>Appointment</p>
                  </NavLink>
                </li>

                <div className="dropdown-divider"></div>

                <li className="nav-item">
                  <NavLink to="/billing" className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    >
                    <i className="nav-icon fas fa-file-invoice-dollar"></i>
                    <p>Billing</p>
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

            {/* ================= LOGOUT ================= */}
            {/* <li className="nav-item">
              <button
                className="nav-link btn btn-link text-start w-100 border-0"
                onClick={handleLogout}
              >
                <i className="nav-icon fas fa-lock"></i>
                <p>Logout</p>
              </button>
            </li> */}

          </ul>
        </nav>

      </div>
    </aside>
  );
}