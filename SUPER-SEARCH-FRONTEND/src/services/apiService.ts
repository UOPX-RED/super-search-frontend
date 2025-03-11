import axios from "axios";


const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {

      config.headers["X-Azure-Token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userExp");
      localStorage.removeItem("userToken");
      

      localStorage.setItem("lastRoute", window.location.pathname);
      

      const baseUrl = window.location.hostname === "localhost" 
        ? "http://localhost:8000" 
        : window.location.origin;
      window.location.href = `${baseUrl}/auth/init`;
    }
    return Promise.reject(error);
  }
);


export const getUserInfo = () => {
  return {
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    isAuthenticated: !!localStorage.getItem("userToken"),
  };
};

export default apiService;