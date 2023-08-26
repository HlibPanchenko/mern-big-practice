import axios from "axios";

export const API_URL = "http://localhost:4444";

const $api = axios.create({
  withCredentials: true, // куки присоединять к запросам
  baseURL: API_URL,
});

// interceptor (перехватчик) на запрос
// перед каждым запросом на сервер будем вшивать в него headers: Authorization: Bearer Token
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});
// interceptor для ответов со статусом 401 с сервера 
// 2 аргумент это колбек который срабатывает в случае ошибки
$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log("НЕ АВТОРИЗОВАН");
      }
    }
    throw error;
  }
);

export default $api;
