import axios from 'axios'

const BASE_REST_API_URL = 'http://localhost:8080/api/doctor'


export const getAllDoctors = () => 
    axios.get(BASE_REST_API_URL);

export const createDoctor = (data) => axios.post(BASE_REST_API_URL, data);

export const getDoctorById = (id) =>
  axios.get(`${BASE_REST_API_URL}/${id}`);

export const updateDoctor = (id, doctor) =>
  axios.put(`${BASE_REST_API_URL}/${id}`, doctor);

export const deleteDoctor = (id) =>
  axios.delete(`${BASE_REST_API_URL}/${id}`);