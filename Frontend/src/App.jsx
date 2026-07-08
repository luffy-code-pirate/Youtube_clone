import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import UploadVideo from "./pages/UploadVideo";
import Trending from "./pages/Trending";
import LikedVideos from "./pages/LikedVideos";
import Subscriptions from "./pages/Subscriptions";

function App() {
  // true = full sidebar, false = mini sidebar (icons only)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{
        backgroundColor: "#0f0f0f",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ color: "white", fontSize: "16px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: "flex" }}>
        {/* Pass sidebarOpen so Sidebar knows which mode to render */}
        <Sidebar isOpen={sidebarOpen} />

        <div
          className="main-content"
          style={{ flex: 1, padding: "16px", minHeight: "calc(100vh - 56px)" }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel/mine" element={<Channel />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/create-channel" element={<CreateChannel />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;