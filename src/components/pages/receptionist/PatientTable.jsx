import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../services/PatientService";

import ConfirmModal from "../../common/ConfirmModal";

import $ from "jquery";

// Bootstrap Modal
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

function PatientTable() {

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  // =========================
  // STATES
  // =========================
  const [patients, setPatients] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  // EDIT STATES
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // DELETE STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // VALIDATION ERRORS
  const [errors, setErrors] = useState({});
  // =========================
// VALIDATION
// =========================
const validateForm = () => {

  let newErrors = {};

  // FIRST NAME
  if (!firstName.trim()) {
    newErrors.firstName = "First name is required";
  }

  // LAST NAME
  if (!lastName.trim()) {
    newErrors.lastName = "Last name is required";
  }

  // GENDER
  if (!gender) {
    newErrors.gender = "Gender is required";
  }

  // DATE OF BIRTH
  if (!dateOfBirth) {
    newErrors.dateOfBirth = "Date of birth is required";
  }

  // PHONE NUMBER
  if (!phoneNumber.trim()) {

    newErrors.phoneNumber = "Phone number is required";

  } else if (!/^[0-9]{10,15}$/.test(phoneNumber)) {

    newErrors.phoneNumber =
      "Phone number must contain 10 digits";

  }

    // ADDRESS
    if (!address.trim()) {
        newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
    };

  // =========================
  // FETCH PATIENTS
  // =========================
  const fetchPatients = () => {
    getAllPatients()
      .then((response) => setPatients(response.data))
      .catch(() => toast.error("Failed to load patients"));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // =========================
  // DATATABLE
  // =========================
  useEffect(() => {

    if (!patients || patients.length === 0) return;

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
          { extend: "excel", className: "btn btn-success btn-sm",title:"Patient Details" },
          { extend: "pdf", className: "btn btn-danger btn-sm",title:"Patient Details" },
          { extend: "print", className: "btn btn-secondary btn-sm",title:"Patient Details" },
        ],
      });

    }, 100);

    return () => clearTimeout(timer);

  }, [patients]);

  // =========================
  // DELETE MODAL
  // =========================
  const handleDeleteClick = (id) => {
    setSelectedPatientId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {

    try {

      setDeleteLoading(true);

      await deletePatient(selectedPatientId);

      toast.success("Patient deleted successfully");

      setPatients((prev) =>
        prev.filter((patient) => patient.id !== selectedPatientId)
      );

      setShowDeleteModal(false);

    } catch (error) {

      console.log(error);

      toast.error("Failed to delete patient");

    } finally {

      setDeleteLoading(false);

    }
  };

  // =========================
  // EDIT PATIENT
  // =========================
  const handleEdit = (patient) => {

    setIsEdit(true);

    setEditId(patient.id);

    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setGender(patient.gender);
    setDateOfBirth(patient.dateOfBirth);
    setPhoneNumber(patient.phoneNumber);
    setAddress(patient.address);

    const modal = new Modal(
      document.getElementById("patientModal")
    );

    modal.show();
  };

  // =========================
  // SAVE / UPDATE PATIENT
  // =========================
  const savePatient = async (e) => {

  e.preventDefault();

  // VALIDATE FORM
  if (!validateForm()) {
    return;
  }

  if (loading) return;

  setLoading(true);

  const patientData = {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    phoneNumber,
    address,
  };

  try {

    if (isEdit) {

      await updatePatient(editId, patientData);

      toast.success("Patient updated successfully");

      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === editId
            ? { ...patient, ...patientData }
            : patient
        )
      );

    } else {

      const response = await createPatient(patientData);

      setPatients((prev) => [...prev, response.data]);

      toast.success("Patient added successfully");

    }

    // RESET FORM
    resetForm();

    // CLOSE MODAL
    const modal = Modal.getInstance(
      document.getElementById("patientModal")
    );

    modal?.hide();

  } catch (error) {

    console.log(error);

    if (error.response?.status === 400) {
      setErrors(error.response.data);
    }

  } finally {

    setLoading(false);

  }
};

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {

  setFirstName("");
  setLastName("");
  setGender("");
  setDateOfBirth("");
  setPhoneNumber("");
  setAddress("");

  // CLEAR ERRORS
  setErrors({});

  setIsEdit(false);
  setEditId(null);
};

  return (
    <>
      <div className="container-fluid">

        <div className="page-inner">

          <div className="card shadow-sm mt-5">

            {/* CARD HEADER */}
            <div className="card-header">

              <div className="d-flex justify-content-between align-items-center">

                <h3 className="mb-0 text-uppercase text-bold">Patient List</h3>

                <button
                  className="btn btn-lg btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#patientModal"
                  onClick={resetForm}
                >
                  Add Patient
                </button>

              </div>

            </div>

            {/* CARD BODY */}
            <div className="card-body">

              <table
                ref={tableRef}
                className="table table-striped table-hover"
              >

                <thead className="table-secondary">

                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Gender</th>
                    <th>Date Of Birth</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {patients.map((patient, index) => (

                    <tr key={patient.id}>

                      <td>{index + 1}</td>
                      <td>{patient.firstName}</td>
                      <td>{patient.lastName}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.dateOfBirth}</td>
                      <td>{patient.phoneNumber}</td>
                      <td>{patient.address}</td>

                      <td>

                        <div className="d-flex justify-content-between">

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEdit(patient)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClick(patient.id)}
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

      {/* MODAL */}
      <div
        className="modal fade"
        id="patientModal"
      >

        <div className="modal-dialog modal-lg">

          <div className="modal-content">

            <div className="modal-header">

              <h5>
                {isEdit ? "Edit Patient" : "Add Patient"}
              </h5>

              <button
                className="btn-close"
                data-bs-dismiss="modal"
              />

            </div>

            <div className="modal-body">

              <form onSubmit={savePatient}>

                <div className="row">

                  {/* FIRST NAME */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      First Name
                    </label>

                    <input
                        type="text"
                        className={`form-control ${
                            errors.firstName ? "is-invalid" : ""
                        }`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        />

                        <div className="invalid-feedback">
                        {errors.firstName}
                        </div>

                  </div>

                  {/* LAST NAME */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Last Name
                    </label>

                    <input
                    type="text"
                    className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                    }`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    />

                            <div className="invalid-feedback">
                            {errors.lastName}
                            </div>

                  </div>

                  {/* GENDER */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Gender
                    </label>

                    <select
                        className={`form-select  form-control ${
                            errors.gender ? "is-invalid" : ""
                        }`}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        </select>

                        <div className="invalid-feedback">
                        {errors.gender}
                        </div>

                  </div>

                  {/* DATE OF BIRTH */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Date Of Birth
                    </label>

                    <input
                        type="date"
                        className={`form-control ${
                            errors.dateOfBirth ? "is-invalid" : ""
                        }`}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        />

                        <div className="invalid-feedback">
                        {errors.dateOfBirth}
                        </div>

                  </div>

                  {/* PHONE */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                        type="text"
                        className={`form-control ${
                            errors.phoneNumber ? "is-invalid" : ""
                        }`}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        />

                        <div className="invalid-feedback">
                        {errors.phoneNumber}
                        </div>

                  </div>

                  {/* ADDRESS */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Address
                    </label>

                    <input
                        type="text"
                        className={`form-control ${
                            errors.address ? "is-invalid" : ""
                        }`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        />

                        <div className="invalid-feedback">
                        {errors.address}
                        </div>

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="d-flex justify-content-between mt-3">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    disabled={loading}
                  >
                    Close
                  </button>

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

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message="Are you sure you want to delete this patient?"
        loading={deleteLoading}
      />
    </>
  );
}

export default PatientTable;