import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { getWatchHistory } from "../../services/userApi";
import { useAuth } from "../../context/AuthContext";
import "./History.css";

function History() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [historyVideos, setHistoryVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchHistory();
    }, [user]);

    async function fetchHistory() {
        setLoading(true);
        try {
            let apiHistory = [];
            try {
                const res = await getWatchHistory();
                apiHistory = res?.data || [];
            } catch (err) {
                console.log("Backend watch history response:", err);
            }

            // Read local storage history as fallback/supplement
            let localHistory = [];
            try {
                localHistory = JSON.parse(localStorage.getItem("yt_watch_history") || "[]");
            } catch (e) {
                console.error("Error reading local history:", e);
            }

            // Combine API history and Local history (avoid duplicates)
            const combinedMap = new Map();
            
            // Add API history first
            apiHistory.forEach(v => {
                if (v && v._id) combinedMap.set(v._id, v);
            });

            // Add local history
            localHistory.forEach(v => {
                if (v && v._id && !combinedMap.has(v._id)) {
                    combinedMap.set(v._id, v);
                }
            });

            setHistoryVideos(Array.from(combinedMap.values()));
        } catch (error) {
            console.error("Error fetching watch history:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleClearHistory() {
        if (window.confirm("Are you sure you want to clear your watch history?")) {
            localStorage.removeItem("yt_watch_history");
            setHistoryVideos([]);
        }
    }

    return (
        <Layout>
            <div className="history-page">
                <div className="history-header">
                    <div>
                        <h2>📜 Watch History</h2>
                        <p>Videos you have watched while logged in.</p>
                    </div>
                    {historyVideos.length > 0 && (
                        <button className="clear-history-btn" onClick={handleClearHistory}>
                            🗑️ Clear Watch History
                        </button>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                        <h3>Loading watch history...</h3>
                    </div>
                ) : historyVideos.length === 0 ? (
                    <div className="history-empty-state">
                        <div className="empty-icon">📜</div>
                        <h3>No Watch History Yet</h3>
                        <p>Videos you watch will show up here so you can easily find them again.</p>
                        <button className="explore-btn" onClick={() => navigate("/")}>
                            Explore Videos
                        </button>
                    </div>
                ) : (
                    <div className="home-container">
                        {historyVideos.map((video) => (
                            <VideoCard key={video._id || Math.random()} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default History;
