import API from "./ApiClient";

export const getAllPatients = () => API.get("/patient");

export const createPatient = (data) => API.post("/patient", data);

// export const getDoctorById = (id) => API.get(`/patient/${id}`);

export const updatePatient = (id, patient) => API.put(`/patient/${id}`, patient);

export const deletePatient = (id) => API.delete(`/patient/${id}`);




