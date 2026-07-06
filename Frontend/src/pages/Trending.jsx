import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

export default function Trending() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/videos/trending");
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
        <span style={{ fontSize: "28px" }}>🔥</span>
        <h1 style={{ color: "white", fontSize: "20px", fontWeight: "600" }}>
          Trending
        </h1>
      </div>

      {loading && (
        <p style={{ color: "#aaa", textAlign: "center", padding: "60px" }}>
          Loading...
        </p>
      )}

      {!loading && videos.length === 0 && (
        <p style={{ color: "#aaa", textAlign: "center", padding: "60px" }}>
          No trending videos found.
        </p>
      )}

      {/* Video grid — sorted by most views */}
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