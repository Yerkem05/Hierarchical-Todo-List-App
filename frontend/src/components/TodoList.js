import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import todoService from '../api/AppService';


const TodoList = () => {
  const [list, setList] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const { listId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, [listId]);

  const fetchList = async () => {
    try {
      const data = await todoService.getList(listId);
      setList(data);
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  const createItem = async () => {
    try {
      const newItem = await todoService.createItem(listId, newItemTitle);
      setList((prevList) => ({
        ...prevList,
        items: [...prevList.items, newItem],
      }));
      setNewItemTitle('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await todoService.deleteItem(itemId);
      setList((prevList) => ({
        ...prevList,
        items: prevList.items.filter((i) => i.id !== itemId),
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItemCompletion = async (itemId, completed) => {
    try {
      await todoService.toggleItemCompletion(itemId, completed);
      setList((prevList) => ({
        ...prevList,
        items: prevList.items.map((i) =>
          i.id === itemId ? { ...i, completed } : i
        ),
      }));
    } catch (error) {
      console.error('Error toggling item completion:', error);
    }
  };

  const navigateToList = () => {
    navigate('/lists');
  };

  if (!list) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={navigateToList}
        className="mb-4 bg-primary hover:bg-primary/90 text-white"
      >
        <arrowleft className="h-4 w-4 mr-2" />
        Back to Lists
      </button>
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        🌟 {list.title} 🌟
      </h1>
      <card className="bg-gradient-to-r from-pink-100 to-blue-100 shadow-lg mb-8">
        <cardheader>
          <cardtitle className="text-2xl font-semibold text-primary">Add New Todo</cardtitle>
        </cardheader>
        <cardcontent>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter todo item..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="flex-grow"
            />
            <button onClick={createItem} className="bg-green-500 hover:bg-green-600 text-white">
              <plus className="h-5 w-5 mr-1" />
              Add Item
            </button>
          </div>
        </cardcontent>
      </card>
      <div className="space-y-4">
        {list.items.map((item) => (
          <todoitem
            key={item.id}
            item={item}
            listId={listId}
            onDelete={deleteItem}
            onToggleCompletion={toggleItemCompletion}
          />
        ))}
      </div>
      {list.items.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No items yet. Add your first todo above! 🎉
        </p>
      )}
    </div>
  )
};
export default TodoList;