import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password) {
      return setError("All fields are required");
    }
    if (form.username.length < 3) {
      return setError("Username must be at least 3 characters");
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setError("Please enter a valid email");
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      return setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character (@$!%*?&)",
      );
    }

    try {
      setLoading(true);
      await api.post("/users/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0f0f",
      }}
    >
      <div
        style={{
          backgroundColor: "#1f1f1f",
          border: "1px solid #303030",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          padding: "48px 40px",
        }}
      >
        {/* ── YouTube Logo ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ff0000",
              borderRadius: "6px",
              width: "40px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                borderLeft: "12px solid white",
                marginLeft: "3px",
              }}
            />
          </div>
          <span
            style={{
              color: "white",
              fontSize: "22px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            YouTube
          </span>
        </div>

        {/* ── Heading ── */}
        <h2
          style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "400",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Create your account
        </h2>
        <p
          style={{
            color: "#aaa",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          to continue to YouTube
        </p>

        {/* ── Error message ── */}
        {error && (
          <div
            style={{
              backgroundColor: "#2a1515",
              border: "1px solid #ff4444",
              color: "#ff6b6b",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Choose a username"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3ea6ff";
                e.target.style.boxShadow = "0 0 0 1px #3ea6ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#444";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3ea6ff";
                e.target.style.boxShadow = "0 0 0 1px #3ea6ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#444";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3ea6ff";
                e.target.style.boxShadow = "0 0 0 1px #3ea6ff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#444";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <p
            style={{
              color: "#aaa",
              fontSize: "12px",
              marginTop: "6px",
              lineHeight: "1.5",
            }}
          >
            Must be 8+ characters with uppercase, lowercase, number and special
            character (@$!%*?&)
          </p>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Sign in instead */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                padding: "0 24px",
                height: "40px",
                backgroundColor: "transparent",
                border: "none",
                color: "#3ea6ff",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1a2a3a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Sign in instead
            </button>

            {/* Create account button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0 24px",
                height: "40px",
                backgroundColor: "#3ea6ff",
                border: "none",
                borderRadius: "4px",
                color: "#0f0f0f",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#65b8ff";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#3ea6ff";
              }}
            >
              {loading ? "Creating..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: "#aaa",
  fontSize: "12px",
  fontWeight: "500",
  marginBottom: "6px",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  backgroundColor: "transparent",
  border: "1px solid #444",
  borderRadius: "4px",
  color: "white",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
