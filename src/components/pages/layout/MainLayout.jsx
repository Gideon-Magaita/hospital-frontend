import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout(){
  return (
    <div className="wrapper">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="content-wrapper">
        <Outlet/>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}