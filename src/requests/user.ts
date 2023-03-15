import instance from "../axiosconfig";


// Job API
export const getUserListAPI = function () {
  return instance.get("/users");
};
