import { createContext, useState, useEffect } from "react";

// 1. Create the Context (The empty box)
export const AuthContext = createContext();

// 2. Create the Provider (The component that holds the data)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Action: Login (Save data)
  const loginAction = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken); // Save to browser storage
  };

  // Action: Logout (Clear data)
  const logoutAction = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
};
