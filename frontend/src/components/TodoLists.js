// src/components/TodoLists.js
import React, { useEffect, useState } from 'react';
import { fetchLists } from '../api';
import TodoList from './TodoList';

function TodoLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLists() {
      try {
        const response = await fetchLists();
        setLists(response);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load lists:", err);
        setError("Could not fetch lists.");
        setLoading(false);
      }
    }
    loadLists();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>My Todo Lists</h2>
      <div className="row">
        {lists.map((list) => (
          <div key={list.id} className="col-md-4 mb-3">
            <TodoList list={list} setLists={setLists} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoLists;


