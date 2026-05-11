import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

import {
  getAllBillings,
  createBilling,
} from "../services/BillingService";

import { getAllAppointments } from "../services/AppointmentService";

// DataTables
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

window.JSZip = jszip;
pdfMake.vfs = pdfFonts.vfs;

function BillingTable() {
  // ========================= STATE =========================
  const [billings, setBillings] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("PENDING");

  const [loading, setLoading] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);

  const tableRef = useRef(null);
  const printRef = useRef(null);

  // ========================= FETCH =========================
  const fetchBillings = async () => {
    try {
      const res = await getAllBillings();
      setBillings(res.data);
    } catch {
      toast.error("Failed to load billings");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointments();
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchBillings();
    fetchAppointments();
  }, []);

  // ========================= DATATABLE =========================
  useEffect(() => {
    if (!billings.length) return;

    const timer = setTimeout(() => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      $(tableRef.current).DataTable({
        pageLength: 5,
        responsive: true,
        dom:
            "<'row mb-2 align-items-center'" +
              "<'col-md-6'l>" +
              "<'col-md-6 d-flex justify-content-end'B>" +
            ">" +
            "<'row'<'col-12'tr>>" +
            "<'row mt-2'<'col-md-5'i><'col-md-7'p>>",
        buttons: [
                {
                  extend: "excel",
                  className: "btn btn-success btn-sm",
                },
                {
                  extend: "pdf",
                  className: "btn btn-danger btn-sm",
                },
                {
                  extend: "print",
                  className: "btn btn-secondary btn-sm",
                },
              ],
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [billings]);

  // ========================= CREATE BILL =========================
  const saveBilling = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        appointmentId,
        patientId,
        totalAmount,
        status,
      };

      const res = await createBilling(data);

      setBillings((prev) => [...prev, res.data]);

      toast.success("Invoice generated");

      Modal.getInstance(
        document.getElementById("billingModal")
      )?.hide();

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  // ========================= AUTO PATIENT =========================
  const handleAppointmentChange = (id) => {
    setAppointmentId(id);

    const appt = appointments.find((a) => a.id == id);

    if (appt) setPatientId(appt.patientId);
  };

  const resetForm = () => {
    setAppointmentId("");
    setPatientId("");
    setTotalAmount("");
    setStatus("PENDING");
  };

  // ========================= PRINT INVOICE =========================
  const handlePrint = () => {
    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .box { border:1px solid #ddd; padding:20px; max-width:500px; margin:auto;}
            h2 { text-align:center; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
    win.close();
  };

  // ========================= BADGE =========================
  const getBadge = (status) => {
    if (status === "PAID") return "bg-success";
    if (status === "PENDING") return "bg-warning";
    return "bg-danger";
  };

  // ========================= UI =========================
  return (
    <>
      <div className="container-fluid">
        <div className="page-inner">
           <div className="row">
             <div className="col-md-12">

              <div className="card shadow-sm mt-5">

          {/* HEADER */}
          <div className="card-header">

            <div className="d-flex justify-content-between align-items-center">

              <h4 className="mb-0 text-uppercase text-bold">Billing / Invoices</h4>

              {/* RIGHT SIDE ACTIONS */}
              <div className="d-flex align-items-center gap-2">

                {/* DataTables buttons will appear here */}
                <div id="dt-buttons"></div>

                {/* YOUR BUTTON */}
                <button
                  className="btn btn-lg btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#billingModal"
                >
                  Generate Invoice
                </button>

              </div>

            </div>

          </div>

          {/* TABLE */}
          <div className="card-body">

            <table
              ref={tableRef}
              className="table table-striped table-hover"
            >
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Invoice No</th>
                  <th>Patient</th>
                  <th>Appointment Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {billings.map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.invoiceNumber}</td>
                    <td>{b.patientName}</td>
                    <td>{b.appointmentDate}</td>
                    <td>Tsh {b.totalAmount}</td>

                    <td>
                      <span className={`badge ${getBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#viewInvoiceModal"
                        onClick={() => setSelectedBilling(b)}
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      </div>

      {/* ================= BILLING MODAL ================= */}
      <div className="modal fade" id="billingModal">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Create Invoice</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">

              <form onSubmit={saveBilling}>

                <select
                  className="form-select mb-2 form-control"
                  value={appointmentId}
                  onChange={(e) =>
                    handleAppointmentChange(e.target.value)
                  }
                >
                  <option>Select Appointment</option>
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.patientName} - {a.appointmentDate}
                    </option>
                  ))}
                </select>

                <input
                  className="form-control mb-2"
                  type="number"
                  placeholder="Amount"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                />

                <select
                  className="form-select mb-3 form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>PENDING</option>
                  <option>PAID</option>
                  <option>CANCELLED</option>
                </select>

                <button className="btn btn-primary w-100">
                  {loading ? "Saving..." : "Generate Invoice"}
                </button>

              </form>

            </div>

          </div>
        </div>
      </div>

      {/* ================= VIEW INVOICE MODAL ================= */}
      <div className="modal fade" id="viewInvoiceModal">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Invoice</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">

              <div ref={printRef} className="p-3 border">

                <h3 className="text-center">HOSPITAL INVOICE</h3>

                <p><b>Invoice:</b> {selectedBilling?.invoiceNumber}</p>
                <p><b>Patient:</b> {selectedBilling?.patientName}</p>
                <p><b>Date:</b> {selectedBilling?.appointmentDate}</p>
                <p><b>Amount:</b> Tsh {selectedBilling?.totalAmount}</p>
                <p><b>Status:</b> {selectedBilling?.status}</p>

              </div>

            </div>

            <div className="modal-footer">

              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>

              <button className="btn btn-primary" onClick={handlePrint}>
                Print Invoice
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
    </>
  );
}

export default BillingTable;