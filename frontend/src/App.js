import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TodoLists from './components/TodoLists';
import TodoList from './components/TodoList';
import TodoItem
 from './components/TodoItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lists" element={<TodoLists />} />
        <Route path ="/lists/:listId" element={<TodoList />} />
        <Route path="/lists/:listId/tasks/:taskId" element={<TodoItem />} />
      </Routes>
    </Router>
  );
}

export default App;
