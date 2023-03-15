import instance from "../axiosconfig";

type Interface = {
  name: string
  description: string
  method: string
  path: string
};

// Interface API
export const getInterfaceListAPI = function (
  skip: number,
  limit: number,
  text: string
) {
  return instance.get(`/interfaces?$skip=${skip}&limit=${limit}&text=${text}`);
};

export const updateInterfaceAPI = function (id: number, params: Interface) {
  return instance.put(`/interfaces/${id}`, {
    name: params.name,
    description: params.description,
    method: params.method,
    path: params.path,
  });
};

export const createInterfaceAPI = function (params: Interface) {
  return instance.post("/interfaces", {
    name: params.name,
    description: params.description,
    method: params.method,
    path: params.path,
  });
};

export const deleteInterfaceAPI = function (id: number) {
  return instance.delete(`/interfaces/${id}`);
};
