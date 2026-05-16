import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createDoctor,
  getDoctorById,
  updateDoctor,
} from "../services/DoctorService";

import { getAllDepartments } from "../services/DepartmentService";
import { getAllSpecialization } from "../services/SpecializationService";

function AddEditDoctor() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [doctor, setDoctor] = useState({
    name: "",
    phone: "",
    status: "Available",
    departmentId: "",
    doctorSpecializationId: "",
  });

  // =========================
  // INIT LOAD
  // =========================
  useEffect(() => {
    fetchDepartments();
    fetchSpecializations();

    if (isEdit) {
      fetchDoctor();
    }
  }, []);

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartments();
      setDepartments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load departments");
    }
  };

  // =========================
  // FETCH SPECIALIZATIONS
  // =========================
  const fetchSpecializations = async () => {
    try {
      const res = await getAllSpecialization();
      setSpecializations(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load specializations");
    }
  };

  // =========================
  // FETCH DOCTOR
  // =========================
  const fetchDoctor = async () => {
    try {
      const res = await getDoctorById(id);

      setDoctor({
        name: res.data.name,
        phone: res.data.phone,
        status: res.data.status,
        departmentId: res.data.departmentId,
        doctorSpecializationId: res.data.doctorSpecializationId,
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctor");
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setDoctor({
      ...doctor,
      [name]:
        name === "departmentId" || name === "doctorSpecializationId"
          ? Number(value)
          : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      if (isEdit) {
        await updateDoctor(id, doctor);
        toast.success("Doctor updated successfully");
      } else {
        await createDoctor(doctor);
        toast.success("Doctor added successfully");
      }

      navigate("/doctors");

    } catch (error) {

      if (error.response?.status === 400) {
        setErrors(error.response.data);
      }

      toast.error("Operation failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">

        <div className="row justify-content-center">

          <div className="col-md-6">

            <div className="card shadow mt-5">

              <div className="card-header">
                <h3>{isEdit ? "Edit Doctor" : "Add Doctor"}</h3>
              </div>

              <div className="card-body">

                <form onSubmit={handleSubmit}>

                  {/* NAME */}
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={doctor.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  {/* PHONE */}
                  <div className="mb-3">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      value={doctor.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  {/* STATUS */}
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

                  {/* DEPARTMENT */}
                  <div className="mb-3">
                    <label>Department</label>
                    <select
                      name="departmentId"
                      className="form-control"
                      value={doctor.departmentId}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SPECIALIZATION (NEW FIX) */}
                  <div className="mb-3">
                    <label>Specialization</label>

                    <select
                      name="doctorSpecializationId"
                      className="form-control"
                      value={doctor.doctorSpecializationId}
                      onChange={handleChange}
                    >
                      <option value="">
                        -- Select Specialization --
                      </option>

                      {specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.specialization}
                        </option>
                      ))}

                    </select>

                    {errors.doctorSpecializationId && (
                      <div className="invalid-feedback d-block">
                        {errors.doctorSpecializationId}
                      </div>
                    )}
                  </div>

                  {/* BUTTONS */}
                  <div className="d-flex justify-content-between">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : isEdit
                        ? "Update Doctor"
                        : "Save Doctor"}
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

export default AddEditDoctor;