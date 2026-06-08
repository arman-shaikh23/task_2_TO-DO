import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen label="Preparing your workspace" />;
  }

  return auth?.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

