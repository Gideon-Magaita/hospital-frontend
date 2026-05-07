import axios from 'axios'

const BASE_REST_API_URL = 'http://localhost:8080/api/doctor'


export const getAllDoctors = () => axios.get(BASE_REST_API_URL)
export const createDoctor = (data) => axios.post(BASE_REST_API_URL, data);