import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoutes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Map from "./pages/Map";


function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap everything so the 'Brain' is available everywhere */}
        
        <nav>
          <Link to="/login">Login</Link> | 
	  <Link to="/signup">Signup</Link> | 
	  <Link to="/profile">Profile</Link> |
	  <Link to="/map">Map</Link>

        </nav>

        <Routes>
	  {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/map" element={<Map />} />

	  {/* Private Routes */}
	  <Route element={<PrivateRoute />}>
            <Route path="/Profile" element={<Profile />} />
	  </Route>
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
