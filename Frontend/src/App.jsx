import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Layout components — visible on every page
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages — each one maps to a URL route below
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";

function App() {
  // Tracks whether the sidebar is open or closed
  // Toggled by the hamburger button in the Header
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      {/* Header is always visible at the top */}
      {/* We pass a function so Header can toggle the sidebar */}
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar + page content sit side by side */}
      <div style={{ display: "flex" }}>

        {/* Sidebar only renders when sidebarOpen is true */}
        {sidebarOpen && <Sidebar />}

        {/* Main content area — takes up remaining width */}
        <div style={{ flex: 1, padding: "16px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel/mine" element={<Channel />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/create-channel" element={<CreateChannel />} />
            <Route path="/upload" element={<UploadVideo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;