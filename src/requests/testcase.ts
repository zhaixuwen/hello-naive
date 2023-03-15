import instance from "@/axiosconfig";

type Testcase = {
  title: string;
  description: string;
  env_id: number;
  execute_account_id: number;
  interface_id: number;
  header: object;
  params: object;
  body: object;
  post_assert_code: number;
  post_assert_json: object;
};

// Testcase API
export const getTestcaseListAPI = function (
  skip: number,
  limit: number,
  text: string
) {
  return instance.get(`/testcases?$skip=${skip}&limit=${limit}&text=${text}`);
};

export const getTestcaseListByInterfaceAPI = function (
  interface_id: number,
) {
  return instance.get(`/testcases/interface/${interface_id}`);
};

export const getTestcaseDetailAPI = function (id: number) {
  return instance.get(`/testcases/${id}`);
};

export const createTestcaseAPI = function (testcase: Testcase) {
  return instance.post("/testcases", testcase);
};

export const updateTestcaseAPI = function (id: number, testcase: Testcase) {
  return instance.put(`/testcases/${id}`, testcase);
};

export const requestTestcaseAPI = function (id: number) {
  return instance.post("/testcases/request", { testcase_id: id });
};

export const deleteTestcaseAPI = function (id: number) {
  return instance.delete(`/testcases/${id}`);
};

export const getTestcaseLogAPI = function (id: number) {
  return instance.get(`/testcases/logs/${id}`);
};
