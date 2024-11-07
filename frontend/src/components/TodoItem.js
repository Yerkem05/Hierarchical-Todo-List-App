import React, { useState } from 'react';
import todoService from '../api/AppService';
import { Textarea } from "@/components/ui/textarea"


function TodoItem({ item, listId, onUpdate, onDelete, onToggleCompletion, depth = 0, lists }) {

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  const [newDescription, setNewDescription] = useState(item.description);


  const updateItem = async () => {
    try {
      await todoService.updateItem(item.id, newTitle, newDescription);
      setEditingTitle(false);
      setEditingDescription(false);
      onToggleCompletion(item.id, item.completed);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await todoService.deleteItem(item.id);
      onDelete(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleCompletion = async () => {
    try {
      await todoService.toggleItemCompletion(item.id, !item.completed);
      onToggleCompletion(item.id, !item.completed);
    } catch (error) {
      console.error('Error toggling item completion:', error);
    }
  };


  return (
    <div className={`ml-${depth * 4}`}>
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={toggleCompletion}
          className="mr-2"
        />
        {editingTitle ? (
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={updateItem}
            className="flex-grow mr-2"
            autoFocus
          />
        ) : (
          <h3 className={`text-lg font-semibold flex-grow ${item.completed ? 'line-through text-gray-500' : 'text-primary'}`}>
            {item.completed ? '✅ ' : '📌 '}{item.title}
          </h3>
        )}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditingTitle(!editingTitle)}
            className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDeleteItem}
            className="text-red-500 hover:text-red-600 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCompletion}
            className={`${item.completed ? 'text-green-500 hover:text-green-600 hover:bg-green-100' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {editingDescription ? (
        <Textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onBlur={updateItem}
          className="w-full mt-2"
          rows={3}
          autoFocus
        />
      ) : (
        <p className="text-gray-600 mt-2">{item.description || 'No description'}</p>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setEditingDescription(!editingDescription)}
        className="mt-2 text-blue-500 hover:text-blue-600 hover:bg-blue-100"
      >
        {editingDescription ? (
          <>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </>
        ) : (
          <>
            <Pencil className="h-4 w-4 mr-1" />
            {item.description ? 'Edit' : 'Add'} Description
          </>
        )}
      </Button>
    </div>
  )
};

export default TodoItem;