import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="logo">
        Amperio
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
