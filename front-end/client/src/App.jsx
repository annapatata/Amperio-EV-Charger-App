import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// A simple Dashboard component just for testing
const Dashboard = () => <h1>Welcome to the Secret Dashboard!</h1>;

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap everything so the 'Brain' is available everywhere */}
        
        <nav>
          <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
