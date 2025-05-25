import React, { useState, useContext } from "react";
import { PlusCircle, User, GripVertical } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api";
import Badge from "./Badge";
import CheckIcon from "../Icons/CheckIcon";

export default function TaskRow({ task, onUpdate, users = [] }) {
  const { token } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState(false);

  // Editing states
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [updating, setUpdating] = useState(false);

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    const date = new Date(deadline);
    // const now = new Date();
    // const diffTime = date - now;
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return formatted;
  };

  const STATUS_CONFIG = [
    { value: "pending", label: "Pending", color: "bg-gray-400" },
    { value: "in_progress", label: "In Progress", color: "bg-yellow-400" },
    { value: "completed", label: "Completed", color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
  ];

  const PRIORITY_CONFIG = [
    { value: "low", label: "Low", color: "bg-green-400" },
    { value: "medium", label: "Medium", color: "bg-sky-500" },
    { value: "high", label: "High", color: "bg-orange-400" },
    { value: "urgent", label: "Urgent", color: "bg-red-400" },
  ];

  const TYPE_CONFIG = [
    {
      value: "bug",
      label: "Bug",
      color: "bg-red-600",
      textColor: "text-red-100",
    },
    {
      value: "feature",
      label: "Feature",
      color: "bg-green-500",
      textColor: "text-green-100",
    },
    {
      value: "documentation",
      label: "Documentation",
      color: "bg-indigo-500",
      textColor: "text-indigo-100",
    },
  ];

  const getDeadlineColor = (deadline) => {
    if (!deadline) return "text-slate-500";
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-400"; // overdue
    if (diffDays === 0) return "text-orange-400"; // today
    if (diffDays <= 3) return "text-yellow-400"; // soon
    return "text-slate-300"; // normal
  };

  const owner = task.assignedTo;

  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || "");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const getStatusConfig = (status) => {
    return (
      STATUS_CONFIG.find((config) => config.value === status) || {
        value: status,
        label: status,
        color: "bg-slate-400",
      }
    );
  };

  const getPriorityConfig = (priority) => {
    return (
      PRIORITY_CONFIG.find((config) => config.value === priority) || {
        value: priority,
        label: priority,
        color: "bg-slate-400",
      }
    );
  };

  const getTypeConfig = (type) => {
    return (
      TYPE_CONFIG.find((config) => config.value === type) || {
        value: type,
        label: type,
        color: "bg-gray-500",
        textColor: "text-gray-100",
      }
    );
  };

  const saveEdit = async () => {
    if (updating) return;
    setUpdating(true);

    try {
      let updateData = {};

      if (editingField === "title") {
        updateData.title = editValue;
      } else if (editingField === "status") {
        updateData.status = editValue;
      } else if (editingField === "priority") {
        updateData.priority = editValue;
      } else if (editingField === "assignedTo") {
        updateData.assignedTo = editValue || null;
      } else if (editingField === "deadline") {
        updateData.deadline = editValue
          ? new Date(editValue).toISOString()
          : null;
      }

      const response = await api.put(`/tasks/${task.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the task in parent component
      if (onUpdate) {
        onUpdate(response.data.task);
      }

      setEditingField(null);
      setEditValue("");
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task");
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="flex items-center border-b border-slate-700 hover:bg-slate-700/30 text-sm overflow-x-auto min-w-[700px] gap-1">
      {/* Checkbox */}

      <div className="w-10 px-2 py-2 flex items-center justify-center ">
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
      <div className="w-[30%] px-2 py-2 flex items-center">
        {editingField === "title" ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-slate-600 text-white px-2 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={updating}
          />
        ) : (
          <span
            className="truncate mr-2 cursor-pointer hover:bg-slate-600  py-0.5 rounded"
            onClick={() => startEdit("title", task.title)}
            title="Click to edit title"
          >
            {task.title}
          </span>
        )}
        <button className="text-slate-500 hover:text-slate-300">
          <PlusCircle size={16} />
        </button>
      </div>

      {/* Owner */}
      <div className="w-[10%] px-2 py-2 flex justify-center">
        {editingField === "assignedTo" ? (
          <select
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-600 text-white px-1 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={updating}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        ) : (
          <div
            className="cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-full"
            onClick={() => startEdit("assignedTo", owner?._id || "")}
            title="Click to change assignee"
          >
            {owner && owner.firstName ? (
              <div
                className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-slate-300 ring-1 ring-slate-500"
                title={`${owner.firstName} ${owner.lastName}`}
              >
                {owner.firstName.charAt(0)}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
                <User size={14} className="text-slate-600" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="w-[12%] flex justify-center items-stretch">
        {editingField === "status" ? (
          <select
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-600 text-white px-1 py-1 h-full rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={updating}
          >
            {STATUS_CONFIG.map((config) => (
              <option key={config.value} value={config.value}>
                {config.label}
              </option>
            ))}
          </select>
        ) : (
          <div
            className="cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-md h-full w-full flex justify-center"
            onClick={() => startEdit("status", task.status)}
            title="Click to change status"
          >
            <Badge
              text={getStatusConfig(task.status).label}
              colorClass={getStatusConfig(task.status).color}
              textColorClass="text-black/80"
              fullSize={true}
            />
          </div>
        )}
      </div>

      {/* Priority */}
      <div className="w-[12%] flex justify-center items-stretch">
        {editingField === "priority" ? (
          <select
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-600 text-white px-1 py-1 h-full rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={updating}
          >
            {PRIORITY_CONFIG.map((config) => (
              <option key={config.value} value={config.value}>
                {config.label}
              </option>
            ))}
          </select>
        ) : (
          <div
            className="cursor-pointer hover:ring-2 hover:ring-blue-500 rounded-md w-full flex justify-center"
            onClick={() => startEdit("priority", task.priority)}
            title="Click to change priority"
          >
            <Badge
              text={getPriorityConfig(task.priority).label}
              colorClass={getPriorityConfig(task.priority).color}
              textColorClass="text-white/90"
              fullSize={true}
            />
          </div>
        )}
      </div>

      {/* Type */}
      <div className="w-[10%] px-2 py-2 flex justify-center">
        {task.type && (
          <Badge
            text={getTypeConfig(task.type).label}
            colorClass={getTypeConfig(task.type).color}
            textColorClass={getTypeConfig(task.type).textColor}
            fullSize={true}
          />
        )}
      </div>

      {/* Deadline */}
      <div className="w-[15%] px-2 py-2 flex justify-center">
        {editingField === "deadline" ? (
          <input
            autoFocus
            type="datetime-local"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-600 text-white px-1 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={updating}
          />
        ) : (
          <span
            className={`cursor-pointer hover:bg-slate-600 px-1 py-0.5 rounded text-xs truncate ${getDeadlineColor(
              task.deadline
            )}`}
            onClick={() => {
              const deadlineValue = task.deadline
                ? new Date(task.deadline).toISOString().slice(0, 16)
                : "";
              startEdit("deadline", deadlineValue);
            }}
            title="Click to edit deadline"
          >
            {formatDeadline(task.deadline)}
          </span>
        )}
      </div>

      {/* Reorder handle */}
      <div className="w-[9%] px-2 py-2 text-center">
        <GripVertical size={16} className="mx-auto text-slate-500" />
      </div>

      {/* Table header */}
    </div>
  );
}
