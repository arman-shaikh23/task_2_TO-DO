const TaskCard = ({ task, onEdit, onDelete, onToggle, onDragStart, isOverdue = false }) => {
  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline";

  return (
    <article
      className={`task-card glass hover-lift ${task.status === "completed" ? "task-done" : ""} ${isOverdue ? "task-overdue" : ""}`}
      draggable
      onDragStart={() => onDragStart(task._id)}
    >
      <div className="task-topline">
        <span className={`priority-chip priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <span className={`status-badge ${isOverdue ? "overdue" : task.status}`}>
          {isOverdue ? "overdue" : task.status}
        </span>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description || "No extra notes added yet."}</p>
      <div className="task-meta">
        <span>{task.category}</span>
        <span>{due}</span>
      </div>
      <div className="task-actions">
        <button className="ghost-button" onClick={() => onToggle(task)}>
          {task.status === "completed" ? "Mark Pending" : "Complete"}
        </button>
        {task.status !== "completed" && (
          <button className="ghost-button" onClick={() => onEdit(task)}>
            Edit
          </button>
        )}
        <button className="danger-button subtle" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
