import instance from "@/axiosconfig";

type ExecuteAccount = {
  code: string;
  env_id: number;
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
};

// ExecuteAccount API
export const getExecuteAccountListAPI = function (
  skip: number,
  limit: number,
  text: string
) {
  return instance.get(
    `/execute_accounts?$skip=${skip}&limit=${limit}&text=${text}`
  );
};

export const createExecuteAccountAPI = function (params: ExecuteAccount) {
  return instance.post("/execute_accounts", {
    code: params.code,
    env_id: params.env_id,
    username: params.username,
    password: params.password,
    client_id: params.client_id,
    client_secret: params.client_secret,
  });
};

export const updateExecuteAccountAPI = function (
  id: number,
  params: ExecuteAccount
) {
  return instance.put(`/execute_accounts/${id}`, {
    code: params.code,
    env_id: params.env_id,
    username: params.username,
    password: params.password,
    client_id: params.client_id,
    client_secret: params.client_secret,
  });
};

export const deleteExecuteAccountAPI = function (
    id: number
  ) {
    return instance.delete(`/execute_accounts/${id}`);
  };
