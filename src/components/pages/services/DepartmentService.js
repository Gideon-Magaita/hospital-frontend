import API from "./ApiClient";

export const getAllDepartments = () => API.get("/department");

export const createDepartment = (department) => API.post("/department", department);

export const updateDepartment = (id, department) => API.put(`/department/${id}`, department);

export const deleteDepartment = (id) => API.delete(`/department/${id}`);

export const getDepartmentById = (id) => API.get(`/department/${id}`);