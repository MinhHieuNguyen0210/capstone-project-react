import axiosClient from './axiosClient';

const orderApi = {
  getAllOrder(token) {
    const url =
      '/content-manager/collection-types/application::orders.orders?page=1&pageSize=10&_sort=id:ASC';
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getOrderPending(token) {
    const url = 'orders/admin?status=PENDING';
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  update(token, id, body) {
    const url = `content-manager/collection-types/application::orders.orders/${id}`;
    return axiosClient.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getOrderById(id, token) {
    const url = `https://foody-store-server.herokuapp.com/content-manager/collection-types/application::orders.orders/${id}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  searchOrderByEmail(email, token) {
    const url = `orders/search?email=${email}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default orderApi;
