import axios from "axios";

const axiosServices = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

axiosServices.interceptors.request.use(
  (config) => {
    // spinning start to show
    // UPDATE: Add this code to show global loading indicator
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => {
    // spinning hide
    // UPDATE: Add this code to hide global loading indicator
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosServices;
