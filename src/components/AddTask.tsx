import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AddTaskProps {
  onAddTask: (task: Task) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: uuidv4(),
      title,
      description: description || undefined,
      status: 'todo' as TaskStatus,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      category: category || undefined,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      subtasks: subtasks
        .filter(Boolean)
        .map((subtask) => ({
          id: uuidv4(),
          title: subtask,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      notes: notes || undefined,
    };

    onAddTask(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setCategory('');
    setTags('');
    setSubtasks(['']);
    setNotes('');
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const updateSubtask = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-semibold">Add New Task</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma-separated)"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Subtasks</label>
        <div className="space-y-2">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={subtask}
                onChange={(e) => updateSubtask(index, e.target.value)}
                placeholder="Enter subtask"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubtask}
            className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
          >
            Add Subtask
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter additional notes"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTask; 