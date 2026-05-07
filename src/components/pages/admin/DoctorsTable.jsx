import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";

// DataTables
import "datatables.net";
import "datatables.net-bs5";

// Buttons
import "datatables.net-buttons";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";

// Export deps
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.vfs;

// API
import { getAllDoctors } from "../services/DoctorService";


function DoctorsTable() {
  const tableRef = useRef(null);

  const [doctors, setDoctors] = useState([]);

  // =========================
  // FETCH DOCTORS FROM API
  // =========================
  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // =========================
  // INITIALIZE DATATABLE
  // =========================
  useEffect(() => {
    if (doctors.length === 0) return;

    // Destroy previous instance if exists
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    const table = $(tableRef.current).DataTable({
      pageLength: 5,
      responsive: true,

      dom:
        "<'row mb-3 align-items-center'<'col-md-6'l><'col-md-6 d-flex justify-content-end'B>>" +
        "<'row'<'col-12'fr>>" +
        "<'row'<'col-12'<'table-responsive't>>>" +
        "<'row mt-3'<'col-md-5'i><'col-md-7'p>>",

      buttons: [
        {
          extend: "excel",
          className: "btn btn-success btn-sm",
          title: "Doctors List",
        },
        {
          extend: "pdf",
          className: "btn btn-danger btn-sm",
          title: "Doctors List",
        },
        {
          extend: "print",
          className: "btn btn-secondary btn-sm",
          title: "Doctors List",
        },
      ],
    });

    return () => {
      table.destroy();
    };
  }, [doctors]);

  return (
    <div className="container-fluid">
      <div className="page-inner">

        <div className="card shadow-sm mt-5">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold">Doctors List</h3>
              <Link className="btn btn-primary" to="/add-doctor">
                Add Doctor
              </Link>
            </div>
          </div>

          <div className="card-body">

            <table
              ref={tableRef}
              className="table table-striped"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doc, index) => (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>

                    {/* If backend returns object use doc.department?.name */}
                    <td>{doc.departmentName}</td>

                    <td>{doc.phone}</td>

                    <td>
                      <span
                        className={`badge ${
                          doc.status === "Available"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-success btn-sm">
                          Edit
                        </button>
                        <button className="btn btn-secondary btn-sm">
                          View
                        </button>
                        <button className="btn btn-danger btn-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
}

export default DoctorsTable;