import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CreateChannel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.channelName.trim()) {
      return setError("Channel name is required");
    }

    try {
      setLoading(true);
      const res = await api.post("/channels", form);
      // After creating channel, go to that channel's page
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create channel");
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
        maxWidth: "440px",
        border: "1px solid #303030",
      }}>
        {/* Header */}
        <h2 style={{ color: "white", marginBottom: "8px" }}>Create Channel</h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>
          This is how you'll appear on YouTube
        </p>

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
          {/* Channel Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Channel Name *</label>
            <input
              type="text"
              value={form.channelName}
              onChange={(e) => setForm({ ...form, channelName: e.target.value })}
              placeholder="Enter channel name"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell viewers about your channel"
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",  /* allow vertical resize only */
                lineHeight: "1.5",
              }}
            />
          </div>

          {/* Banner URL */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Channel Banner URL</label>
            <input
              type="text"
              value={form.channelBanner}
              onChange={(e) => setForm({ ...form, channelBanner: e.target.value })}
              placeholder="https://example.com/banner.jpg"
              style={inputStyle}
            />
            {/* Preview banner if URL is provided */}
            {form.channelBanner && (
              <img
                src={form.channelBanner}
                alt="Banner preview"
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginTop: "8px",
                }}
              />
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid #303030",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontWeight: "bold",
              }}
            >
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#aaa",
  fontSize: "14px",
};

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