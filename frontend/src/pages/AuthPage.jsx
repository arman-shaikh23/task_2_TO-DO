import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const passwordRule = "8+ chars, uppercase, lowercase, and number";

const AuthPage = ({ mode = "login" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(form);
        showToast("Welcome back. Workspace restored.");
      } else {
        await register(form);
        showToast("Account created. Let’s build momentum.");
      }
      navigate("/");
    } catch (error) {
      showToast(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <div className="floating-shape shape-a" />
        <div className="floating-shape shape-b" />
        <div className="floating-shape shape-c" />
        <div className="hero-copy">
          <span className="eyebrow">Premium productivity, reimagined</span>
          <h1>Plan deeply. Ship calmly. Track everything with TaskFlow.</h1>
          <p>
            A portfolio-grade productivity suite with secure auth, smart analytics, and an interface
            designed to feel like a modern SaaS product.
          </p>
        </div>
      </section>
      <section className="auth-panel glass">
        <h2>{isLogin ? "Welcome Back" : "Create Your Account"}</h2>
        <p>{isLogin ? "Sign in to continue your focused flow." : "Start with a secure productivity hub."}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin ? (
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Alex Morgan"
                required
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder={isLogin ? "Enter your password" : "Create a strong password"}
              required
            />
            {!isLogin ? <small>{passwordRule}</small> : null}
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(event) => setForm({ ...form, rememberMe: event.target.checked })}
            />
            Remember me
          </label>
          <button className="primary-button" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "New to TaskFlow?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Create account" : "Login"}
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AuthPage;

