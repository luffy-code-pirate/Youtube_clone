import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// toggleSidebar comes from App.jsx — clicking hamburger calls it
export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth(); // get logged in user and logout function
  const navigate = useNavigate();     // used to programmatically change pages
  const [query, setQuery] = useState(""); // tracks what user types in search bar

  // When user submits search form
  const handleSearch = (e) => {
    e.preventDefault(); // stop page from refreshing
    // Navigate to home page with search term in the URL
    // e.g. /?search=react  — Home page reads this and filters videos
    navigate(`/?search=${query}`);
  };

  const handleLogout = () => {
    logout();       // clears localStorage and user state
    navigate("/");  // send them back to home
  };

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      padding: "10px 16px",
      backgroundColor: "#0f0f0f",
      borderBottom: "1px solid #272727",
      position: "sticky",  /* stays at top when scrolling */
      top: 0,
      zIndex: 100,         /* sits above other content */
      gap: "10px",
    }}>

      {/* ── LEFT: Hamburger + Logo ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Hamburger button — toggles sidebar in App.jsx */}
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Logo — clicking it goes to home page */}
        <h2
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", color: "white", whiteSpace: "nowrap" }}
        >
          📺 YouTube
        </h2>
      </div>

      {/* ── MIDDLE: Search bar ── */}
      <form
        onSubmit={handleSearch}
        style={{ flex: 1, display: "flex", gap: "8px", maxWidth: "600px", margin: "0 auto" }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "20px 0 0 20px",
            border: "1px solid #303030",
            backgroundColor: "#121212",
            color: "white",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "0 20px 20px 0",
            border: "1px solid #303030",
            backgroundColor: "#272727",
            color: "white",
            cursor: "pointer",
          }}
        >
          🔍
        </button>
      </form>

      {/* ── RIGHT: Auth buttons or user info ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        {user ? (
          // User IS logged in — show their name + action buttons
          <>
            {/* Clicking upload checks if they have a channel */}
            <button
              onClick={() => navigate("/upload")}
              style={btnStyle}
            >
              + Upload
            </button>

            {/* View their own channel */}
            <button
              onClick={() => navigate("/channel/mine")}
              style={btnStyle}
            >
              My Channel
            </button>

            {/* Show username */}
            <span style={{ color: "#aaa" }}>👤 {user.username}</span>

            <button onClick={handleLogout} style={btnStyle}>
              Logout
            </button>
          </>
        ) : (
          // User is NOT logged in — show Sign In button
          <button
            onClick={() => navigate("/login")}
            style={{
              ...btnStyle,
              border: "1px solid #3ea6ff",
              color: "#3ea6ff",
            }}
          >
            👤 Sign In
          </button>
        )}
      </div>
    </header>
  );
}

// Reusable button style object to avoid repetition
const btnStyle = {
  padding: "6px 12px",
  borderRadius: "4px",
  border: "1px solid #303030",
  backgroundColor: "transparent",
  color: "white",
  cursor: "pointer",
};