// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/', // Update this URL if needed
});

// Fetch all lists for the user
export const fetchLists = async (setLists) => {
  try {
    const response = await api.get('/lists');
    setLists(response.data);  // Update the component’s state with fetched lists
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
};

// Toggle task completion status
export const toggleTaskCompletion = async (listId, taskId, updateTaskStatus) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/update`, { completed: true });
    updateTaskStatus(listId, taskId, response.data); // Update the task status in the component
  } catch (error) {
    console.error("Error toggling task completion:", error);
  }
};

// Create a new task
export const createTask = async (listId, taskName, fetchLists) => {
  try {
    const response = await api.post('/create_items', { name: taskName, list_id: listId });
    fetchLists();  // Refresh the list after adding a new task
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

// Delete a task
export const deleteTask = async (taskId, fetchLists) => {
  try {
    await api.delete(`/tasks/${taskId}/delete`);
    fetchLists();  // Refresh the list after deleting a task
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};


export async function updateTaskStatus(listId, taskId, completed) {
  try {
    const response = await axios.patch(`/api/lists/${listId}/tasks/${taskId}`, { completed });
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}



