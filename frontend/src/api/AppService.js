import axios from 'axios';

// Base URL for the API
const API_URL = 'http://127.0.0.1:5000';

const todoService = {
  // Fetch all todo lists
  async getLists() {
    const response = await axios.get(`${API_URL}/lists`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Fetch a single todo list by ID
  async getList(listId) {
    const response = await axios.get(`${API_URL}/list/${listId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Create a new todo list
  async createList(title, description = '') {
    const response = await axios.post(
      `${API_URL}/list/create`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Delete a todo list by ID
  async deleteList(listId) {
    await axios.delete(`${API_URL}/delete_list/${listId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Fetch all items in a todo list
  async getListItems(listId) {
    const response = await axios.get(`${API_URL}/list/${listId}/items`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Create a new item in a todo list
  async createItem(listId, title, description = '') {
    const response = await axios.post(
      `${API_URL}/create_items`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Update an item in a todo list
  async updateItem(itemId, title, description) {
    const response = await axios.put(
      `${API_URL}/items/${itemId}/update`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  // Delete an item from a todo list
  async deleteItem(itemId) {
    await axios.delete(`${API_URL}/items/${itemId}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },


  // Toggle the completion status of an item
  async toggleItemCompletion(itemId, completed) {
    const response = await axios.patch(
      `${API_URL}/items/${itemId}/move`,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },
};

export default todoService;

