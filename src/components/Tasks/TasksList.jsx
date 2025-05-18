// src/components/Tasks/TasksList.jsx
import React, { useState, useEffect, useContext } from "react";
import { PlusCircle, Search } from "lucide-react";
import { AuthContext } from "context/AuthContext";
import { api } from "api";
import Section from "./Section";

export default function TasksList() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks for the current user
  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Map backend payload into shape Section expects
      setTasks(
        res.data.tasks.map(t => ({
          id:        t._id,
          title:     t.title,
          assignedTo: t.assignedTo
            ? {
                firstName: t.assignedTo.firstName,
                lastName:  t.assignedTo.lastName,
                username:  t.assignedTo.username
              }
            : null,
          status:    t.status,
          priority:  t.priority,
          type:      t.type || "",
          subtasks:  t.subtasks || []
        }))
      );
    } catch (err) {
      console.error("Failed to load tasks:", err);
      alert("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
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
          onClick={() => window.location.href = "/tasks/new"}
          className="flex items-center text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          <PlusCircle size={16} className="mr-2" /> New Task
        </button>
      </div>

      {/* Search bar */}
      <div className="flex items-center mb-4 px-1">
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks…"
            className="bg-slate-700 text-sm rounded-md pl-8 pr-2 py-1.5 w-64 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tasks section */}
      <div className="flex-grow overflow-y-auto pr-1">
        <Section title="All Tasks" tasks={tasks} onAddTask={loadTasks} />
      </div>
    </div>
  );
}
