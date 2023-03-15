import instance from "../axiosconfig";

type EnvDomain = {
  code: string
  domain: string
}

// EnvDomain API
export const getEnvDomainListAPI = function (
  skip: number,
  limit: number,
  text: string
) {
  return instance.get(`/env_domains?$skip=${skip}&limit=${limit}&text=${text}`);
};

export const updateEnvDomainAPI = function (
  id: number,
  params: EnvDomain
) {
  return instance.put(`/env_domains/${id}`, {
    code: params.code,
    domain: params.domain,
  });
};

export const createEnvDomainAPI = function (params: EnvDomain) {
  return instance.post(`/env_domains`, {
    code: params.code,
    domain: params.domain,
  });
};

export const deleteEnvDomainAPI = function (id: number) {
  return instance.delete(`/env_domains/${id}`);
};
