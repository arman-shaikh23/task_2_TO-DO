import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const defaultFilters = {
  search: "",
  status: "all",
  priority: "all",
  category: "all",
  sortBy: "custom",
  page: 1,
  limit: 9,
};

const getStartOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const isOverdueTask = (task, todayStart) =>
  task.status !== "completed" && task.dueDate && getStartOfDay(task.dueDate) < todayStart;

const TasksPage = () => {
  useDocumentTitle("Tasks");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([
    "Personal",
    "Work",
    "Study",
    "Health",
    "Shopping",
    "Other",
  ]);
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const todayStart = useMemo(() => getStartOfDay(new Date()), []);
  const requestFilters = useMemo(
    () => ({
      ...filters,
      status: filters.status === "overdue" ? "pending" : filters.status,
    }),
    [filters]
  );
  const queryString = useMemo(() => new URLSearchParams(requestFilters).toString(), [requestFilters]);

  const applyClientFilters = (incomingTasks) => {
    if (filters.status === "overdue") {
      return incomingTasks.filter((task) => isOverdueTask(task, todayStart));
    }

    return incomingTasks;
  };

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status === "pending" && !isOverdueTask(task, todayStart)),
    [tasks, todayStart]
  );
  const completedTasks = useMemo(() => tasks.filter((task) => task.status === "completed"), [tasks]);
  const overdueTasks = useMemo(
    () => tasks.filter((task) => isOverdueTask(task, todayStart)),
    [tasks, todayStart]
  );

  const loadTodos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/todos?${queryString}`);
      const visibleTasks = applyClientFilters(data.todos);
      setTasks(visibleTasks);
      setCategories(data.categories);
      setPagination({
        ...data.pagination,
        total: filters.status === "overdue" ? visibleTasks.length : data.pagination.total,
      });
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTodos();
    }, filters.search ? 250 : 0);

    return () => clearTimeout(timer);
  }, [queryString, filters.status]);

  const handleSaveTask = async (formData) => {
    try {
      if (editingTask) {
        await api.put(`/todos/${editingTask._id}`, formData);
        showToast("Task updated");
      } else {
        await api.post("/todos", formData);
        showToast("Task created");
      }

      setEditingTask(null);
      setIsModalOpen(false);
      loadTodos();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to save task", "error");
    }
  };

  const handleDeleteTask = async () => {
    try {
      await api.delete(`/todos/${taskToDelete._id}`);
      setTaskToDelete(null);
      showToast("Task deleted");
      loadTodos();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to delete task", "error");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await api.patch(`/todos/${task._id}/status`, { status: nextStatus });
      if (nextStatus === "completed") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }

      showToast(nextStatus === "completed" ? "Task completed" : "Task marked pending");
      loadTodos();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update task", "error");
    }
  };

  const handleDropToLane = async (nextStatus) => {
    if (!draggedId) return;

    try {
      const task = tasks.find((item) => item._id === draggedId);
      if (!task || task.status === nextStatus) {
        setDraggedId(null);
        return;
      }

      await api.patch(`/todos/${draggedId}/status`, { status: nextStatus });
      if (nextStatus === "completed") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }

      showToast(nextStatus === "completed" ? "Task completed" : "Task moved back to pending");
      loadTodos();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to move task", "error");
    } finally {
      setDraggedId(null);
    }
  };

  return (
    <section className="page-shell">
      {showConfetti ? <div className="confetti-layer" /> : null}

      <div className="tasks-toolbar glass">
        <div className="page-hero-copy">
          <span className="eyebrow">Task command center</span>
          <h2>Capture, prioritize, and flow through your work.</h2>
          <p className="toolbar-copy">Drag any card between lanes to update its status instantly.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          New Task
        </button>
      </div>

      <div className="filters glass">
        <input
          placeholder="Search tasks in real time..."
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })}
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={filters.priority}
          onChange={(event) => setFilters({ ...filters, priority: event.target.value, page: 1 })}
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filters.category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value, page: 1 })}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={filters.sortBy}
          onChange={(event) => setFilters({ ...filters, sortBy: event.target.value })}
        >
          <option value="custom">Custom Order</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="dueSoon">Due Soon</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {loading ? (
        <div className="task-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="task-skeleton glass" />
          ))}
        </div>
      ) : tasks.length ? (
        <>
          <div className="task-board">
            <section
              className="task-lane glass"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDropToLane("pending")}
            >
              <div className="lane-header">
                <div>
                  <h3>Pending</h3>
                  <p>Active work that is still on track.</p>
                </div>
                <span className="lane-count">{pendingTasks.length}</span>
              </div>
              <div className="lane-card-stack">
                {pendingTasks.length ? (
                  pendingTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={(selected) => {
                        setEditingTask(selected);
                        setIsModalOpen(true);
                      }}
                      onDelete={setTaskToDelete}
                      onToggle={handleToggleStatus}
                      onDragStart={setDraggedId}
                    />
                  ))
                ) : (
                  <div className="lane-dropzone">Drop tasks here to keep them pending.</div>
                )}
              </div>
            </section>

            <section className="task-lane glass">
              <div className="lane-header">
                <div>
                  <h3>Overdue</h3>
                  <p>Due date passed and still not completed.</p>
                </div>
                <span className="lane-count overdue-count">{overdueTasks.length}</span>
              </div>
              <div className="lane-card-stack">
                {overdueTasks.length ? (
                  overdueTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isOverdue
                      onEdit={(selected) => {
                        setEditingTask(selected);
                        setIsModalOpen(true);
                      }}
                      onDelete={setTaskToDelete}
                      onToggle={handleToggleStatus}
                      onDragStart={setDraggedId}
                    />
                  ))
                ) : (
                  <div className="lane-dropzone lane-dropzone-passive">
                    Nice work. No overdue tasks right now.
                  </div>
                )}
              </div>
            </section>

            <section
              className="task-lane glass"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDropToLane("completed")}
            >
              <div className="lane-header">
                <div>
                  <h3>Completed</h3>
                  <p>Drop a task here to mark it done.</p>
                </div>
                <span className="lane-count completed-count">{completedTasks.length}</span>
              </div>
              <div className="lane-card-stack">
                {completedTasks.length ? (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={(selected) => {
                        setEditingTask(selected);
                        setIsModalOpen(true);
                      }}
                      onDelete={setTaskToDelete}
                      onToggle={handleToggleStatus}
                      onDragStart={setDraggedId}
                    />
                  ))
                ) : (
                  <div className="lane-dropzone">Drop tasks here to complete them.</div>
                )}
              </div>
            </section>
          </div>

          <div className="pagination">
            {pagination.page > 1 && (
              <button
                className="ghost-button"
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Previous
              </button>
            )}
            <span>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            {pagination.page < pagination.totalPages && (
              <button
                className="ghost-button"
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          title="No tasks found"
          text="Try adjusting your filters or create a fresh task to get the board moving."
          actionLabel="Create Task"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      <TaskModal
        open={isModalOpen}
        editingTask={editingTask}
        categories={categories}
        onClose={() => {
          setEditingTask(null);
          setIsModalOpen(false);
        }}
        onSave={handleSaveTask}
      />

      <ConfirmModal
        open={Boolean(taskToDelete)}
        title="Delete task?"
        message="This action removes the task permanently from your workspace."
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />
    </section>
  );
};

export default TasksPage;
