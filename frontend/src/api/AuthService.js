import axios from 'axios';

// Base URL for the API
const API_URL = 'http://127.0.0.1:5000';

const authService = {
    // Register a new user
    async signup(username, password) {
        // Send a POST request to the register endpoint
        const response = await axios.post(`${API_URL}/signup`, {
            username,
            password,
    });
    // If the response contains an access token, store it in local storage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(username, password) {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;



