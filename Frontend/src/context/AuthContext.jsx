import { createContext, useState, useContext, useEffect } from "react";

// Creates a broadcast channel for auth state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // authLoading = true until we finish checking localStorage
  // this prevents components from fetching before auth is ready
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // runs once on app start — checks if user was previously logged in
    try {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (stored && token) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      // if localStorage data is corrupted, clear it
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      // auth check complete — whether logged in or not
      setAuthLoading(false);
    }
  }, []);

  // called after successful login
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // called on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook — any component just writes: const { user } = useAuth()
export const useAuth = () => useContext(AuthContext);