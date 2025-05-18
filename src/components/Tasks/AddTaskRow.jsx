import React, { useState, useContext } from "react";
import { Plus, X } from "lucide-react";
import { AuthContext } from "context/AuthContext";
import { api } from "api";

export default function AddTaskRow({ onAdd }) {
  const { token } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);
  const [title, setTitle]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await api.post(
        "/tasks",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setAdding(false);
      onAdd();           // let parent refresh the list
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Unable to add task");
    } finally {
      setLoading(false);
    }
  };

  // Press Enter to submit
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return adding ? (
    <div className="flex items-center border-b border-slate-700 bg-slate-800/50 px-3 py-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="New task title…"
        className="flex-grow bg-transparent border-b border-blue-500 text-sm px-2 py-1 focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        {loading ? "Adding…" : "Add"}
      </button>
      <button
        onClick={() => { setAdding(false); setTitle(""); }}
        className="ml-2 text-slate-400 hover:text-slate-200"
      >
        <X size={16} />
      </button>
    </div>
  ) : (
    <div
      onClick={() => setAdding(true)}
      className="flex items-center border-b border-slate-700 hover:bg-slate-700/30 cursor-pointer text-slate-500 hover:text-slate-300 px-3 py-2"
    >
      <Plus size={16} className="mr-2" /> Add task
    </div>
  );
}
