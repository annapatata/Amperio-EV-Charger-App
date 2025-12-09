import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { token } = useContext(AuthContext);

  // If there is NO token, kick them back to Login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If there IS a token, let them see the child components (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
