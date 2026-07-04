import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?search=${query}`);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      height: "56px",
      backgroundColor: "#0f0f0f",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      gap: "8px",
    }}>

      {/* ── LEFT: Hamburger + Logo ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: "fit-content" }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          ☰
        </button>

        {/* YouTube Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
          }}
        >
          {/* Red play button */}
          <div style={{
            backgroundColor: "#ff0000",
            borderRadius: "6px",
            width: "34px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "10px solid white",
              marginLeft: "2px",
            }} />
          </div>
          <span style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: "-0.5px",
          }}>
            YouTube
          </span>
        </div>
      </div>

      {/* ── MIDDLE: Search bar ── */}
      <div
        className="header-search"
        style={{
          flex: 1,
          maxWidth: "600px",
          display: "flex",
          gap: "8px",
        }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex", flex: 1 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              padding: "8px 16px",
              backgroundColor: "#121212",
              border: "1px solid #303030",
              borderRight: "none",
              borderRadius: "40px 0 0 40px",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = "#1c62b9"}
            onBlur={(e) => e.target.style.borderColor = "#303030"}
          />
          <button
            type="submit"
            style={{
              padding: "8px 20px",
              backgroundColor: "#272727",
              border: "1px solid #303030",
              borderLeft: "none",
              borderRadius: "0 40px 40px 0",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#272727"}
          >
            🔍
          </button>
        </form>

        {/* Mic button */}
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#272727",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#272727"}
        >
          🎤
        </button>
      </div>

      {/* ── RIGHT: Actions + User ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: "fit-content",
      }}>
        {user ? (
          <>
            {/* Upload/Create button */}
            <button
              onClick={() => navigate("/upload")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span style={{ fontSize: "18px" }}>＋</span> Create
            </button>

            {/* Notification bell */}
            <button
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              🔔
            </button>

            {/* User avatar + dropdown */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#ff0000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>

              {/* Dropdown menu */}
              {showDropdown && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  backgroundColor: "#212121",
                  border: "1px solid #303030",
                  borderRadius: "12px",
                  width: "220px",
                  zIndex: 100,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}>

                  {/* User info at top */}
                  <div style={{
                    padding: "16px",
                    borderBottom: "1px solid #303030",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#ff0000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}>
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ color: "white", fontSize: "14px", fontWeight: "500", margin: 0 }}>
                        {user.username}
                      </p>
                      <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    {
                      icon: "📺",
                      label: "Your channel",
                      action: () => { navigate("/channel/mine"); setShowDropdown(false); }
                    },
                    {
                      icon: "➕",
                      label: "Create channel",
                      action: () => { navigate("/create-channel"); setShowDropdown(false); }
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      onClick={item.action}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "14px",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}

                  {/* Sign out */}
                  <div style={{ borderTop: "1px solid #303030" }}>
                    <div
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "14px",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <span>🚪</span>
                      <span>Sign out</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </>
        ) : (
          /* Sign in button — shown when not logged in */
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              backgroundColor: "transparent",
              border: "1px solid #3ea6ff",
              borderRadius: "20px",
              color: "#3ea6ff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#263850"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <span>👤</span> Sign in
          </button>
        )}
      </div>
    </header>
  );
}