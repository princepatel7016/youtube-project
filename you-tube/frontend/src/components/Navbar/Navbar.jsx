import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar({ onSearch, onOpenUpload }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            navigate(`/?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="icon">☰</div>
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <span className="youtube-badge">▶</span> YouTube
                    </div>
                </Link>
            </div>

            <form className="navbar-center" onSubmit={handleSearch}>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                    🔍
                </button>
            </form>

            <div className="navbar-right">
                {user ? (
                    <>
                        <button className="upload-nav-btn" onClick={onOpenUpload} title="Upload Video">
                            + Upload
                        </button>
                        <div
                            className="user-profile-menu"
                            onClick={() => navigate("/profile")}
                            style={{ cursor: "pointer" }}
                            title="View & Edit Account Profile"
                        >
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="user-avatar-img"
                            />
                            <span className="username-display">{user.username}</span>
                        </div>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="signin-nav-btn">
                        👤 Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;