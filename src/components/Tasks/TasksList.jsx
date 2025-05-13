// src/components/TasksList.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  ChevronDown,
  Plus,
  PlusCircle,
  GripVertical,
  Search,
  User
} from "lucide-react";
import { api } from "../../api.js";
import { AuthContext } from "../../context/AuthContext.jsx";

// Colored badge helper
const Badge = ({ text, colorClass, textColorClass = "text-black/70" }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${colorClass} ${textColorClass}`}>
    {text}
  </span>
);

const getStatusColor = (status) => {
  switch (status) {
    case "in_progress":    return "bg-yellow-400";
    case "pending":        return "bg-gray-400";
    case "completed":      return "bg-green-500";
    case "cancelled":      return "bg-red-500";
    default:               return "bg-slate-400";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent":  return "bg-red-400";
    case "high":    return "bg-orange-400";
    case "medium":  return "bg-sky-500";
    case "low":     return "bg-green-400";
    default:        return "bg-slate-400";
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "bug":            return "bg-red-600 text-red-100";
    case "feature":        return "bg-green-500 text-green-100";
    case "documentation":  return "bg-indigo-500 text-indigo-100";
    default:               return "bg-gray-500 text-gray-100";
  }
};

// A simple check icon for the checkbox
const CheckIcon = (props) => (
  <svg {...props} viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
  </svg>
);

// Single row for one task
const TaskRow = ({ task }) => {
  const [isChecked, setIsChecked] = useState(false);
  const owner = task.assignedTo; // assume { firstName, lastName, username }
  
  return (
    <div className="flex items-center border-b border-slate-700 hover:bg-slate-700/30 text-sm">
      {/* Checkbox */}
      <div className="w-10 px-3 py-2 flex items-center justify-center">
        <div
          className={`w-4 h-4 border-2 rounded-sm cursor-pointer flex items-center justify-center ${
            isChecked ? "bg-blue-500 border-blue-500" : "border-slate-500"
          }`}
          onClick={() => setIsChecked(!isChecked)}
        >
          {isChecked && <CheckIcon className="w-3 h-3 text-white" />}
        </div>
      </div>

      {/* Title + subtasks */}
      <div className="w-2/5 px-2 py-2 truncate flex items-center">
        <span className="truncate mr-2">{task.title}</span>
        {task.subtasks && task.subtasks.length > 0 && (
          <button className="text-slate-500 hover:text-slate-300">
            <PlusCircle size={16} />
          </button>
        )}
      </div>

      {/* Owner */}
      <div className="w-[10%] px-2 py-2 flex justify-center">
        {owner ? (
          <div
            className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-slate-300 ring-1 ring-slate-500"
            title={`${owner.firstName} ${owner.lastName}`}
          >
            {owner.firstName[0]}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
            <User size={14} className="text-slate-600"/>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="w-[12%] px-2 py-2 flex justify-center">
        <Badge text={task.status} colorClass={getStatusColor(task.status)} textColorClass="text-black/80" />
      </div>

      {/* Priority */}
      <div className="w-[12%] px-2 py-2 flex justify-center">
        <Badge text={task.priority} colorClass={getPriorityColor(task.priority)} textColorClass="text-white/90" />
      </div>

      {/* Type */}
      <div className="w-[12%] px-2 py-2 flex justify-center">
        {task.type && (
          <Badge
            text={task.type}
            colorClass={getTypeColor(task.type).split(" ")[0]}
            textColorClass={getTypeColor(task.type).split(" ")[1]}
          />
        )}
      </div>

      {/* Reorder handle */}
      <div className="w-[9%] px-2 py-2 text-center">
        <GripVertical size={16} className="mx-auto text-slate-500" />
      </div>
    </div>
  );
};

// Row to add a new task
const AddTaskRow = () => (
  <div className="flex items-center border-b border-slate-700 hover:bg-slate-700/30 cursor-pointer text-slate-500 hover:text-slate-300">
    <div className="w-10 px-3 py-2" />
    <div className="w-full px-2 py-2 flex items-center text-sm">
      <Plus size={16} className="mr-2" /> Add task
    </div>
  </div>
);

// Collapsible section
const Section = ({ title, tasks }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between px-1 py-2 text-slate-300">
        <div className="flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="mr-2 p-1 hover:bg-slate-700 rounded">
            <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>

      {/* Contents */}
      {isOpen && (
        <div className="bg-slate-800 rounded-md border border-slate-700 shadow-md">
          {/* Table header */}
          <div className="flex items-center border-b border-slate-600 bg-slate-800/50 text-xs font-medium text-slate-400 sticky top-0 z-10">
            <div className="w-10 px-3 py-2 text-center"><div className="w-4 h-4 border-2 rounded-sm border-slate-500 mx-auto"></div></div>
            <div className="w-2/5 px-2 py-2">Task</div>
            <div className="w-[10%] px-2 py-2 text-center">Owner</div>
            <div className="w-[12%] px-2 py-2 text-center">Status</div>
            <div className="w-[12%] px-2 py-2 text-center">Priority</div>
            <div className="w-[12%] px-2 py-2 text-center">Type</div>
            <div className="w-[9%] px-2 py-2 text-center"><GripVertical size={16} /></div>
          </div>

          {/* Task rows */}
          {tasks.map(task => <TaskRow key={task.id} task={task} />)}

          {/* Add task link */}
          <AddTaskRow />
        </div>
      )}
    </div>
  );
};

export default function TasksList() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real tasks on mount
  useEffect(() => {
    api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Map your backend Task objects to the shape TaskRow expects
      setTasks(res.data.tasks.map(t => ({
        id: t._id,
        title: t.title,
        assignedTo: t.assignedTo && {
          firstName: t.assignedTo.firstName,
          lastName:  t.assignedTo.lastName,
          username:  t.assignedTo.username
        },
        status:    t.status,
        priority:  t.priority,
        type:      t.type || "",              // if you add a 'type' field
        subtasks:  t.subtasks || []
      })));
    })
    .catch(err => {
      console.error("Failed to load tasks:", err);
      alert("Could not load tasks");
    })
    .finally(() => setLoading(false));
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
      {/* Top bar */}
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

      {/* Task section */}
      <div className="flex-grow overflow-y-auto pr-1">
        <Section title="All Tasks" tasks={tasks} />
      </div>
    </div>
  );
}
