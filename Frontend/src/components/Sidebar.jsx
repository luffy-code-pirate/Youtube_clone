import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const mainItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "▶️", label: "Shorts", path: "/" },
    { icon: "📺", label: "Subscriptions", path: "/" },
  ];

  const userItems = [
    { icon: "🕐", label: "History", path: "/" },
    { icon: "🎬", label: "Your videos", path: "/channel/mine" },
    { icon: "⏰", label: "Watch later", path: "/" },
    { icon: "👍", label: "Liked videos", path: "/" },
  ];

  const exploreItems = [
    { icon: "🔥", label: "Trending", path: "/" },
    { icon: "🛒", label: "Shopping", path: "/" },
    { icon: "🎵", label: "Music", path: "/?category=Music" },
    { icon: "🎬", label: "Movies", path: "/" },
    { icon: "📡", label: "Live", path: "/" },
    { icon: "🎮", label: "Gaming", path: "/?category=Gaming" },
    { icon: "📰", label: "News", path: "/?category=News" },
    { icon: "🏆", label: "Sports", path: "/" },
    { icon: "🎓", label: "Courses", path: "/?category=Education" },
  ];

  return (
    <aside
      className="sidebar"
      style={{
        width: "240px",
        minHeight: "calc(100vh - 56px)",
        backgroundColor: "#0f0f0f",
        padding: "12px 0",
        overflowY: "auto",
        position: "sticky",
        top: "56px",
        height: "calc(100vh - 56px)",
        flexShrink: 0,
      }}
    >
      {/* Main nav */}
      {mainItems.map((item) => (
        <SidebarItem
          key={item.label}
          item={item}
          navigate={navigate}
          active={location.pathname === item.path}
        />
      ))}

      <Divider />

      {/* You section */}
      {user && (
        <>
          <p style={{
            padding: "8px 24px",
            color: "white",
            fontSize: "15px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}>
            You <span style={{ fontSize: "12px" }}>›</span>
          </p>
          {userItems.map((item) => (
            <SidebarItem key={item.label} item={item} navigate={navigate} />
          ))}
          <Divider />
        </>
      )}

      {/* Explore section */}
      <p style={{
        padding: "8px 24px",
        color: "white",
        fontSize: "15px",
        fontWeight: "600",
      }}>
        Explore
      </p>

      {exploreItems.map((item) => (
        <SidebarItem key={item.label} item={item} navigate={navigate} />
      ))}

      <Divider />

      {/* Create channel */}
      {user && (
        <SidebarItem
          item={{ icon: "➕", label: "Create Channel", path: "/create-channel" }}
          navigate={navigate}
        />
      )}

      {!user && (
        <div style={{ padding: "16px 24px" }}>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "12px", lineHeight: "1.5" }}>
            Sign in to like videos, comment, and subscribe.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "1px solid #3ea6ff",
              borderRadius: "20px",
              color: "#3ea6ff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            👤 Sign in
          </button>
        </div>
      )}
    </aside>
  );
}

function SidebarItem({ item, navigate, active }) {
  return (
    <div
      onClick={() => navigate(item.path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "10px 24px",
        cursor: "pointer",
        borderRadius: "10px",
        margin: "0 8px",
        backgroundColor: active ? "#272727" : "transparent",
        color: "white",
        fontSize: "14px",
        fontWeight: active ? "600" : "400",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "#272727";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span style={{ fontSize: "20px", minWidth: "24px", textAlign: "center" }}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </div>
  );
}

function Divider() {
  return (
    <hr style={{
      border: "none",
      borderTop: "1px solid #272727",
      margin: "12px 0",
    }} />
  );
}