// src/components/Section.jsx
import React, { useState } from "react";
import { ChevronDown, GripVertical } from "lucide-react";
import TaskRow from "./TaskRow";
import AddTaskRow from "./AddTaskRow";

export default function Section({
  title,
  tasks,
  onAddTask = () => {}    // default if not provided
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between px-1 py-2 text-slate-300">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-2 p-1 hover:bg-slate-700 rounded"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>

      {/* Collapsible content */}
      {isOpen && (
        <div className="bg-slate-800 rounded-md border border-slate-700 shadow-md">
          {/* Table header */}
          <div className="flex items-center border-b border-slate-600 bg-slate-800/50 text-xs font-medium text-slate-400 sticky top-0 z-10">
            <div className="w-10 px-3 py-2 text-center">
              <div className="w-4 h-4 border-2 rounded-sm border-slate-500 mx-auto" />
            </div>
            <div className="w-2/5 px-2 py-2">Task</div>
            <div className="w-[10%] px-2 py-2 text-center">Owner</div>
            <div className="w-[12%] px-2 py-2 text-center">Status</div>
            <div className="w-[12%] px-2 py-2 text-center">Priority</div>
            <div className="w-[12%] px-2 py-2 text-center">Type</div>
            <div className="w-[9%] px-2 py-2 text-center">
              <GripVertical size={16} className="mx-auto text-slate-500" />
            </div>
          </div>

          {/* Task rows */}
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}

          {/* Inline “Add task” row */}
          <AddTaskRow onAdd={onAddTask} />
        </div>
      )}
    </div>
  );
}
