import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createDoctor,
  getDoctorById,
  updateDoctor,
} from "../services/DoctorService";

import { getAllDepartments } from "../services/DepartmentService";

function AddEditDoctor() {

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

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
    fetchDepartments();

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
    }
  };

  // =========================
  // FETCH DOCTOR BY ID
  // =========================
  const fetchDoctor = async () => {
    try {
      const res = await getDoctorById(id);

      setDoctor({
        name: res.data.name,
        specialization: res.data.specialization,
        phone: res.data.phone,
        status: res.data.status,
        departmentId: res.data.departmentId,
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
      [name]: name === "departmentId"
        ? Number(value)
        : value,
    });

    // clear field error while typing
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
                <h3>
                  {isEdit ? "Edit Doctor" : "Add Doctor"}
                </h3>
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
                      placeholder="Enter doctor name"
                    />

                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name}
                      </div>
                    )}

                  </div>

                  {/* SPECIALIZATION */}
                  <div className="mb-3">

                    <label>Specialization</label>

                    <input
                      type="text"
                      name="specialization"
                      className={`form-control ${errors.specialization ? "is-invalid" : ""}`}
                      value={doctor.specialization}
                      onChange={handleChange}
                      placeholder="Enter specialization"
                    />

                    {errors.specialization && (
                      <div className="invalid-feedback">
                        {errors.specialization}
                      </div>
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
                      placeholder="Enter phone number"
                    />

                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone}
                      </div>
                    )}

                  </div>

                  {/* STATUS */}
                  <div className="mb-3">

                    <label>Status</label>

                    <select
                      name="status"
                      className={`form-control ${errors.status ? "is-invalid" : ""}`}
                      value={doctor.status}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="Available">AVAILABLE</option>
                      <option value="Unavailable">UNAVAILABLE</option>
                    </select>

                    {errors.status && (
                      <div className="invalid-feedback d-block">
                        {errors.status}
                      </div>
                    )}

                  </div>

                  {/* DEPARTMENT */}
                  <div className="mb-3">

                    <label>Department</label>

                    <select
                      name="departmentId"
                      className={`form-control ${errors.departmentId ? "is-invalid" : ""}`}
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

                    {errors.departmentId && (
                      <div className="invalid-feedback">
                        {errors.departmentId}
                      </div>
                    )}

                  </div>

                  {/* BUTTONS */}
                  <div className="d-flex justify-content-between">

                <button  type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                        ></span>

                        {isEdit ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      isEdit ? "Update Doctor" : "Save Doctor"
                    )}
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