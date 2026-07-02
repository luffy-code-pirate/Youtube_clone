import { createContext, useState, useContext } from "react";

// Creates a "broadcast channel" for user data
// Any component in the app can tune into this channel
const AuthContext = createContext();

// This component WRAPS our entire app (see main.jsx)
// So every component inside has access to user, login, logout
export const AuthProvider = ({ children }) => {

  // Initialize from localStorage so login survives page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    // localStorage only stores strings, so we parse it back to an object
    return stored ? JSON.parse(stored) : null;
  });

  // Call this after a successful login API response
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // objects must be stringified
    setUser(userData);
  };

  // Call this when user clicks logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    // value = what every child component can access
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — instead of writing useContext(AuthContext) every time,
// any component just writes: const { user, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext);