import API from "./ApiClient";

export const getAllBillings = () => API.get("/billing");

export const createBilling = (billing) => API.post("/billing",billing);







