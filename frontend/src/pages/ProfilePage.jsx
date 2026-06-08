import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ProfilePage = () => {
  useDocumentTitle("Profile");
  const { auth, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, productivityScore: 0 });
  const [form, setForm] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await api.get("/auth/profile");
      setStats(data.stats);
    };
    loadProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(form);
      showToast("Profile updated");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update profile", "error");
    }
  };

  return (
    <section className="page-shell">
      <div className="profile-grid">
        <article className="glass panel profile-card">
          <div className="avatar-xl">{form.name.slice(0, 1) || "U"}</div>
          <h2>{form.name}</h2>
          <p>{form.email}</p>
          <div className="profile-stats">
            <div>
              <strong>{stats.totalTasks}</strong>
              <span>Total Tasks</span>
            </div>
            <div>
              <strong>{stats.completedTasks}</strong>
              <span>Completed</span>
            </div>
            <div>
              <strong>{stats.productivityScore}%</strong>
              <span>Productivity</span>
            </div>
          </div>
        </article>

        <article className="glass panel">
          <div className="panel-header">
            <h3>Update Profile</h3>
            <span>Keep your workspace identity current</span>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <button className="primary-button">Save Profile</button>
          </form>
        </article>
      </div>
    </section>
  );
};

export default ProfilePage;

