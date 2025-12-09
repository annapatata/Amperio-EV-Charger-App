import { useEffect, useState, useContext } from "react";
import api from "../axiosConfig"; 
import { AuthContext } from "../context/AuthContext";


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { logoutAction } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
        // If the token is invalid (e.g. expired), maybe log them out automatically?
        if (err.response && err.response.status === 401) {
            logoutAction();
        }
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;
  if(!profile.default_charger_power) {
    profile.default_charger_power = "(select something bro, you have like 1 car)";
  }

  return (
    <div>
      <h1>Welcome back, {profile.username}!</h1>
      <div className="card">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Default Power:</strong> {profile.default_charger_power}</p>
      </div>

      <button onClick={logoutAction}>Logout</button>
    </div>
  );
};

export default Profile;
