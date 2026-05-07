import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// APIs
import { getAllDepartments } from "../services/DepartmentService";
import { createDoctor } from "../services/DoctorService";

function AddDoctor() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    phone: "",
    status: "Available",
    departmentId: "",
  });

  // =========================
  // LOAD DEPARTMENTS
  // =========================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getAllDepartments();
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to load departments", error);
      }
    };

    fetchDepartments();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDoctor(doctor);
      toast.success("Doctor added successfully!");
      navigate("/doctors"); // redirect to list page
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast.error("Operation failed");
    }
  };

  return (
    <section className="content">
        <div className="container-fluid">

        <div className="row justify-content-center">

            <div className="col-md-6">

            <div className="card shadow p-4  mt-5">
                <div className="card-header">
                    <h3 className="mb-4">Add New Doctor</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-3">
                    <label>Name</label>
                    <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={doctor.name}
                    onChange={handleChange}
                    required
                    />
                </div>

                {/* Specialization */}
                <div className="mb-3">
                    <label>Specialization</label>
                    <input
                    type="text"
                    name="specialization"
                    className="form-control"
                    value={doctor.specialization}
                    onChange={handleChange}
                    required
                    />
                </div>

                {/* Phone */}
                <div className="mb-3">
                    <label>Phone</label>
                    <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={doctor.phone}
                    onChange={handleChange}
                    required
                    />
                </div>

                {/* Status */}
                <div className="mb-3">
                    <label>Status</label>
                    <select
                    name="status"
                    className="form-control"
                    value={doctor.status}
                    onChange={handleChange}
                    >
                    <option value="Available">AVAILABLE</option>
                    <option value="Unavailable">UNAVAILABLE</option>
                    </select>
                </div>

                {/* Department */}
                <div className="mb-3">
                    <label>Department</label>
                    <select
                    name="departmentId"
                    className="form-control"
                    value={doctor.departmentId}
                    onChange={handleChange}
                    required
                    >
                    <option value="">-- Select Department --</option>

                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                        {dept.name}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                    Save Doctor
                    </button>

                    <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/doctors")}
                    >
                    Cancel
                    </button>
                </div>

              </form>
         </div>
        </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default AddDoctor;