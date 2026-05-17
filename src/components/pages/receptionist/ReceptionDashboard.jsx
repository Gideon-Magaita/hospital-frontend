import React, { useEffect, useState } from "react";
import InfoCard from "./InfoCard";

import { getAllPatients } from "../services/PatientService";
import { getAllAppointments } from "../services/AppointmentService";
import { getAllBillings } from "../services/BillingService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReceptionDashboard() {

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [billings, setBillings] = useState([]);

  useEffect(() => {
    getAllPatients().then(res => setPatients(res.data));
    getAllAppointments().then(res => setAppointments(res.data));
    getAllBillings().then(res => setBillings(res.data));
  }, []);

  // ================= DATE =================
  const today = new Date().toISOString().split("T")[0];

  // ================= KPIs =================
  const totalPatients = patients.length;
  const todayAppointments = appointments.filter(
    (a) => a.appointmentDate?.slice(0, 10) === today
  ).length;

  const pendingBills = billings.filter(b => b.status === "PENDING").length;
  const paidBills = billings.filter(b => b.status === "PAID").length;
  const cancelledBills = billings.filter(b => b.status === "CANCELLED").length;

  const cancelledBookings = appointments.filter(
    (a) => a.status === "CANCELLED"
  ).length;

  const revenue = billings
    .filter(b => b.status === "PAID")
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  // ================= APPOINTMENT TREND (BAR CHART) =================
  const appointmentCounts = {};

  appointments.forEach(a => {
    const date = a.appointmentDate?.slice(0, 10);
    appointmentCounts[date] = (appointmentCounts[date] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(appointmentCounts),
    datasets: [
      {
        label: "Appointments",
        data: Object.values(appointmentCounts),
        backgroundColor: "#4e73df",
      },
    ],
  };

  // ================= BILLING STATUS (PIE) =================
  const pieData = {
    labels: ["Paid", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          paidBills,
          pendingBills,
          billings.filter(b => b.status === "CANCELLED").length,
        ],
        backgroundColor: ["#1cc88a", "#f6c23e", "#e74a3b"],
      },
    ],
  };

  // ================= DOCTOR WORKLOAD =================
  const doctorMap = {};

  appointments.forEach(a => {
    const doctor = a.doctorName || "Unknown";
    doctorMap[doctor] = (doctorMap[doctor] || 0) + 1;
  });

  const topDoctors = Object.entries(doctorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="content">
      <div className="container-fluid">

        {/* ================= CARDS ================= */}
        <div className="row">

          <InfoCard icon="fas fa-user-injured" bg="bg-info"
            title="Total Patients" value={totalPatients} />

          <InfoCard icon="fas fa-calendar-day" bg="bg-primary"
            title="Today Appointments" value={todayAppointments} />

          <InfoCard icon="fas fa-file-invoice" bg="bg-warning"
            title="Pending Bills" value={pendingBills} />

          <InfoCard icon="fas fa-check-circle" bg="bg-success"
            title="Paid Bills" value={paidBills} />

          <InfoCard icon="fas fa-times-circle" bg="bg-danger"
            title="Cancelled Bills" value={cancelledBills} />

          <InfoCard icon="fas fa-times-circle" bg="bg-danger"
            title="Cancelled Bookings" value={cancelledBookings} />

          <InfoCard icon="fas fa-money-bill-wave" bg="bg-dark"
            title="Revenue" value={`Tsh ${revenue}`} />

        </div>

        {/* ================= CHARTS ================= */}
        <div className="row mt-4">

          <div className="col-md-8">
            <div className="card p-3">
              <h5>Appointments Trend</h5>
              <Bar data={barData} />
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <h5>Billing Status</h5>
              <Pie data={pieData} />
            </div>
          </div>

        </div>

        {/* ================= DOCTOR WORKLOAD ================= */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card p-3">
              <h5>Doctor Workload Ranking</h5>

              <ul className="list-group">
                {topDoctors.map(([name, count], i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    <span>{name}</span>
                    <span className="badge bg-primary">{count} appointments</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}