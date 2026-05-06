import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";

// DataTables
import "datatables.net";
import "datatables.net-bs5";

// Buttons
import "datatables.net-buttons";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

// Export deps
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.vfs;

function DoctorsTable() {
  const tableRef = useRef(null);

  // 👉 Your doctor data (replace later with API)
  const doctors = [
    {
      id: 1,
      name: "Mwakipesile",
      specialization: "Brain",
      phone: "0748013445",
      status: "Available",
    },
    {
      id: 2,
      name: "John Doe",
      specialization: "Cardiology",
      phone: "0712345678",
      status: "Unavailable",
    },
  ];

  useEffect(() => {
    // Destroy if already initialized
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    const table = $(tableRef.current).DataTable({
      pageLength: 5,
      responsive: true,

      dom:
        "<'row mb-3'<'col-md-6'l><'col-md-6 text-end'B>>" +
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

    return () => table.destroy();
  }, []);

  return (
    <div className="container-fluid">
      <div className="page-inner">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">Doctors List</h3>

          <Link to="/add-doctor" className="btn btn-primary btn-sm">
            + Add Doctor
          </Link>
        </div>

        {/* Card */}
        <div className="card shadow-sm">
          <div className="card-body">

            <table
              ref={tableRef}
              className="table table-bordered table-striped"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doc, index) => (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>
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