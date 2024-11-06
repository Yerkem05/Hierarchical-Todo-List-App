// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { fetchLists, toggleTaskCompletion, createTask } from '../api';
import { updateTaskStatus } from '../api';


function TodoList() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists(setLists);  // Fetch lists on component mount
  }, []);

  const handleToggle = (listId, taskId) => {
    toggleTaskCompletion(listId, taskId, updateTaskStatus);  // Mark task as complete/incomplete
  };

  const handleCreateTask = async (listId, taskName) => {
    await createTask(listId, taskName, fetchLists); // Create a new task
  };

  return (
    <div className="container">
      {lists.map((list) => (
        <div key={list.id} className="mb-4">
          <h5>{list.name}</h5>
          <ul className="list-group">
            {list.tasks.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={() => handleToggle(list.id, task.id)}
              />
            ))}
          </ul>
          <button onClick={() => handleCreateTask(list.id, "New Task")} className="btn btn-primary mt-2">
            Add Task
          </button>
        </div>
      ))}
    </div>
  );
}

export default TodoList;


