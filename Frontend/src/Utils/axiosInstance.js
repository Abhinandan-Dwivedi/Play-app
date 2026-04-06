import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1",

    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        try {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("accessToken");
                if (token && config && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (e) {
            console.error("Error attaching token to request:", e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;

        if (!originalRequest) return Promise.reject(error);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post("/api/v1/user/refresh-token", {}, { withCredentials: true });

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token expired. Redirecting to login.");
                localStorage.removeItem("user");
                if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;