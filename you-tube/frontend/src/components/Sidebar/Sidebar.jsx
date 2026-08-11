import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

function Sidebar({ onOpenUpload }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    return (
        <div className="sidebar">
            <div className="sidebar-menu">
                <div
                    className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`}
                    onClick={() => navigate("/")}
                >
                    🏠 Home
                </div>

                <div className="sidebar-item" onClick={() => navigate("/")}>
                    🔥 Trending
                </div>

                <div
                    className="sidebar-item"
                    onClick={() => {
                        if (!user) navigate("/login");
                    }}
                >
                    📺 Subscriptions
                </div>

                <div
                    className="sidebar-item"
                    onClick={() => {
                        if (!user) navigate("/login");
                    }}
                >
                    📜 History
                </div>

                <div
                    className="sidebar-item"
                    onClick={() => {
                        if (!user) navigate("/login");
                    }}
                >
                    👍 Liked Videos
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
                    className="sidebar-item"
                    onClick={() => {
                        if (!user) navigate("/login");
                    }}
                >
                    📂 Playlists
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
        </div>
    );
}

export default Sidebar;