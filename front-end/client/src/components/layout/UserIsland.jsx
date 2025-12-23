// components/layout/UserIsland.jsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserIsland() {
  const { user } = useContext(AuthContext);
  return (
    <div className="user-island">
      {!user ? (
        <div className="auth-buttons">
          <Link to="/login" className="user-btn">Login</Link>
          <Link to="/signup" className="user-btn">Sign Up</Link>
        </div>
      ) : (
        <Link to="/profile" className="user-btn">Profile</Link>
      )}
    </div>
  );
}