import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getAllVideos } from "../../services/videoApi";
import VideoCard from "../../components/VideoCard/VideoCard";
import "./Home.css";

function Home() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get("query") || "";

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        if (!queryParam) {
            setFilteredVideos(videos);
        } else {
            const queryLower = queryParam.toLowerCase();
            setFilteredVideos(
                videos.filter(
                    (v) =>
                        v.title?.toLowerCase().includes(queryLower) ||
                        v.description?.toLowerCase().includes(queryLower) ||
                        v.owner?.username?.toLowerCase().includes(queryLower)
                )
            );
        }
    }, [queryParam, videos]);

    async function fetchVideos() {
        setLoading(true);
        try {
            const response = await getAllVideos();
            if (response && response.data) {
                setVideos(response.data);
                setFilteredVideos(response.data);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredVideos(videos);
        } else {
            const queryLower = searchTerm.toLowerCase();
            setFilteredVideos(
                videos.filter(
                    (v) =>
                        v.title?.toLowerCase().includes(queryLower) ||
                        v.description?.toLowerCase().includes(queryLower) ||
                        v.owner?.username?.toLowerCase().includes(queryLower)
                )
            );
        }
    };

    return (
        <Layout onSearch={handleSearch} onUploadSuccess={fetchVideos}>
            <div className="home-header">
                <h2>{queryParam ? `Search Results for "${queryParam}"` : "Recommended Videos"}</h2>
                <span className="video-count">{filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"}</span>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                    <h3>Loading videos...</h3>
                </div>
            ) : filteredVideos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                    <h3>No videos found</h3>
                    <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                        {queryParam ? "Try searching for something else" : "Upload a video using the + Upload button to get started!"}
                    </p>
                </div>
            ) : (
                <div className="home-container">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </Layout>
    );
}

export default Home;