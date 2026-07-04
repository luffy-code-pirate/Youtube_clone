import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isHome = location.pathname === "/";

  return (
    <aside
      className="sidebar"
      style={{
        width: "240px",
        minHeight: "calc(100vh - 56px)",
        backgroundColor: "#0f0f0f",
        overflowY: "auto",
        overflowX: "hidden",
        position: "sticky",
        top: "56px",
        height: "calc(100vh - 56px)",
        flexShrink: 0,
        paddingBottom: "24px",
      }}
    >
      {/* Main nav */}
      <SidebarItem icon={<HomeIcon />} label="Home" active={isHome} onClick={() => navigate("/")} />
      <SidebarItem icon={<ShortsIcon />} label="Shorts" onClick={() => navigate("/")} />
      <SidebarItem icon={<SubIcon />} label="Subscriptions" onClick={() => navigate("/")} />

      <Divider />

      {/* You section */}
      <SectionTitle>
        You
        <svg viewBox="0 0 24 24" style={{ width: "18px", fill: "white", marginLeft: "4px" }}>
          <path d="M9.29 6.71a.996.996 0 000 1.41L13.17 12l-3.88 3.88a.996.996 0 101.41 1.41l4.59-4.59a.996.996 0 000-1.41L10.7 6.71a.996.996 0 00-1.41 0z"/>
        </svg>
      </SectionTitle>

      {user && (
        <>
          <SidebarItem icon={<HistoryIcon />} label="History" onClick={() => navigate("/")} />
          <SidebarItem icon={<VideosIcon />} label="Your videos" onClick={() => navigate("/channel/mine")} />
          <SidebarItem icon={<WatchLaterIcon />} label="Watch later" onClick={() => navigate("/")} />
          <SidebarItem icon={<LikedIcon />} label="Liked videos" onClick={() => navigate("/")} />
        </>
      )}

      {!user && (
        <div style={{ padding: "16px 24px" }}>
          <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
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
              borderRadius: "18px",
              color: "#3ea6ff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: "20px", fill: "#3ea6ff" }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Sign in
          </button>
        </div>
      )}

      <Divider />

      {/* Explore */}
      <SectionTitle>Explore</SectionTitle>
      <SidebarItem icon={<TrendingIcon />} label="Trending" onClick={() => navigate("/")} />
      <SidebarItem icon={<ShoppingIcon />} label="Shopping" onClick={() => navigate("/")} />
      <SidebarItem icon={<MusicIcon />} label="Music" onClick={() => navigate("/?category=Music")} />
      <SidebarItem icon={<MoviesIcon />} label="Movies" onClick={() => navigate("/")} />
      <SidebarItem icon={<LiveIcon />} label="Live" onClick={() => navigate("/")} />
      <SidebarItem icon={<GamingIcon />} label="Gaming" onClick={() => navigate("/?category=Gaming")} />
      <SidebarItem icon={<NewsIcon />} label="News" onClick={() => navigate("/?category=News")} />
      <SidebarItem icon={<SportsIcon />} label="Sports" onClick={() => navigate("/")} />
      <SidebarItem icon={<CoursesIcon />} label="Courses" onClick={() => navigate("/?category=Education")} />

      {user && (
        <>
          <Divider />
          <SidebarItem
            icon={<span style={{ fontSize: "20px" }}>➕</span>}
            label="Create channel"
            onClick={() => navigate("/create-channel")}
          />
        </>
      )}
    </aside>
  );
}

/* ── Sub-components ── */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "0 24px",
        height: "40px",
        cursor: "pointer",
        borderRadius: "10px",
        margin: "0 8px",
        backgroundColor: active ? "#272727" : "transparent",
        color: "white",
        fontSize: "14px",
        fontWeight: active ? "600" : "400",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#272727"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      <span style={{ width: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </span>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {label}
      </span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "6px 24px",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      marginBottom: "4px",
    }}>
      {children}
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

/* ── SVG Icons (matching YouTube exactly) ── */
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}
function ShortsIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25l1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.07-2.04 2-3.49-.07-1.42-.93-2.68-2.24-3.25zM10 14.65v-5.3L15 12l-5 2.65z"/>
    </svg>
  );
}
function SubIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M10 18v-2h4v2h-4zm-4-4v-2h12v2H6zm-2-4V8h16v2H4z"/>
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </svg>
  );
}
function VideosIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
    </svg>
  );
}
function WatchLaterIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
    </svg>
  );
}
function LikedIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
    </svg>
  );
}
function TrendingIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66C13.3 7.26 13 4.85 13.91 3c-.91.23-1.75.75-2.45 1.32C8.9 6.4 8.02 9.86 9.07 12.73c.03.1.06.2.06.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12-.06-.05-.1-.1-.15-.17-1.09-1.4-1.28-3.37-.53-4.96C5.87 9.64 5 11.47 5 13c0 2.77 1.86 5.1 4.43 5.79l.38.09c.32.06.65.1.99.1C13.76 19 16 16.78 16 14c0-.95-.3-1.85-.73-2.66l.26.08v-.22z"/>
    </svg>
  );
}
function ShoppingIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M19 7h-3V6c0-1.7-1.3-3-3-3S10 4.3 10 6v1H7L6 21h12l1-14zm-7-1c.6 0 1 .4 1 1v1h-2V6c0-.6.4-1 1-1zm4 7h-2v2h-2v-2H10v-2h2v-2h2v2h2v2z"/>
    </svg>
  );
}
function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );
}
function MoviesIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
    </svg>
  );
}
function LiveIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M1.56 3.83L3 5.27C1.14 7.13.04 9.69.04 12.5s1.1 5.37 2.96 7.23l-1.44 1.44C-.48 19.09-1.96 15.96-1.96 12.5c0-3.46 1.48-6.59 3.52-8.67zm20.88 0C24.48 5.91 25.96 9.04 25.96 12.5s-1.48 6.59-3.52 8.67l-1.44-1.44C22.86 17.87 23.96 15.31 23.96 12.5s-1.1-5.37-2.96-7.23l1.44-1.44zM5.42 7.25l1.45 1.45C5.63 9.93 5 11.16 5 12.5c0 1.34.63 2.57 1.87 3.8l-1.45 1.45C3.81 16.14 3 14.38 3 12.5c0-1.88.81-3.64 2.42-5.25zm13.16 0C20.19 8.86 21 10.62 21 12.5c0 1.88-.81 3.64-2.42 5.25l-1.45-1.45C18.37 15.07 19 13.84 19 12.5c0-1.34-.63-2.57-1.87-3.8l1.45-1.45zM12 9c-1.93 0-3.5 1.57-3.5 3.5S10.07 16 12 16s3.5-1.57 3.5-3.5S13.93 9 12 9z"/>
    </svg>
  );
}
function GamingIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
    </svg>
  );
}
function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z"/>
    </svg>
  );
}
function SportsIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.23 15.39L12 15.45l-3.22 1.94.85-3.66-2.84-2.46 3.74-.32L12 7.5l1.47 3.45 3.74.32-2.84 2.46.85 3.66z"/>
    </svg>
  );
}
function CoursesIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "24px", fill: "white" }}>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    </svg>
  );
}