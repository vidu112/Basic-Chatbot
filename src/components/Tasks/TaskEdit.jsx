// src/components/TaskEdit.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function TaskEdit() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { token }   = useContext(AuthContext);

  const [task, setTask]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.get(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTask(res.data.task))
      .catch(err => {
        console.error("Failed to load task:", err);
        alert("Could not load task");
        navigate("/tasks");
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleChange = (field) => (e) => {
    setTask({ ...task, [field]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(
        `/tasks/${id}`,
        { ...task, tags: task.tags || [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task updated!");
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!task)  return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-800 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl mb-4">Edit Task</h2>
      <form onSubmit={handleSave} className="space-y-4">

        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={handleChange("title")}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={task.description}
            onChange={handleChange("description")}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Status</label>
            <select
              value={task.status}
              onChange={handleChange("status")}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Priority</label>
            <select
              value={task.priority}
              onChange={handleChange("priority")}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Deadline</label>
          <input
            type="datetime-local"
            value={task.deadline?.slice(0,16) || ""}
            onChange={handleChange("deadline")}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={(task.tags || []).join(",")}
            onChange={e => setTask({ ...task, tags: e.target.value.split(",").map(t=>t.trim()).filter(Boolean) })}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn w-full bg-blue hover:bg-transparent hover:text-blue py-3"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
