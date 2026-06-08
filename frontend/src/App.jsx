import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

const AppShell = () => (
  <div className="app-shell">
    <div className="background-orb orb-1" />
    <div className="background-orb orb-2" />
    <div className="background-grid" />
    <Navbar />
    <main className="content-area">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </main>
  </div>
);

const AuthRedirect = ({ children }) => {
  const { auth } = useAuth();
  return auth?.token ? <Navigate to="/" replace /> : children;
};

const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <AuthRedirect>
          <AuthPage mode="login" />
        </AuthRedirect>
      }
    />
    <Route
      path="/register"
      element={
        <AuthRedirect>
          <AuthPage mode="register" />
        </AuthRedirect>
      }
    />
    <Route element={<ProtectedRoute />}>
      <Route path="/*" element={<AppShell />} />
    </Route>
  </Routes>
);

export default App;

