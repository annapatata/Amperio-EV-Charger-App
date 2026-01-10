import { useState } from "react";
import api from "../../axiosConfig";
import "../../styles/profile/ProfileSettings.css";

const ProfileSettings = ({ profile }) => {
    const [formData, setFormData] = useState({
        username: profile.username || "",
        email: profile.email || "",
        default_charger_power: profile.default_charger_power || "",
        newPassword: "",
        confirmPassword: ""
    });

    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", message: "" });

        // Basic validation
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match" });
            return;
        }

        setIsSubmitting(true);

        try {
            // Construct payload - only send changed fields or necessary ones
            const payload = {
                username: formData.username,
                email: formData.email,
                default_charger_power: formData.default_charger_power
            };

            if (formData.newPassword) {
                payload.password = formData.newPassword;
            }

            // Assuming a PUT endpoint for updating profile
            await api.put("/users/profile", payload);
            
            setStatus({ type: "success", message: "Profile updated successfully!" });
            
            // Clear password fields on success
            setFormData(prev => ({
                ...prev,
                newPassword: "",
                confirmPassword: ""
            }));

        } catch (err) {
            console.error("Error updating profile", err);
            const errorMsg = err.response?.data?.message || "Failed to update profile. Please try again.";
            setStatus({ type: "error", message: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="settings-container">
            <form onSubmit={handleSubmit}>
                <div className="settings-section">
                    <h3>Personal Information</h3>
                    
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Charging Preferences</h3>
                    
                    <div className="form-group">
                        <label htmlFor="default_charger_power">Default Charger Power (kW)</label>
                        <input
                            type="number"
                            id="default_charger_power"
                            name="default_charger_power"
                            value={formData.default_charger_power}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                            step="0.1"
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Security</h3>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password (Leave blank to keep current)</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    {formData.newPassword && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn-save" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

                {status.message && (
                    <div className={`feedback-msg ${status.type}`}>
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProfileSettings;