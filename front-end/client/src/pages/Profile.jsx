
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileSettings from "../components/profile/ProfileSettings";
import "../styles/profile/Profile.css";


const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, logoutAction } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Overview");

  const handleLogout = () => {
    logoutAction();
    navigate("/map");   
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!user) {
    return <div className="error-screen">Could not load profile data. Please try logging in again.</div>;
  }

  return (
    <div className="profile-container">
	
	{/*header - global to the page */}
	<header className="profile-header">
	  <div className="header-left">
	    <h1>Hello, {user.username}</h1>
	    <p className="subtitle">Profile</p>
	  </div>
	  <div className="header-right">
	    {user.role === 'admin' && (
		<button className="btn-map" onClick={() => navigate("/stats")}>Business Analytics</button>
	    )}
	    <button className="btn-map" onClick={() => navigate("/map")}>Map</button>
	    <button className="btn-logout" onClick={handleLogout}>Logout</button>
	  </div>
	</header>


	{/* Tab Buttons*/}
	<div className="tab-wrapper">
	  <button 
	  	className={`btn-tab ${activeTab === "Overview" ? "active" : "" }`}
	  	onClick={() => setActiveTab("Overview")}>Overview</button>
	  <button 
	  	className={`btn-tab ${activeTab === "Stats" ? "active" : "" }`}
	  	onClick={() => setActiveTab("Stats")}>Stats</button>
	  <button 
	  	className={`btn-tab ${activeTab === "Settings" ? "active" : "" }`}
	  	onClick={() => setActiveTab("Settings")}>Settings</button>
	</div>

	{/* Actual Content */}
	<div className="tab-content">
	  {activeTab === "Overview" && <ProfileOverview profile={user} />}
	  {activeTab === "Stats" && <ProfileStats />}
	  {activeTab === "Settings" && <ProfileSettings profile={user} />}
	</div>

     </div>
  );
};

export default Profile;
