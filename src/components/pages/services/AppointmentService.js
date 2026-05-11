import API from "./ApiClient";

export const getAllAppointments = () => API.get("/appointment");

export const createAppointment = (appointment) => API.post("/appointment", appointment);

export const updateAppointment = (id, appointment) => API.put(`/appointment/${id}`, appointment);

export const deleteAppointment = (id) => API.delete(`/appointment/${id}`);





