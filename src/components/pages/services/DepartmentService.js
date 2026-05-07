import axios from 'axios'

const BASE_REST_API_URL = 'http://localhost:8080/api/department'


export const getAllDepartments = () => axios.get(BASE_REST_API_URL)
export const createDepartment = (department) => axios.post(BASE_REST_API_URL, department);
export const updateDepartment = (id, department) => axios.put(`${BASE_REST_API_URL}/${id}`, department);
export const deleteDepartment = (id) => axios.delete(`${BASE_REST_API_URL}/${id}`);
export const getDepartmentById = (id) => axios.get(`${BASE_REST_API_URL}/${id}`);