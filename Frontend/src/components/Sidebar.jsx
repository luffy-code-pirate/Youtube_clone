import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Main navigation items (always visible)
  const mainItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "🔥", label: "Trending", path: "/" },
    { icon: "📺", label: "Subscriptions", path: "/" },
  ];

  // Items only relevant when logged in
  const userItems = [
    { icon: "🕐", label: "History", path: "/" },
    { icon: "▶️", label: "Your Videos", path: "/channel/mine" },
    { icon: "👍", label: "Liked Videos", path: "/" },
  ];

  // Explore section
  const exploreItems = [
    { icon: "🎵", label: "Music", path: "/?category=Music" },
    { icon: "🎮", label: "Gaming", path: "/?category=Gaming" },
    { icon: "📰", label: "News", path: "/?category=News" },
    { icon: "🎓", label: "Education", path: "/?category=Education" },
  ];

  return (
    <aside style={{
      width: "220px",
      minHeight: "calc(100vh - 57px)", /* full height minus header */
      backgroundColor: "#0f0f0f",
      padding: "12px 0",
      borderRight: "1px solid #272727",
      overflowY: "auto",
    }}>

      {/* Main navigation */}
      {mainItems.map((item) => (
        <SidebarItem key={item.label} item={item} navigate={navigate} />
      ))}

      <Divider />

      {/* User-specific items */}
      {user && (
        <>
          {userItems.map((item) => (
            <SidebarItem key={item.label} item={item} navigate={navigate} />
          ))}
          <Divider />
        </>
      )}

      {/* Explore section header */}
      <p style={{ padding: "8px 16px", color: "#aaa", fontSize: "14px", fontWeight: "bold" }}>
        Explore
      </p>

      {exploreItems.map((item) => (
        <SidebarItem key={item.label} item={item} navigate={navigate} />
      ))}

      <Divider />

      {/* Create channel button — only if logged in */}
      {user && (
        <SidebarItem
          item={{ icon: "➕", label: "Create Channel", path: "/create-channel" }}
          navigate={navigate}
        />
      )}
    </aside>
  );
}

// Reusable single sidebar row
function SidebarItem({ item, navigate }) {
  return (
    <div
      onClick={() => navigate(item.path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "10px 16px",
        cursor: "pointer",
        borderRadius: "8px",
        margin: "0 8px",
        color: "white",
      }}
      // Hover effect using inline event handlers
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <span style={{ fontSize: "18px" }}>{item.icon}</span>
      <span style={{ fontSize: "14px" }}>{item.label}</span>
    </div>
  );
}

// Simple horizontal line between sections
function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #272727", margin: "8px 0" }} />;
}