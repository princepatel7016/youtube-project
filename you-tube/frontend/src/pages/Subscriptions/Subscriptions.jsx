import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { getSubscribedChannels } from "../../services/subscriptionApi";
import { getAllVideos } from "../../services/videoApi";
import { useAuth } from "../../context/AuthContext";
import "./Subscriptions.css";

function Subscriptions() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedChannel = searchParams.get("channel") || "";

    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchData();
    }, [user, selectedChannel]);

    async function fetchData() {
        setLoading(true);
        try {
            const [subsRes, videosRes] = await Promise.all([
                getSubscribedChannels(user._id),
                getAllVideos()
            ]);

            const subs = subsRes?.data || [];
            const allVids = videosRes?.data || [];

            setSubscribedChannels(subs);
            setVideos(allVids);

            // Get usernames of subscribed channels
            const subscribedUsernames = subs.map(item => item.channel?.username?.toLowerCase()).filter(Boolean);

            let result = [];
            if (selectedChannel) {
                const targetLower = selectedChannel.toLowerCase();
                result = allVids.filter(v => v.owner?.username?.toLowerCase() === targetLower);
            } else {
                result = allVids.filter(v => 
                    subscribedUsernames.includes(v.owner?.username?.toLowerCase())
                );
            }

            setFilteredVideos(result);
        } catch (error) {
            console.error("Error fetching subscriptions data:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="subscriptions-page">
                {/* Header */}
                <div className="subs-header">
                    <h2>Latest Videos from Subscriptions</h2>
                </div>

                {/* Subscribed Channels Bar */}
                {subscribedChannels.length > 0 && (
                    <div className="subs-channels-bar">
                        <div
                            className={`subs-channel-chip ${!selectedChannel ? "active" : ""}`}
                            onClick={() => setSearchParams({})}
                        >
                            <div className="all-channels-avatar">🌐</div>
                            <span>All</span>
                        </div>

                        {subscribedChannels.map((item) => {
                            const ch = item.channel;
                            if (!ch) return null;
                            const isSelected = selectedChannel.toLowerCase() === ch.username?.toLowerCase();

                            return (
                                <div
                                    key={ch._id || ch.username}
                                    className={`subs-channel-chip ${isSelected ? "active" : ""}`}
                                    onClick={() => setSearchParams({ channel: ch.username })}
                                >
                                    {ch.avatar ? (
                                        <img src={ch.avatar} alt={ch.username} className="subs-chip-avatar" />
                                    ) : (
                                        <div className="subs-chip-placeholder">
                                            {(ch.username || "C")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span>{ch.username}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main Content Grid */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                        <h3>Loading subscription videos...</h3>
                    </div>
                ) : subscribedChannels.length === 0 ? (
                    <div className="subs-empty-state">
                        <div className="empty-icon">📺</div>
                        <h3>Don't miss new videos</h3>
                        <p>Subscribe to your favorite channels to see their latest videos here.</p>
                        <button className="explore-btn" onClick={() => navigate("/")}>
                            Explore Videos
                        </button>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <div className="subs-empty-state">
                        <h3>No recent videos found</h3>
                        <p>
                            {selectedChannel
                                ? `No videos uploaded by @${selectedChannel} yet.`
                                : "Your subscribed channels haven't uploaded any videos yet."}
                        </p>
                        {selectedChannel && (
                            <button className="explore-btn" onClick={() => setSearchParams({})}>
                                Show All Subscriptions
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="home-container">
                        {filteredVideos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Subscriptions;
