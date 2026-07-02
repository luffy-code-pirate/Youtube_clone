import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // function to save user to global state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      // Send credentials to backend
      const res = await api.post("/users/login", form);

      // res.data contains { token, user }
      // Save both to localStorage and global state via AuthContext
      login(res.data.user, res.data.token);

      // Redirect to home page after successful login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: "#1f1f1f",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "380px",
        border: "1px solid #303030",
      }}>
        {/* Logo + title */}
        <h2 style={{ textAlign: "center", marginBottom: "8px" }}>📺 YouTube</h2>
        <h3 style={{ textAlign: "center", marginBottom: "24px", color: "#aaa", fontWeight: "normal" }}>
          Sign in to your account
        </h3>

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: "#3a1a1a",
            color: "#ff6b6b",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#aaa", fontSize: "14px" }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#aaa", fontSize: "14px" }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to register page */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#aaa", fontSize: "14px" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#3ea6ff", cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "#121212",
  border: "1px solid #303030",
  borderRadius: "6px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};