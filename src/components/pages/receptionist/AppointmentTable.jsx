import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/AppointmentService";

import { getAllDoctors } from "../services/DoctorService";
import { getAllPatients } from "../services/PatientService";

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

function AppointmentTable() {

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  // =========================
  // STATES
  // =========================
  const [appointments, setAppointments] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // EDIT STATES
  // =========================
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // =========================
  // DELETE STATES
  // =========================
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =========================
  // FETCH DATA
  // =========================
  const fetchAppointments = () => {

    getAllAppointments()
      .then((response) => setAppointments(response.data))
      .catch(() => toast.error("Failed to load appointments"));
  };

  const fetchDoctors = () => {

    getAllDoctors()
      .then((response) => setDoctors(response.data))
      .catch(() => toast.error("Failed to load doctors"));
  };

  const fetchPatients = () => {

    getAllPatients()
      .then((response) => setPatients(response.data))
      .catch(() => toast.error("Failed to load patients"));
  };

  useEffect(() => {

    fetchAppointments();
    fetchDoctors();
    fetchPatients();

  }, []);

  // =========================
  // DATATABLE
  // =========================
  useEffect(() => {

    if (!appointments || appointments.length === 0) return;

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
          {
            extend: "excel",
            className: "btn btn-success btn-sm",
            title: "Appointment Details",
          },
          {
            extend: "pdf",
            className: "btn btn-danger btn-sm",
            title: "Appointment Details",
          },
          {
            extend: "print",
            className: "btn btn-secondary btn-sm",
            title: "Appointment Details",
          },
        ],
      });

    }, 100);

    return () => clearTimeout(timer);

  }, [appointments]);

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {

    setAppointmentDate("");
    setStatus("PENDING");
    setNotes("");
    setDoctorId("");
    setPatientId("");

    setIsEdit(false);
    setEditId(null);
  };

  // =========================
  // SAVE / UPDATE
  // =========================
  const saveAppointment = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const appointmentData = {
      appointmentDate,
      status,
      notes,
      doctorId,
      patientId,
    };

    try {

      if (isEdit) {

        await updateAppointment(editId, appointmentData);

        toast.success("Appointment updated successfully");

        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === editId
              ? { ...appointment, ...appointmentData }
              : appointment
          )
        );

      } else {

        const response = await createAppointment(appointmentData);

        setAppointments((prev) => [...prev, response.data]);

        toast.success("Appointment created successfully");
      }

      resetForm();

      const modal = Modal.getInstance(
        document.getElementById("appointmentModal")
      );

      modal?.hide();

    } catch (error) {

      console.log(error);

      toast.error("Operation failed");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (appointment) => {

    setIsEdit(true);

    setEditId(appointment.id);

    setAppointmentDate(appointment.appointmentDate);
    setStatus(appointment.status);
    setNotes(appointment.notes || "");
    setDoctorId(appointment.doctorId);
    setPatientId(appointment.patientId);

    const modal = new Modal(
      document.getElementById("appointmentModal")
    );

    modal.show();
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteClick = (id) => {

    setSelectedAppointmentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {

    try {

      setDeleteLoading(true);

      await deleteAppointment(selectedAppointmentId);

      setAppointments((prev) =>
        prev.filter(
          (appointment) => appointment.id !== selectedAppointmentId
        )
      );

      toast.success("Appointment deleted successfully");

      setShowDeleteModal(false);

    } catch (error) {

      console.log(error);

      toast.error("Failed to delete appointment");

    } finally {

      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid">

        <div className="page-inner">

          <div className="card shadow-sm mt-5">

            {/* CARD HEADER */}
            <div className="card-header">

              <div className="d-flex justify-content-between align-items-center">

                <h3 className="mb-0 text-uppercase text-bold">
                  Appointment List
                </h3>

                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#appointmentModal"
                  onClick={resetForm}
                >
                  Book Appointment
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
                    <th>Appointment Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {appointments.map((appointment, index) => (

                    <tr key={appointment.id}>

                      <td>{index + 1}</td>

                      <td>
                        {appointment.appointmentDate}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            appointment.status === "PENDING"
                              ? "bg-warning"
                              : appointment.status === "COMPLETED"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td>{appointment.notes}</td>

                      <td>
                        {appointment.doctorName || appointment.doctorId}
                      </td>

                      <td>
                        {appointment.patientName || appointment.patientId}
                      </td>

                      <td>

                        <div className="d-flex justify-content-between">

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEdit(appointment)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDeleteClick(appointment.id)
                            }
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

      {/* =========================
          MODAL
      ========================= */}
      <div
        className="modal fade"
        id="appointmentModal"
      >

        <div className="modal-dialog modal-lg">

          <div className="modal-content">

            <div className="modal-header">

              <h5>
                {isEdit
                  ? "Edit Appointment"
                  : "Book Appointment"}
              </h5>

              <button
                className="btn-close"
                data-bs-dismiss="modal"
              />

            </div>

            <div className="modal-body">

              <form onSubmit={saveAppointment}>

                <div className="row">

                  {/* APPOINTMENT DATE */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={appointmentDate}
                      onChange={(e) =>
                        setAppointmentDate(e.target.value)
                      }
                      required
                    />

                  </div>

                  {/* STATUS */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Status
                    </label>

                    <select
                      className="form-select form-control"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                      required
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>

                  </div>

                  {/* DOCTOR */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Doctor
                    </label>

                    <select
                      className="form-select form-control"
                      value={doctorId}
                      onChange={(e) =>
                        setDoctorId(e.target.value)
                      }
                      required
                    >

                      <option value="">
                        Select Doctor
                      </option>

                      {doctors.map((doctor) => (

                        <option
                          key={doctor.id}
                          value={doctor.id}
                        >
                          {doctor.name}
                        </option>

                      ))}

                    </select>

                  </div>

                  {/* PATIENT */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Patient
                    </label>

                    <select
                      className="form-select form-control"
                      value={patientId}
                      onChange={(e) =>
                        setPatientId(e.target.value)
                      }
                      required
                    >

                      <option value="">
                        Select Patient
                      </option>

                      {patients.map((patient) => (

                        <option
                          key={patient.id}
                          value={patient.id}
                        >
                          {patient.firstName} {patient.lastName}
                        </option>

                      ))}

                    </select>

                  </div>

                  {/* NOTES */}
                  <div className="col-md-12 mb-3">

                    <label className="form-label">
                      Notes
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      value={notes}
                      onChange={(e) =>
                        setNotes(e.target.value)
                      }
                      placeholder="Write notes"
                    />

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
                    {loading
                      ? "Saving..."
                      : "Save Appointment"}
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
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment?"
        loading={deleteLoading}
      />
    </>
  );
}

export default AppointmentTable;