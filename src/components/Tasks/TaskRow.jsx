import React, { useState } from "react";
import { PlusCircle, User, GripVertical } from "lucide-react";
import Badge from "./Badge";
import CheckIcon from "../Icons/CheckIcon";

const getStatusColor = (status) => {
  switch (status) {
    case "in_progress": return "bg-yellow-400";
    case "pending":     return "bg-gray-400";
    case "completed":   return "bg-green-500";
    case "cancelled":   return "bg-red-500";
    default:            return "bg-slate-400";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent": return "bg-red-400";
    case "high":   return "bg-orange-400";
    case "medium": return "bg-sky-500";
    case "low":    return "bg-green-400";
    default:       return "bg-slate-400";
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "bug":           return "bg-red-600 text-red-100";
    case "feature":       return "bg-green-500 text-green-100";
    case "documentation": return "bg-indigo-500 text-indigo-100";
    default:              return "bg-gray-500 text-gray-100";
  }
};

export default function TaskRow({ task }) {
  const [isChecked, setIsChecked] = useState(false);
  const owner = task.assignedTo;

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
        {task.subtasks?.length > 0 && (
          <button className="text-slate-500 hover:text-slate-300">
            <PlusCircle size={16} />
          </button>
        )}
      </div>

      {/* Owner */}
      <div className="w-[10%] px-2 py-2 flex justify-center">
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
}
