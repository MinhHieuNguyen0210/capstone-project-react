import axiosClient from './axiosClient';

const productApi = {
  getAll(params) {
    const url = '';
    return axiosClient.get(url, { params });
  },
  add(data) {
    const url = 'products';
    return axiosClient.post(url, data);
  },
  uploadImage(data) {
    const url = 'images';
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `products/${id}`;
    return axiosClient.put(url, data);
  },
  getById(id) {
    const url = `products?id=${id}`;
    return axiosClient.get(url);
  },
  getImageById(id) {
    const url = `/images/${id}`;
    return axiosClient.get(url);
  },
  searchProductByName(name, token) {
    const url = `/products/search?name=${name}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default productApi;
