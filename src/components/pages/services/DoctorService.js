import API from "./ApiClient";

export const getAllDoctors = () => API.get("/doctor");

export const createDoctor = (data) => API.post("/doctor", data);

export const getDoctorById = (id) => API.get(`/doctor/${id}`);

export const updateDoctor = (id, doctor) => API.put(`/doctor/${id}`, doctor);

export const deleteDoctor = (id) => API.delete(`/doctor/${id}`);