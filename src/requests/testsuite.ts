import instance from "../axiosconfig";

type Testsuite = {
    name: string
    description: string
    is_active: boolean
    members: number[]
    testcases: number[]
}

type runObj = {
    testsuite_id: number
}

// Testsuite API
export const getTestsuiteListAPI = function () {
    return instance.get('/testsuites');
};

export const getTestsuiteAPI = function (id: number) {
    return instance.get(`/testsuites/${id}`);
};

export const createTestsuiteAPI = function (sutie: Testsuite) {
    return instance.post('/testsuites', sutie);
};

export const updateTestsuiteAPI = function (id: number, sutie: Testsuite) {
    return instance.put(`/testsuites/${id}`, sutie);
};

export const deleteTestsuiteAPI = function (id: number) {
    return instance.delete(`/testsuites/${id}`);
};

export const runTestsuiteAPI = function (runObj: runObj) {
    return instance.post('/testsuites/run', runObj);
}

export const getTestsuiteLogsAPI = function (suiteId: number) {
    return instance.get(`/testsuites/logs/${suiteId}`);
}
