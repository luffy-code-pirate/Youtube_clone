import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";

export default function Subscriptions() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to login if not logged in
    if (!user) return navigate("/login");

    const fetch = async () => {
      try {
        const res = await api.get("/videos/subscriptions");
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return (
    <div>
      {/* Page header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid #272727",
      }}>
        <span style={{ fontSize: "28px" }}>📺</span>
        <div>
          <h1 style={{ color: "white", fontSize: "20px", fontWeight: "600" }}>
            Subscriptions
          </h1>
          <p style={{ color: "#aaa", fontSize: "14px", marginTop: "2px" }}>
            Latest from your subscribed channels
          </p>
        </div>
      </div>

      {loading && (
        <p style={{ color: "#aaa", textAlign: "center", padding: "60px" }}>
          Loading...
        </p>
      )}

      {!loading && videos.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "white", fontSize: "16px", marginBottom: "8px" }}>
            No videos from subscriptions
          </p>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>
            Subscribe to channels to see their videos here
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0 20px",
              height: "36px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "18px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Browse videos
          </button>
        </div>
      )}

      {/* Subscription videos grid */}
      {!loading && videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}