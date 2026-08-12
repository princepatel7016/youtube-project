import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { getChannelStatsApi, getChannelVideosApi } from "../../services/dashboardApi";
import "./Dashboard.css";

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0,
    });
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchDashboardData();
    }, [user]);

    async function fetchDashboardData() {
        setLoading(true);
        setError("");
        try {
            const [statsRes, videosRes] = await Promise.all([
                getChannelStatsApi(),
                getChannelVideosApi(),
            ]);

            if (statsRes?.data) {
                setStats({
                    totalVideos: statsRes.data.totalVideos || 0,
                    totalViews: statsRes.data.totalViews || 0,
                    totalLikes: statsRes.data.totalLikes || 0,
                });
            }

            if (videosRes?.data) {
                setVideos(videosRes.data);
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            setError(err.response?.data?.message || "Failed to load channel dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <Layout onUploadSuccess={fetchDashboardData}>
            <div className="dashboard-page">
                {/* Creator Banner */}
                <div className="dashboard-banner">
                    <div className="creator-profile-info">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.username} className="creator-avatar" />
                        ) : (
                            <div className="creator-avatar-placeholder">
                                {(user?.username || "C")[0].toUpperCase()}
                            </div>
                        )}
                        <div className="creator-details">
                            <h2>Welcome back, {user?.fullname || user?.username}! 👋</h2>
                            <p className="creator-handle">@{user?.username} • YouTube Creator Studio</p>
                        </div>
                    </div>
                </div>

                {error && <div className="dashboard-alert error">{error}</div>}

                {/* Stat Cards Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper videos-icon">📹</div>
                        <div className="stat-info">
                            <span className="stat-title">Total Videos</span>
                            <h3 className="stat-value">{stats.totalVideos}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper views-icon">👁️</div>
                        <div className="stat-info">
                            <span className="stat-title">Total Views</span>
                            <h3 className="stat-value">{stats.totalViews.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper likes-icon">❤️</div>
                        <div className="stat-info">
                            <span className="stat-title">Total Likes</span>
                            <h3 className="stat-value">{stats.totalLikes.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="dashboard-content-section">
                    <div className="content-header">
                        <h3>Uploaded Videos ({videos.length})</h3>
                        <p>Manage your channel uploads and track performance.</p>
                    </div>

                    {loading ? (
                        <div className="dashboard-loading">
                            <div className="dash-spinner"></div>
                            <p>Loading channel statistics & videos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="dashboard-empty-state">
                            <div className="empty-dash-icon">🎬</div>
                            <h3>No Videos Uploaded Yet</h3>
                            <p>Start your creator journey by uploading your first video.</p>
                        </div>
                    ) : (
                        <div className="videos-table-container">
                            <table className="videos-table">
                                <thead>
                                    <tr>
                                        <th>Video</th>
                                        <th>Status</th>
                                        <th>Uploaded Date</th>
                                        <th>Views</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((vid) => (
                                        <tr key={vid._id}>
                                            <td className="video-cell">
                                                <div
                                                    className="table-thumb-wrapper"
                                                    onClick={() => navigate(`/watch/${vid._id}`)}
                                                >
                                                    <img
                                                        src={vid.thumbnail}
                                                        alt={vid.title}
                                                        className="table-thumb"
                                                    />
                                                    {vid.duration && (
                                                        <span className="table-duration">
                                                            {formatDuration(vid.duration)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="table-video-info">
                                                    <h4
                                                        className="table-video-title"
                                                        onClick={() => navigate(`/watch/${vid._id}`)}
                                                    >
                                                        {vid.title}
                                                    </h4>
                                                    <p className="table-video-desc">
                                                        {vid.description
                                                            ? vid.description.substring(0, 60) + "..."
                                                            : "No description"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        vid.isPublished !== false ? "published" : "draft"
                                                    }`}
                                                >
                                                    {vid.isPublished !== false ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="date-cell">{formatDate(vid.createdAt)}</td>
                                            <td className="views-cell">
                                                👁️ {vid.views ? vid.views.toLocaleString() : 0}
                                            </td>
                                            <td>
                                                <button
                                                    className="dash-action-btn view-btn"
                                                    onClick={() => navigate(`/watch/${vid._id}`)}
                                                    title="Watch Video"
                                                >
                                                    ▶ Watch
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
