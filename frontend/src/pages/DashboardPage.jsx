import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const quotes = [
  "Small progress compounds into serious momentum.",
  "Clarity creates energy. Energy creates output.",
  "Done is powerful when it is intentional.",
];

const getStartOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const getWeekdayLabel = (date) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

const getStartOfWeek = (date) => {
  const value = getStartOfDay(date);
  value.setDate(value.getDate() - value.getDay());
  return value;
};

const isOverdueTask = (task, todayStart) =>
  task.status !== "completed" && task.dueDate && getStartOfDay(task.dueDate) < todayStart;

const DashboardPage = () => {
  useDocumentTitle("Dashboard");
  const { auth } = useAuth();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [todoResponse, profileResponse] = await Promise.all([
          api.get("/todos?limit=100&sortBy=custom"),
          api.get("/auth/profile"),
        ]);

        setPayload({
          todos: todoResponse.data.todos,
          stats: profileResponse.data.stats,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const analytics = useMemo(() => {
    const todos = payload?.todos || [];
    const todayStart = getStartOfDay(new Date());
    const todayKey = todayStart.toDateString();
    const weekStart = getStartOfWeek(todayStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const highPriority = todos.filter((todo) => todo.priority === "High").length;
    const pending = todos.filter((todo) => todo.status === "pending").length;
    const overdue = todos.filter((todo) => isOverdueTask(todo, todayStart)).length;
    const todaysTasks = todos.filter((todo) =>
      todo.dueDate ? getStartOfDay(todo.dueDate).toDateString() === todayKey : false
    ).length;
    const upcoming = todos.filter((todo) =>
      todo.dueDate ? getStartOfDay(todo.dueDate) > todayStart : false
    ).length;
    const completedThisWeek = todos.filter((todo) =>
      todo.status === "completed" && todo.updatedAt
        ? getStartOfDay(todo.updatedAt) >= weekStart &&
          getStartOfDay(todo.updatedAt) <= weekEnd
        : false
    ).length;

    const weeklyMomentum = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      const dayKey = day.toDateString();

      const createdCount = todos.filter(
        (todo) => getStartOfDay(todo.createdAt).toDateString() === dayKey
      ).length;
      const completedCount = todos.filter(
        (todo) =>
          todo.status === "completed" &&
          todo.updatedAt &&
          getStartOfDay(todo.updatedAt).toDateString() === dayKey
      ).length;

      return {
        label: getWeekdayLabel(day),
        count: createdCount + completedCount,
      };
    });

    return {
      highPriority,
      pending,
      overdue,
      todaysTasks,
      upcoming,
      completedThisWeek,
      weeklyMomentum,
    };
  }, [payload]);

  if (loading) {
    return <Loader fullScreen label="Loading analytics" />;
  }

  const totalTasks = payload?.stats?.totalTasks || 0;
  const completedTasks = payload?.stats?.completedTasks || 0;
  const productivity = payload?.stats?.productivityScore || 0;
  const quote = quotes[totalTasks % quotes.length];

  return (
    <section className="page-shell">
      <div className="page-hero glass">
        <div className="page-hero-copy">
          <span className="eyebrow">Welcome back, {auth?.user?.name}</span>
          <h2>Turn today's priorities into calm, visible progress.</h2>
          <p>{quote}</p>
        </div>
        <div className="progress-ring" style={{ background: `conic-gradient(var(--success) 0 ${productivity}%, rgba(255, 255, 255, 0.08) ${productivity}% 100%)` }}>
          <strong>{productivity}%</strong>
          <span>Productivity</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Tasks" value={totalTasks} accent="blue" hint="Everything in your system" />
        <StatsCard label="Completed" value={completedTasks} accent="green" hint="Tasks finished with confidence" />
        <StatsCard label="Pending" value={analytics.pending} accent="gold" hint="Current active workload" />
        <StatsCard label="High Priority" value={analytics.highPriority} accent="red" hint="Critical items to address" />
      </div>

      <div className="dashboard-grid">
        <article className="glass panel">
          <div className="panel-header">
            <h3>Daily Progress</h3>
            <span>{productivity}% complete</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: `${productivity}%` }} />
          </div>
          <div className="mini-metrics">
            <div>
              <strong>{analytics.todaysTasks}</strong>
              <span>Today</span>
            </div>
            <div>
              <strong>{analytics.upcoming}</strong>
              <span>Upcoming</span>
            </div>
            <div>
              <strong>{analytics.completedThisWeek}</strong>
              <span>Completed this week</span>
            </div>
            <div>
              <strong>{analytics.overdue}</strong>
              <span>Overdue</span>
            </div>
          </div>
        </article>

        <article className="glass panel">
          <div className="panel-header">
            <h3>Weekly Momentum</h3>
            <span>Sun to Sat activity</span>
          </div>
          {totalTasks ? (
            <div className="weekly-bars">
              {analytics.weeklyMomentum.map((day) => {
                const maxCount = Math.max(...analytics.weeklyMomentum.map((item) => item.count), 1);
                const height = Math.max(18, Math.round((day.count / maxCount) * 100));

                return (
                  <div key={day.label} className="weekly-bar-group">
                    <span
                      title={`${day.label}: ${day.count} activity item${day.count === 1 ? "" : "s"}`}
                      style={{ height: `${height}%` }}
                    />
                    <small>{day.label}</small>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No analytics yet"
              text="Create a few tasks and your progress visuals will start filling in."
            />
          )}
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;
