import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = document.cookie.includes("access"); // cookie check

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;