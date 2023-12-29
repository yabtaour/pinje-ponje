import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosServices = axios.create({
  baseURL,
  headers: {
    "Cache-Control": "no-cache",
  },
});

export default axiosServices;
