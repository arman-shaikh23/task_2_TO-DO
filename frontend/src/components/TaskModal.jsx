import { useEffect, useState } from "react";

const draftKey = "taskflowDraft";

const initialState = {
  title: "",
  description: "",
  category: "Personal",
  dueDate: "",
  priority: "Medium",
};

const TaskModal = ({ open, onClose, onSave, editingTask, categories = [] }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!open) return;

    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        category: editingTask.category || "Personal",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
        priority: editingTask.priority || "Medium",
      });
      return;
    }

    const savedDraft = localStorage.getItem(draftKey);
    setForm(savedDraft ? JSON.parse(savedDraft) : initialState);
  }, [open, editingTask]);

  useEffect(() => {
    if (!open || editingTask) return;
    localStorage.setItem(draftKey, JSON.stringify(form));
  }, [form, open, editingTask]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
    localStorage.removeItem(draftKey);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal glass">
        <div className="modal-header">
          <div>
            <h3>{editingTask ? "Update Task" : "Create New Task"}</h3>
            <p>{editingTask ? "Keep momentum with clean updates." : "Auto-save is enabled for drafts."}</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Ship landing page polish"
              required
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Add helpful details, links, or implementation notes."
            />
          </label>
          <div className="form-grid">
            <label>
              Category
              <input
                list="category-options"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
              <datalist id="category-options">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>
            <label>
              Due Date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </label>
          </div>
          <label>
            Priority
            <select
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {editingTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

