import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("aqua_user")); // or from Redux/Context

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default UserProtectedRoute;