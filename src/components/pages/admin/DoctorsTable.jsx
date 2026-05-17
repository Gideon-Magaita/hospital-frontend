import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmModal from "../../common/ConfirmModal";

//API
import {
  getAllDoctors,
  deleteDoctor,
} from "../services/DoctorService";

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



function DoctorsTable() {

  const tableRef = useRef(null);

  const [doctors, setDoctors] = useState([]);


  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  //for showing doctor details popup modal
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // =========================
  // FETCH DOCTORS FROM API
  // =========================
  
    const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      toast.error("Failed to load doctors")
      console.error(error);
      
    }
  };

//view details function
const handleViewDoctor = (doctor) => {

  setSelectedDoctor(doctor);

  setShowViewModal(true);
};


//Modal button delete function
  const handleDeleteClick = (id) => {
    setSelectedDoctorId(id);
    setShowDeleteModal(true);
  };

//confirm delete modal
const confirmDelete = async () => {

  try {

    setDeleteLoading(true);

    await deleteDoctor(selectedDoctorId);

    toast.success("Doctor deleted successfully");

    setShowDeleteModal(false);

    fetchDoctors();

  } catch (error) {

    console.error(error);

    toast.error("Failed to delete doctor");

  } finally {

    setDeleteLoading(false);
  }
};
//end confirm delete


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
    <>
    <div className="container-fluid">
      <div className="page-inner">

        <div className="card shadow-sm mt-5">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold text-bold">Doctors List</h3>
              <Link className="btn btn-primary btn-lg" to="/add-doctor">
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
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doc, index) => (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>{doc.name}</td>
                    <td>
                       {doc.specializationName || "No specialization assigned"}
                    </td>

                    <td>{doc.departmentName}</td>

                    <td>{doc.phone}</td>
                    <td>{doc.username}</td>
                    <td>{doc.email}</td>

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
                        <Link
                        to={`/edit-doctor/${doc.id}`}
                        className="btn btn-success btn-sm"
                      >
                        Edit
                      </Link>

                        <button
                          className="btn btn-secondary btn-sm text-white"
                          onClick={() => handleViewDoctor(doc)}
                        >
                          View
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(doc.id)}
                        >
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


  {/* confirm delete modal imported from commom folder  */}
  <ConfirmModal
    show={showDeleteModal}
    onHide={() => setShowDeleteModal(false)}
    onConfirm={confirmDelete}
    title="Delete Doctor"
    message="Are you sure you want to delete this doctor?"
    loading={deleteLoading}
  />

  {/* modal to view doctor details */}
  <Modal
  show={showViewModal}
  onHide={() => setShowViewModal(false)}
  centered
  size="lg"
>

  <Modal.Header
    closeButton
    className="bg-info text-white"
  >
    <Modal.Title>
      Doctor Details
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>

    {selectedDoctor && (

      <div className="container-fluid">

        {/* TOP DETAILS SECTION */}
        <div className="text-center mb-4">

          <div
            className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center mx-auto shadow"
            style={{
              width: "100px",
              height: "100px",
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            {selectedDoctor.name.charAt(0)}
          </div>

          <h3 className="mt-3 fw-bold">
            Dr. {selectedDoctor.name}
          </h3>

          <p className="text-muted">
            {selectedDoctor.specializationName}
          </p>

          <span
            className={`badge px-3 py-2 ${
              selectedDoctor.status === "Available"
                ? "bg-success"
                : "bg-danger"
            }`}
          >
            {selectedDoctor.status}
          </span>

        </div>

        {/* DETAILS SECTION */}
        <div className="row g-4">

          <div className="col-md-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="text-muted">
                  Department
                </h6>

                <h5 className="fw-bold">
                  {selectedDoctor.departmentName}
                </h5>

              </div>

            </div>

          </div>

          <div className="col-md-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="text-muted">
                  Phone Number
                </h6>

                <h5 className="fw-bold">
                  {selectedDoctor.phone}
                </h5>

              </div>

            </div>

          </div>

            {/* added new card */}
          <div className="col-md-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="text-muted">
                  Username
                </h6>

                <h5 className="fw-bold">
                  {selectedDoctor.username}
                </h5>

              </div>

            </div>

          </div>

          <div className="col-md-6">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <h6 className="text-muted">
                  Email
                </h6>

                <h5 className="fw-bold">
                  {selectedDoctor.email}
                </h5>

              </div>

            </div>

          </div>

        </div>

      </div>

    )}

  </Modal.Body>

  <Modal.Footer>

    <Button
      variant="secondary"
      onClick={() => setShowViewModal(false)}
    >
      Close
    </Button>

  </Modal.Footer>

</Modal>

</>

  );
}

export default DoctorsTable;