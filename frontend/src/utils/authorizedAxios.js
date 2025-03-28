import { handleLogoutAPI, refreshTokenAPI } from "@/apis/auth";
import axios from "axios";
import { setLoading } from "@/redux/loadingSlice";
import store from "@/redux/store";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request là 10p
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000;
authorizedAxiosInstance.defaults.withCredentials = true;

// Add request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    store.dispatch(setLoading(true)); // Show loading when request starts
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(setLoading(false)); // Hide loading on request error
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false)); // Hide loading on successful response
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(setLoading(false)); // Clear loading on unauthorized
      handleLogoutAPI().then(() => {
        // Redirect to login page
        store.dispatch(setAuthUser(null));
        store.dispatch(setSelectedPost(null));
        store.dispatch(setPosts([]));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        console.log(
          "logout at line 50 authorizedAxiosInstance.interceptors.response.use"
        );

        // location.href = "/login";
      });
    }
    const originalRequest = error.config;

    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        store.dispatch(setLoading(false)); // Clear loading before refresh token attempt
        refreshTokenPromise = refreshTokenAPI()
          .then((res) => {
            // Refresh token successful - loading will be handled by the next request
            localStorage.setItem("access_token", res.data.data);
            authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${res.data.data}`;
          })
          .catch((_error) => {
            store.dispatch(setLoading(false)); // Ensure loading is cleared on refresh token error
            handleLogoutAPI().then(() => {
              // Redirect to login page
              store.dispatch(setAuthUser(null));
              store.dispatch(setSelectedPost(null));
              store.dispatch(setPosts([]));
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              console.log(
                "logout at line 61 authorizedAxiosInstance.interceptors.response.use"
              );
              // location.href = "/login";
            });
            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        // Quan trọng: return lại axios instance để thực hiện lại request ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequest);
      });
    }

    // Handle all other error cases
    store.dispatch(setLoading(false)); // Hide loading on other errors
    if (error.response?.status !== 410) {
      console.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
