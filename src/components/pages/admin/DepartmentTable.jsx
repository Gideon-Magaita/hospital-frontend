import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/DepartmentService";
import { useNavigate } from "react-router-dom";
  

import $ from "jquery";

// Bootstrap Modal Import
import { Modal } from "bootstrap";

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

// Export dependencies
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.vfs;

function DepartmentTable() {

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);


    const navigate = useNavigate();
    
  // =========================
  // STATES
  // =========================
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);



  // EDIT STATES
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // =========================
  // FETCH
  // =========================
  const fetchDepartments = () => {

    getAllDepartments()
      .then((response) => setDepartments(response.data))
      .catch(() => toast.error("Failed to load departments"));

  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // DATATABLE
  // =========================
  useEffect(() => {

    if (!departments || departments.length === 0) return;

    const timer = setTimeout(() => {

      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      dataTableRef.current = $(tableRef.current).DataTable({
        pageLength: 5,
        responsive: true,
        destroy: true,
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

    }, 100);

    return () => clearTimeout(timer);

  }, [departments]);

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEdit = (dept) => {

    setIsEdit(true);
    setEditId(dept.id);
    setDepartmentName(dept.name);

    const modal = new Modal(
      document.getElementById("departmentModal")
    );

    modal.show();
  };

  // =========================
  // SAVE / UPDATE
  // =========================
  const saveDepartment = async (e) => {

    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {

      if (isEdit) {

        const updated = {
          id: editId,
          name: departmentName,
        };

        await updateDepartment(editId, updated);

        toast.success("Department updated successfully");

        // update UI instantly
        setDepartments((prev) =>
          prev.map((d) =>
            d.id === editId ? { ...d, name: departmentName } : d
          )
        );

      } else {

        const response = await createDepartment({
          name: departmentName,
        });

        setDepartments((prev) => [...prev, response.data]);

        toast.success("Department added successfully");

      }

      // reset
      setDepartmentName("");
      setIsEdit(false);
      setEditId(null);

      // close modal
      const modal = Modal.getInstance(
        document.getElementById("departmentModal")
      );

      modal?.hide();

    } catch (error) {
      console.log(error);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  //DELETE DEPARTMENT
  const handleDelete = async (id) => {

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this department?"
      );

      if (!confirmDelete) return;

      try {

        await deleteDepartment(id);

        // remove from UI instantly
        setDepartments((prev) =>
          prev.filter((dept) => dept.id !== id)
        );

        toast.success("Department deleted successfully");

      } catch (error) {

        console.log(error);
        toast.error("Failed to delete department");

      }

    };


  return (
    <div className="container-fluid">

      <div className="page-inner">

        {/* CARD */}
        <div className="card shadow-sm mt-5">

          <div className="card-header">
              <div className="d-flex justify-content-between align-items-center w-100">

                <h3 className="mb-0">Department List</h3>

                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#departmentModal"
                  onClick={() => {
                    setIsEdit(false);
                    setDepartmentName("");
                  }}
                >
                  Add Department
                </button>

              </div>
          </div>

          <div className="card-body">

            <table
              ref={tableRef}
              className="table table-striped"
            >

              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
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

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleEdit(dept)}
                        >
                          Edit
                        </button>
                        
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(dept.id)}
                        >
                          Delete
                        </button>

                        <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/department-details/${dept.id}`)}
                      >
                        View
                      </button>

                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>

        {/* MODAL */}
        <div
          className="modal fade"
          id="departmentModal"
        >

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5>
                  {isEdit ? "Edit Department" : "Add Department"}
                </h5>

                <button className="btn-close" data-bs-dismiss="modal" />

              </div>

              <div className="modal-body">

                <form onSubmit={saveDepartment}>

                  <input
                    className="form-control"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                    placeholder="Enter department name"
                  />
                      <div className="d-flex justify-content-end justify-content-between mt-3">

                        {/* CLOSE BUTTON */}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          disabled={loading}
                        >
                          Close
                        </button>

                        {/* SAVE BUTTON */}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>

                      </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DepartmentTable;