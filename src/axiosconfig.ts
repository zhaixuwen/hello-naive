import axios from "axios";


const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["access_token"] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response dataert(123)
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status == 401) {
    localStorage.removeItem('access_token');
  } else {
    console.log(error.response);
  }
  return Promise.reject(error);
});

export default instance;
