// src/components/TodoItem.js
import React from 'react';

function TodoItem({ task, onToggle }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>{task.name}</span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
      />
    </li>
  );
}

export default TodoItem;


