import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("aqua_user"));

  const ADMIN_EMAIL = import.meta.env.VITE_APP_ADMIN_EMAIL;

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  if (user?.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
