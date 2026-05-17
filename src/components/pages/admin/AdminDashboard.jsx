import React, { useEffect, useState } from "react";
import InfoCard from "./InfoCard";

import { getAllDepartments } from "../services/DepartmentService";
import { getAllDoctors } from "../services/DoctorService";
import { getAllSpecialization } from "../services/SpecializationService";

export default function AdminDashboard() {

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {

    fetchDepartments();
    fetchDoctors();
    fetchSpecializations();

  }, []);

  const fetchDepartments = async () => {

    try {

      const response = await getAllDepartments();
      setDepartments(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchDoctors = async () => {

    try {

      const response = await getAllDoctors();
      setDoctors(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchSpecializations = async () => {

    try {

      const response =
        await getAllSpecialization();

      setSpecializations(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  // ================= COUNTS =================

  const totalDepartments = departments.length;

  const totalDoctors = doctors.length;

  const totalSpecializations = specializations.length;

  // ================= UI =================

  return (
    <section className="content">

      <div className="container-fluid">

        <div className="row">

          {/* DEPARTMENTS */}
          <InfoCard
            icon="fas fa-building"
            bg="bg-info"
            title="Departments"
            value={totalDepartments}
          />

          {/* SPECIALIZATIONS */}
          <InfoCard
            icon="fas fa-stethoscope"
            bg="bg-danger"
            title="Specializations"
            value={totalSpecializations}
          />

          {/* DOCTORS */}
          <InfoCard
            icon="fas fa-user-md"
            bg="bg-success"
            title="Doctors"
            value={totalDoctors}
          />

        </div>

      </div>

    </section>
  );
}