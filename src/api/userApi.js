import axiosClient from './axiosClient';

const userApi = {
  postUser(params) {
    const url = 'admin/login';
    return axiosClient.post(url, params);
  },
  getAllUser(token) {
    const url = '/users';
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  editUser(id, data, token) {
    const url = `content-manager/collection-types/plugins::users-permissions.user/${id}`;
    return axiosClient.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default userApi;
