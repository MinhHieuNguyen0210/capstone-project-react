import axiosClient from './axiosClient';

const statisticsApi = {
  getStatistics(from, to, token) {
    const url = `https://foody-store-server.herokuapp.com/orders/admin/statistics?from=${from}&to=${to}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getDataPieChart(token) {
    const url = `https://foody-store-server.herokuapp.com/orders/admin/statistics/payment`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
export default statisticsApi;
