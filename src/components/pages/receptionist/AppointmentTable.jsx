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
import { Modal } from "bootstrap";

// DataTables
import "datatables.net";
import "datatables.net-bs5";
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

function AppointmentTable() {

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  // ========================= STATES =========================
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");

  const [loading, setLoading] = useState(false);

  // EDIT
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ========================= FETCH =========================
  const fetchAppointments = () => {
    getAllAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => toast.error("Failed to load appointments"));
  };

  const fetchDoctors = () => {
    getAllDoctors()
      .then((res) => setDoctors(res.data))
      .catch(() => toast.error("Failed to load doctors"));
  };

  const fetchPatients = () => {
    getAllPatients()
      .then((res) => setPatients(res.data))
      .catch(() => toast.error("Failed to load patients"));
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  // ========================= DATATABLE =========================
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
          { extend: "excel", className: "btn btn-success btn-sm" },
          { extend: "pdf", className: "btn btn-danger btn-sm" },
          { extend: "print", className: "btn btn-secondary btn-sm" },
        ],
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [appointments]);

  // ========================= HANDLER =========================
  const handleAppointmentChange = (id) => {

    setAppointmentId(id);

    const selected = appointments.find((a) => a.id == id);

    if (selected) {
      setPatientId(selected.patientId);
      setDoctorId(selected.doctorId);
    }
  };

  // ========================= RESET =========================
  const resetForm = () => {
    setAppointmentDate("");
    setStatus("PENDING");
    setNotes("");
    setDoctorId("");
    setPatientId("");
    setAppointmentId("");

    setIsEdit(false);
    setEditId(null);
  };

  // ========================= SAVE =========================
  const saveAppointment = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const payload = {
      appointmentDate,
      status,
      notes,
      doctorId,
      patientId,
    };

    try {
      if (isEdit) {
        await updateAppointment(editId, payload);

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === editId ? { ...a, ...payload } : a
          )
        );

        toast.success("Updated successfully");

      } else {
        const res = await createAppointment(payload);
        setAppointments((prev) => [...prev, res.data]);

        toast.success("Created successfully");
      }

      resetForm();

      Modal.getInstance(
        document.getElementById("appointmentModal")
      )?.hide();

    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ========================= EDIT =========================
  const handleEdit = (appointment) => {
    setIsEdit(true);
    setEditId(appointment.id);

    setAppointmentDate(appointment.appointmentDate);
    setStatus(appointment.status);
    setNotes(appointment.notes || "");
    setDoctorId(appointment.doctorId);
    setPatientId(appointment.patientId);

    new Modal(document.getElementById("appointmentModal")).show();
  };

  // ========================= DELETE =========================
  const handleDeleteClick = (id) => {
    setSelectedAppointmentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAppointment(selectedAppointmentId);

      setAppointments((prev) =>
        prev.filter((a) => a.id !== selectedAppointmentId)
      );

      toast.success("Deleted successfully");
      setShowDeleteModal(false);

    } catch {
      toast.error("Delete failed");
    }
  };

  // ========================= UI =========================
  return (
    <>
      <div className="container-fluid">

        <div className="card shadow-sm mt-5">

          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center"> 
              <h3 className="mb-0 text-uppercase text-bold"> Appointment List </h3> 
              <button className="btn btn-lg btn-primary" 
              data-bs-toggle="modal" 
              data-bs-target="#appointmentModal" 
              onClick={resetForm} > 
              Book Appointment 
              </button> 
              </div>
          </div>

          <div className="card-body">

            <table ref={tableRef} className="table table-striped">
              <thead className="table-secondary">
                <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Patient</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    
                    <td>{a.doctorName || a.doctorId}</td>
                    <td>{a.patientName || a.patientId}</td>
                     <td>{a.notes}</td>
                     <td>
                      <span className={`badge ${
                        a.status === "PENDING"
                          ? "bg-warning"
                          : a.status === "COMPLETED"
                          ? "bg-success"
                          : "bg-danger"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{a.appointmentDate}</td>


                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleEdit(a)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <div className="modal fade" id="appointmentModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5>{isEdit ? "Edit" : "Book"} Appointment</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">

              <form onSubmit={saveAppointment}>

                <input
                  type="date"
                  className="form-control mb-2"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />

                <select
                  className="form-select form-control mb-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>PENDING</option>
                  <option>COMPLETED</option>
                  <option>CANCELLED</option>
                </select>

                {/* DOCTOR */}
                <select
                  className="form-select form-control mb-2"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option>Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} - {d.specializationName}
                    </option>
                  ))}
                </select>

                {/* PATIENT */}
                <select
                  className="form-select form-control mb-2"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                >
                  <option>Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>

                <textarea
                  className="form-control mb-3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write notes"
                />

                <button className="btn btn-primary w-100">
                  {loading ? "Saving..." : "Save"}
                </button>

              </form>

            </div>

          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Appointment"
        message="Are you sure?"
        loading={deleteLoading}
      />
    </>
  );
}

export default AppointmentTable;