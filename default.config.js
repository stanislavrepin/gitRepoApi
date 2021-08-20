import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 3000,
  // headers: {
  // },
});

module.exports = axiosInstance;
