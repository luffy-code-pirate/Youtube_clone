import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  // Store form field values
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");     // error message to show user
  const [loading, setLoading] = useState(false); // prevent double submits
  const navigate = useNavigate();

  // Called when user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop browser from refreshing the page
    setError("");        // clear any previous error

    // Frontend validation — PDF requires showing error messages
    if (!form.username || !form.email || !form.password) {
      return setError("All fields are required");
    }
    if (form.username.length < 3) {
      return setError("Username must be at least 3 characters");
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setError("Please enter a valid email");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      // Send registration data to our backend
      await api.post("/users/register", form);

      // PDF says: after registration, redirect to login page
      navigate("/login");
    } catch (err) {
      // Show error from backend (e.g. "User already exists")
      setError(err.response?.data?.message || "Registration failed");
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
          Create your account
        </h3>

        {/* Error message box */}
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

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Username field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#aaa", fontSize: "14px" }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              style={inputStyle}
            />
          </div>

          {/* Email field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "#aaa", fontSize: "14px" }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email"
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
              placeholder="Min 6 characters"
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Link to login page */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#aaa", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#3ea6ff", cursor: "pointer" }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

// Reusable input style
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