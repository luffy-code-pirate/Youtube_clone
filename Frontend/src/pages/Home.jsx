import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

// These are the filter buttons shown at the top
// PDF requires at least 6 categories
const CATEGORIES = [
  "All",
  "Web Development",
  "JavaScript",
  "Data Structures",
  "Music",
  "Gaming",
  "Education",
  "News",
];

export default function Home() {
  const [videos, setVideos] = useState([]);       // stores fetched videos
  const [category, setCategory] = useState("All"); // active filter button
  const [loading, setLoading] = useState(true);   // shows loading state

  // useSearchParams reads the URL query string
  // e.g. /?search=react → search = "react"
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || ""; // "" if no search param

  // Fetch videos whenever search term or category changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Pass search and category as query params to the backend
        // Backend filters based on these values
        const res = await api.get("/videos", {
          params: { search, category },
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [search, category]); // re-runs when either of these change

  return (
    <div>
      {/* ── Filter buttons row ── */}
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",       /* wrap to next line on small screens */
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #272727",
        overflowX: "auto",      /* horizontal scroll on mobile */
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: "14px",
              // Active filter is highlighted, others are dark
              backgroundColor: category === cat ? "#ffffff" : "#272727",
              color: category === cat ? "#000000" : "#ffffff",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Search result label ── */}
      {search && (
        <p style={{ color: "#aaa", marginBottom: "16px" }}>
          Search results for: <strong style={{ color: "white" }}>"{search}"</strong>
        </p>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>
          Loading videos...
        </p>
      )}

      {/* ── No videos found ── */}
      {!loading && videos.length === 0 && (
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>
          No videos found. Upload some videos to get started!
        </p>
      )}

      {/* ── Video grid ── */}
      {!loading && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",   /* cards wrap to next row when no space */
          gap: "20px",
        }}>
          {videos.map((video) => (
            // Each VideoCard gets one video object
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}