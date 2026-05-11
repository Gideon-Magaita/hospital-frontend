import React from "react";
import { useNavigate } from "react-router-dom";
import { logout,getLoggedInUser } from "../services/AuthService";

export default function Navbar() {
  
  const navigate = useNavigate();

  const username = getLoggedInUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="main-header navbar navbar-expand navbar-dark bg-dark">
      
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
            onClick={(e) => e.preventDefault()}
          >
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">

        <li className="nav-item dropdown user-menu">
          
          <a
            href="#"
            className="nav-link dropdown-toggle d-flex align-items-center"
            data-toggle="dropdown"
            onClick={(e) => e.preventDefault()}
          >
            <img
              src="assets/img/user.png"
              className="user-image img-circle elevation-2"
              alt="User"
              style={{
                width: "35px",
                height: "35px",
                objectFit: "cover"
              }}
            />

            <span className="d-none d-md-inline ml-2 fw-bold text-uppercase">
              {username}
            </span>
          </a>

          <div
            className="dropdown-menu dropdown-menu-lg dropdown-menu-right shadow border-0"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              minWidth: "280px"
            }}
          >

            {/* User Header */}
            <div
              className="text-center p-4"
              style={{
                background: "linear-gradient(135deg, #a40101, #fb8068)",
                color: "white"
              }}
            >
            
              <h5 className="mb-1 fw-bold">System User</h5>

              <p className="mb-0 small text-uppercase">
                {username}
              </p>
            </div>

            {/* User Body */}
            <div className="p-3">

              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-clock text-muted mr-2"></i>
                <small className="text-muted">
                  Last login: 4 Hours Ago
                </small>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-block d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  fontWeight: "600",
                  transition: "0.3s"
                }}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>

            </div>

          </div>

        </li>

      </ul>
    </nav>
  );
}