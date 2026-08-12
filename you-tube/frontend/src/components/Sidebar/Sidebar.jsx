import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSubscribedChannels } from "../../services/subscriptionApi";
import "./Sidebar.css";

function Sidebar({ onOpenUpload }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [subscribedChannels, setSubscribedChannels] = useState([]);

    useEffect(() => {
        if (user?._id) {
            fetchSubscribedChannels();
        } else {
            setSubscribedChannels([]);
        }
    }, [user, location.pathname]);

    async function fetchSubscribedChannels() {
        try {
            const res = await getSubscribedChannels(user._id);
            if (res && res.data) {
                setSubscribedChannels(res.data);
            }
        } catch (error) {
            console.error("Error fetching sidebar subscriptions:", error);
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar-menu">
                <div
                    className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`}
                    onClick={() => navigate("/")}
                >
                    🏠 Home
                </div>

                <div
                    className={`sidebar-item ${location.pathname === "/subscriptions" ? "active" : ""}`}
                    onClick={() => {
                        if (!user) navigate("/login");
                        else navigate("/subscriptions");
                    }}
                >
                    📺 Subscriptions
                </div>

                <div
                    className={`sidebar-item ${location.pathname === "/history" ? "active" : ""}`}
                    onClick={() => {
                        if (!user) navigate("/login");
                        else navigate("/history");
                    }}
                >
                    📜 History
                </div>

                <div
                    className={`sidebar-item ${location.pathname === "/playlists" ? "active" : ""}`}
                    onClick={() => {
                        if (!user) navigate("/login");
                        else navigate("/playlists");
                    }}
                >
                    📂 Playlists
                </div>

                <div
                    className={`sidebar-item ${location.pathname === "/tweets" ? "active" : ""}`}
                    onClick={() => {
                        if (!user) navigate("/login");
                        else navigate("/tweets");
                    }}
                >
                    🐦 Tweets
                </div>

                <div
                    className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}
                    onClick={() => {
                        if (!user) navigate("/login");
                        else navigate("/dashboard");
                    }}
                >
                    📊 Dashboard
                </div>

                <div
                    className={`sidebar-item ${location.pathname === "/profile" ? "active" : ""}`}
                    onClick={() => {
                        if (!user) navigate("/login");
                        else navigate("/profile");
                    }}
                >
                    👤 My Profile
                </div>


                <div
                    className="sidebar-item upload-item"
                    onClick={() => {
                        if (!user) {
                            navigate("/login");
                        } else if (onOpenUpload) {
                            onOpenUpload();
                        }
                    }}
                >
                    ⬆ Upload Video
                </div>
            </div>

            {/* Authentic YouTube Sidebar Subscriptions List */}
            {user && subscribedChannels.length > 0 && (
                <div className="sidebar-subscriptions-section">
                    <div className="sidebar-divider" />
                    <div
                        className="sidebar-section-title"
                        onClick={() => navigate("/subscriptions")}
                    >
                        <span>Subscriptions</span>
                    </div>

                    <div className="sidebar-channels-list">
                        {subscribedChannels.map((item) => {
                            const ch = item.channel;
                            if (!ch) return null;

                            return (
                                <div
                                    key={ch._id || ch.username}
                                    className="sidebar-channel-item"
                                    onClick={() => navigate(`/subscriptions?channel=${ch.username}`)}
                                    title={`@${ch.username}`}
                                >
                                    {ch.avatar ? (
                                        <img src={ch.avatar} alt={ch.username} className="sidebar-channel-avatar" />
                                    ) : (
                                        <div className="sidebar-channel-placeholder">
                                            {(ch.username || "C")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className="sidebar-channel-name">{ch.username}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;