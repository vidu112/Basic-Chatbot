// src/components/Tasks/TasksList.jsx
import React, { useState, useEffect, useContext } from "react";
import { PlusCircle, Search } from "lucide-react";
import { AuthContext } from "context/AuthContext";
import { api } from "api";
import Section from "./Section";

export default function TasksList() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks for the current user
  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Map backend payload into shape Section expects
      +setTasks(
        res.data.tasks.map((t) => ({
          // map Mongo’s _id → id so TaskRow can use task.id
          id: t._id,
          // and carry along everything else you need:
          title: t.title,
          deadline:   t.deadline,
          assignedTo: t.assignedTo
            ? {
                _id: t.assignedTo._id,
                firstName: t.assignedTo.firstName,
                lastName: t.assignedTo.lastName,
                username: t.assignedTo.username,
              }
            : null,
          status: t.status,
          priority: t.priority,
          type: t.type || "",
          subtasks: t.subtasks || [],
        }))
      );
    } catch (err) {
      console.error("Failed to load tasks:", err);
      alert("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for the assignee dropdown
  const loadUsers = async () => {
    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  // Handle task updates from inline editing
  const handleTaskUpdate = (updatedTaskFromAPI) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTaskFromAPI._id
          ? {
              id: updatedTaskFromAPI._id,
              title: updatedTaskFromAPI.title,
              deadline:   updatedTaskFromAPI.deadline,
              assignedTo: updatedTaskFromAPI.assignedTo
                ? {
                    _id: updatedTaskFromAPI.assignedTo._id,
                    firstName: updatedTaskFromAPI.assignedTo.firstName,
                    lastName: updatedTaskFromAPI.assignedTo.lastName,
                    username: updatedTaskFromAPI.assignedTo.username,
                  }
                : null,
              status: updatedTaskFromAPI.status,
              priority: updatedTaskFromAPI.priority,
              type: updatedTaskFromAPI.type || "",
              subtasks: updatedTaskFromAPI.subtasks || [],
            }
          : task
      )
    );
  };

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Search className="animate-spin text-slate-500" size={32} />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-850 text-slate-200 flex flex-col overflow-hidden p-4">
      {/* Top header bar */}
      <div className="flex items-center justify-between mb-4 px-2 py-1">
        <h1 className="text-xl font-semibold">All Tasks</h1>
        <button
          onClick={() => (window.location.href = "/tasks/new")}
          className="flex items-center text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          <PlusCircle size={16} className="mr-2" /> New Task
        </button>
      </div>

      {/* Search bar */}
      <div className="flex items-center mb-4 px-1">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search tasks…"
            className="bg-slate-700 text-sm rounded-md pl-8 pr-2 py-1.5 w-64 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tasks section */}
      <div className="flex-grow overflow-y-auto pr-1">
        <Section
          title="All Tasks"
          tasks={tasks}
          users={users}
          onAddTask={loadTasks}
          onUpdateTask={handleTaskUpdate}
        />
      </div>
    </div>
  );
}
