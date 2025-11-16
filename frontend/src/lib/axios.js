import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // send cookies with requests to the backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
