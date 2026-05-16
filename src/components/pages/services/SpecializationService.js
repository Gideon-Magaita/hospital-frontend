import API from "./ApiClient";

export const getAllSpecialization = () => API.get("/specialization");

export const createSpecialization = (specialization) => API.post("/specialization", specialization);

export const updateSpecialization = (id, specialization) => API.put(`/specialization/${id}`, specialization);

export const deleteSpecialization = (id) => API.delete(`/specialization/${id}`);

export const getSpecializationById = (id) => API.get(`/specialization/${id}`);