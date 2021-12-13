import axiosClient from './axiosClient';

const categoriesApi = {
  getAll(params) {
    const url = '';
    return axiosClient.get(url, { params });
  },
  add(data) {
    const url = 'categories';
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `categories/${id}`;
    return axiosClient.put(url, data);
  },
  getById(id) {
    const url = `categories?id=${id}`;
    return axiosClient.get(url);
  },
  uploadImage(data) {
    const url = 'images';
    return axiosClient.post(url, data);
  },
  getImageById(id) {
    const url = `/images/${id}`;
    return axiosClient.get(url);
  },
  searchByName(name, token) {
    const url = `/categories/search?name=${name}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default categoriesApi;
