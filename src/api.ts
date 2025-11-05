import axios, { AxiosError, AxiosInstance,  InternalAxiosRequestConfig } from "axios";

export const axiosInstance:AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
// export const axiosAuthInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
// });
// axiosAuthInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       window.location.href = "/auth";
//     }
//     return Promise.reject(error);
//   }
// );
axiosInstance.interceptors.request.use(
  (config:InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error:AxiosError) => Promise.reject(error)
);

// export const fetchAllOrders=async()=>{
//   const {data}=await axiosInstance.get("/cart/orders")
//     return data
// }
