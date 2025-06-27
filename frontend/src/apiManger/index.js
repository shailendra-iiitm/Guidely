import axios from "axios";
import toast from "react-hot-toast";

import { USER_STORE_PERSIST } from "../const";
import { BASE_URL } from "../const/env.const";
import { getToken, removeToken } from "../helper";

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor
AxiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.data?.success === "false") {
      const message = response.data.message;
      toast.error(message || "Something went wrong");

      if (response.status === 401) {
        removeToken();
        sessionStorage.removeItem(USER_STORE_PERSIST);
        window.location.href = "/signin";
      }
    } else {
      toast.error("Something went wrong");
    }

    throw error;
  }
);

export default AxiosInstance;
