import axios from "axios";

const API = axios.create({
  baseURL: "https://iflab-logbook-backend.onrender.com", // Pastikan baseURL sesuai dengan backend Anda
  withCredentials: true, // Kirim cookie untuk otentikasi
});

export const login = (credentials) => API.post("/login", credentials);
export const logout = () => API.post("/logout"); // Logout tidak perlu body
export const fetchLogbooks = (credentials) => API.get("/logbooks",credentials); // Ambil logbook untuk user login
export const addLogbook = (data) => API.post("/logbooks", data);
export const updateLogbook = (id, data) => API.put(`/logbooks/${id}`, data);
export const deleteLogbook = (id) => API.delete(`/logbooks/${id}`);
