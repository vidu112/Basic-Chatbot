import { useState, useEffect, useContext } from "react";
import { api } from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function TaskForm() {
  const { token } = useContext(AuthContext);

  // Form fields
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline]     = useState("");
  const [priority, setPriority]     = useState("medium");
  const [status, setStatus]         = useState("pending");
  const [tags, setTags]             = useState("");

  // User list for the "assignedTo" dropdown
  const [users, setUsers]           = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    api.get("/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data.users))
      .catch(err => {
        console.error("Failed to load users:", err);
        alert("Could not load users.");
      })
      .finally(() => setLoadingUsers(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post(
        "/tasks",
        {
          title,
          description,
          assignedTo: assignedTo || null,
          deadline: deadline || null,
          priority,
          status,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task created!");
      // reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDeadline("");
      setPriority("medium");
      setStatus("pending");
      setTags("");
    } catch (err) {
      console.error("Create task error:", err);
      alert("Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-800 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl mb-4">New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input

            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            rows={3}
          />
        </div>

        {/* Assignee */}
        <div>
          <label className="block mb-1">Assign To</label>
          {loadingUsers ? (
            <p>Loading users…</p>
          ) : (
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">— Unassigned —</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName} ({u.username})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block mb-1">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Priority & Status */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. frontend,urgent"
            className="w-full px-4 py-2 bg-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn w-full bg-blue hover:bg-transparent hover:text-blue transition py-3" text-black
        >
          {submitting ? "Creating…" : "Create Task"}
        </button>
      </form>
    </div>
  );
}
