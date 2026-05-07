import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDepartments } from "../services/DepartmentService";
import $ from "jquery";

// DataTables
import "datatables.net";
import "datatables.net-bs5";

// Buttons
import "datatables.net-buttons";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

// CSS
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";

// Export deps
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.vfs;

function DepartmentTable() {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null); // important for safe destroy

  const [departments, setDepartments] = useState([]);

  // Fetch data
  useEffect(() => {
    getAllDepartments()
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  // Initialize DataTable AFTER data is rendered
   useEffect(() => {
    if (departments.length === 0) return;

    // ensure previous instance is destroyed
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    // initialize AFTER DOM paint
    requestAnimationFrame(() => {
      dataTableRef.current = $(tableRef.current).DataTable({
        pageLength: 5,
        responsive: true,

        dom:
          "<'row mb-3 align-items-center'<'col-md-6'l><'col-md-6 d-flex justify-content-end'B>>" +
          "<'row'<'col-12'fr>>" +
          "<'row'<'col-12'<'table-responsive't>>>" +
          "<'row mt-3'<'col-md-5'i><'col-md-7'p>>",

        buttons: [
          { extend: "excel", className: "btn btn-success btn-sm" },
          { extend: "pdf", className: "btn btn-danger btn-sm" },
          { extend: "print", className: "btn btn-secondary btn-sm" },
        ],
      });
    });

  }, [departments.length]);

  return (
    <div className="container-fluid">
      <div className="page-inner">

        <div className="card shadow-sm mt-5">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold">Department List</h3>
              <Link className="btn btn-primary" to="/">
                Add Department
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
                  <th>Department Name</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{index + 1}</td>
                    <td>{dept.name}</td>

                    <td>
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-success btn-sm">Edit</button>
                        <button className="btn btn-secondary btn-sm">View</button>
                        <button className="btn btn-danger btn-sm">Delete</button>
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

export default DepartmentTable;