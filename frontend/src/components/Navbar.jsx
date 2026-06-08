import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar glass">
      <div className="brand">
        <span className="brand-mark" />
        <div>
          <h1>TaskFlow</h1>
          <p>Smart Todo & Productivity Manager</p>
        </div>
      </div>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        <div className="avatar-pill">{auth?.user?.name?.slice(0, 1) || "U"}</div>
        <button className="ghost-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

