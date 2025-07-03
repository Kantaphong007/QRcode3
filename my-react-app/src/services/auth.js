
import axios from 'axios';

const API_URL = 'https://truthful-caring-production.up.railway.app/api';

const register = (username, email, password) => {
  return axios.post(`${API_URL}/auth/local/register`, {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(`${API_URL}/auth/local`, {
      identifier: email,
      password,
    })
    .then(response => {
      if (response.data.jwt) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
