import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      return setError("All fields are required");
    }
    try {
      setLoading(true);
      const res = await api.post("/users/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0f0f0f",
    }}>
      <div style={{
        backgroundColor: "#1f1f1f",
        border: "1px solid #303030",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        padding: "48px 40px",
      }}>

        {/* ── YouTube Logo ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginBottom: "24px",
        }}>
          {/* Red play button */}
          <div style={{
            backgroundColor: "#ff0000",
            borderRadius: "6px",
            width: "40px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 0,
              height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderLeft: "12px solid white",
              marginLeft: "3px",
            }} />
          </div>
          <span style={{
            color: "white",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          }}>
            YouTube
          </span>
        </div>

        {/* ── Heading ── */}
        <h2 style={{
          color: "white",
          fontSize: "24px",
          fontWeight: "400",
          textAlign: "center",
          marginBottom: "8px",
        }}>
          Sign in
        </h2>
        <p style={{
          color: "#aaa",
          fontSize: "14px",
          textAlign: "center",
          marginBottom: "32px",
        }}>
          to continue to YouTube
        </p>

        {/* ── Error message ── */}
        {error && (
          <div style={{
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
          }}>
            <span style={{ fontSize: "16px" }}>⚠️</span>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>

          {/* Email field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#aaa",
              fontSize: "12px",
              fontWeight: "500",
              marginBottom: "6px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              Email or phone
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              style={{
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
              }}
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

          {/* Password field */}
          <div style={{ marginBottom: "8px" }}>
            <label style={{
              display: "block",
              color: "#aaa",
              fontSize: "12px",
              fontWeight: "500",
              marginBottom: "6px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              style={{
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
              }}
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

          {/* Forgot password link */}
          <div style={{ marginBottom: "32px" }}>
            <span style={{
              color: "#3ea6ff",
              fontSize: "14px",
              cursor: "pointer",
            }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              Forgot password?
            </span>
          </div>

          {/* Bottom row: Create account + Next button */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Create account */}
            <button
              type="button"
              onClick={() => navigate("/register")}
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1a2a3a"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Create account
            </button>

            {/* Sign In / Next button */}
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
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#65b8ff"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#3ea6ff"; }}
            >
              {loading ? "Signing in..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}