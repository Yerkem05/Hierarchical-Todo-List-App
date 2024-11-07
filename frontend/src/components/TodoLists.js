import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import todoService from '../api/AppService';


const TodoLists = () => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const data = await todoService.getLists();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setLists([]); // Ensure lists is set to an empty array on error
    }
  };

  const createList = async () => {
    try {
      const newList = await todoService.createList(newListTitle);
      setLists((prevLists) => [...prevLists, newList]);
      setNewListTitle('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const deleteList = async (listId) => {
    try {
      await todoService.deleteList(listId);
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const navigateToList = (listId) => {
    navigate(`/lists/${listId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        🌈 My Cute Todo Lists 🦄
      </h1>
      <card className="bg-gradient-to-r from-pink-100 to-blue-100 shadow-lg mb-8">
        <cardheader>
          <cardtitle className="text-2xl font-semibold text-primary">Create a New List</cardtitle>
        </cardheader>
        <cardcontent>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              className="flex-grow"
            />
            <button onClick={createList} className="bg-green-500 hover:bg-green-600 text-white">
              <plus className="h-5 w-5 mr-1" />
              Add List
            </button>
          </div>
        </cardcontent>
      </card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <card key={list.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <cardheader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <cardtitle className="text-xl font-semibold">
                📋 {list.title}
              </cardtitle>
              <button
                variant="ghost"
                size="icon"
                onClick={() => deleteList(list.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <trash2 className="h-5 w-5" />
              </button>
            </cardheader>
            <cardcontent>
              <p className="text-sm text-gray-500 mb-4">
                {list.items?.length || 0} items
              </p>
              <button
                variant="outline"
                className="w-full text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                onClick={() => navigateToList(list.id)}
              >
                View List
                <chevronright className="h-4 w-4 ml-2" />
              </button>
            </cardcontent>
          </card>
        ))}
      </div>
      {lists.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No lists yet. Create your first list above! 🎉
        </p>
      )}
    </div>
  )
}; 
export default TodoLists;
