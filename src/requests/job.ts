import instance from "../axiosconfig";

type Job = {
  id: string
  testsuite_id: number
  job_name: string
  crontab: string
}

// Job API
export const getJobListAPI = function () {
  return instance.get("/jobs");
};

export const createJobAPI = function (params: Job) {
  return instance.post("/jobs", {
    testsuite_id: params.testsuite_id,
    job_name: params.job_name,
    crontab: params.crontab,
  });
};

export const updateJobAPI = function (params: Job) {
  return instance.put("/jobs", {
    id: params.id,
    job_name: params.job_name,
    crontab: params.crontab,
  });
};

export const deleteJobAPI = function (id: string) {
  return instance.delete(`/jobs/${id}`);
};
