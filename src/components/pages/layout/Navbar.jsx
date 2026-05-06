import React from "react";

export default function Navbar() {
  return (
    <nav className="main-header navbar navbar-expand navbar-dark">
      
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

        <li className="nav-item d-none d-sm-inline-block">
          <a href="/" className="nav-link">
            Home
          </a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        
        {/* Messages Dropdown Menu */}
        <li className="nav-item dropdown">
          <a
            className="nav-link"
            data-toggle="dropdown"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <i className="nav-icon fas fa-lock"></i>
          </a>

          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            
            <a href="#" className="dropdown-item" onClick={(e) => e.preventDefault()}>
              
              {/* Message Start */}
              <div className="media">
                <img
                  src="/dist/img/user1-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 mr-3 img-circle"
                />

                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Brad Diesel
                  </h3>

                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"></i> 4 Hours Ago
                  </p>
                </div>
              </div>
              {/* Message End */}

            </a>

            <div className="dropdown-divider"></div>
            <div className="dropdown-divider"></div>

            <a
              href="#"
              className="dropdown-item dropdown-footer"
              onClick={(e) => e.preventDefault()}
            >
              Logout
            </a>

          </div>
        </li>
      </ul>
    </nav>
  );
}