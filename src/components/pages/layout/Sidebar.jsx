import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="main-sidebar sidebar-dark-primary">
      
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <img
          src="/dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">HMS</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar p-0">

        {/* Sidebar user panel */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="/dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <Link to="/" className="d-block">
              Gideon Magaita
            </Link>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            
            {/* Dashboard */}
            <li className="nav-item menu-open">
              <Link to="/" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Dashboard
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
            </li>

            <div className="dropdown-divider"></div>


            {/* Layout Options */}
            <li className="nav-item">
            <Link to="/doctors" className="nav-link">
                <i className="nav-icon fas fa-copy"></i>
                <p>
                Doctors
                <i className="fas fa-angle-left right"></i>
                </p>
            </Link>
            </li>

            <div className="dropdown-divider"></div>

            {/* Pages */}
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-book"></i>
                <p>
                  Settings
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
            </li>

            <div className="dropdown-divider"></div>

          </ul>
        </nav>

      </div>
      {/* /.sidebar */}
    </aside>
  );
}