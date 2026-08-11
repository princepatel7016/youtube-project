import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import { updateAccountDetails, updateUserAvatar, updateUserCoverImage, changePassword, getUserChannelProfile } from "../../services/userApi";
import { getSubscribedChannels, toggleSubscription } from "../../services/subscriptionApi";
import "../Login/Login.css";
import "./Profile.css";

const Profile = () => {
    const { user, updateUser } = useAuth();

    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    // Subscription & Channel Profile State
    const [profileStats, setProfileStats] = useState(null);
    const [subscribedChannels, setSubscribedChannels] = useState([]);

    // Password State
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password Visibility Toggles
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [detailsMessage, setDetailsMessage] = useState("");
    const [detailsError, setDetailsError] = useState("");

    const [avatarMessage, setAvatarMessage] = useState("");
    const [avatarError, setAvatarError] = useState("");

    const [coverMessage, setCoverMessage] = useState("");
    const [coverError, setCoverError] = useState("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadingCover, setLoadingCover] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setUsername(user.username || "");
            if (user.username) {
                fetchProfileStats();
            }
            if (user._id) {
                fetchUserSubscriptions();
            }
        }
    }, [user]);

    async function fetchProfileStats() {
        try {
            const res = await getUserChannelProfile(user.username);
            if (res && res.data) {
                setProfileStats(res.data);
            }
        } catch (err) {
            console.error("Error fetching channel stats:", err);
        }
    }

    async function fetchUserSubscriptions() {
        try {
            const res = await getSubscribedChannels(user._id);
            if (res && res.data) {
                setSubscribedChannels(res.data);
            }
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
        }
    }

    async function handleUnsubscribeFromList(channelId) {
        try {
            await toggleSubscription(channelId);
            fetchUserSubscriptions();
            fetchProfileStats();
        } catch (err) {
            console.error("Error unsubscribing channel:", err);
        }
    }

    if (!user) {
        return (
            <Layout>
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <h2>Please sign in to view and edit your profile.</h2>
                </div>
            </Layout>
        );
    }

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setDetailsMessage("");
        setDetailsError("");

        if (!fullName.trim() || !username.trim()) {
            setDetailsError("Full Name and Username are required.");
            return;
        }

        setLoadingDetails(true);
        try {
            const res = await updateAccountDetails({ fullName, username });
            if (res && res.data) {
                updateUser(res.data);
                setDetailsMessage("Account details updated successfully!");
            }
        } catch (err) {
            console.error(err);
            setDetailsError(err.response?.data?.message || "Failed to update account details.");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleAvatarSelectAndUpload = async (file) => {
        if (!file) return;
        setAvatarMessage("");
        setAvatarError("");
        setLoadingAvatar(true);

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await updateUserAvatar(formData);
            if (res && res.data) {
                updateUser({ avatar: res.data.avatar });
                setAvatarMessage("Avatar updated successfully!");
                setAvatarFile(null);
            }
        } catch (err) {
            console.error(err);
            setAvatarError(err.response?.data?.message || "Failed to update avatar.");
        } finally {
            setLoadingAvatar(false);
        }
    };

    const handleCoverSelectAndUpload = async (file) => {
        if (!file) return;
        setCoverMessage("");
        setCoverError("");
        setLoadingCover(true);

        const formData = new FormData();
        formData.append("coverimage", file);

        try {
            const res = await updateUserCoverImage(formData);
            if (res && res.data) {
                updateUser({ coverimage: res.data.coverimage });
                setCoverMessage("Cover image updated successfully!");
                setCoverFile(null);
            }
        } catch (err) {
            console.error(err);
            setCoverError(err.response?.data?.message || "Failed to update cover image.");
        } finally {
            setLoadingCover(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("All password fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirm password do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters long.");
            return;
        }

        setLoadingPassword(true);
        try {
            const res = await changePassword({
                oldpassword: oldPassword,
                newpassword: newPassword,
            });

            if (res) {
                setPasswordMessage("Password changed successfully!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            console.error(err);
            setPasswordError(err.response?.data?.message || "Failed to change password. Check old password.");
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <Layout>
            <div className="profile-container">
                {/* Header Banner & Avatar */}
                <div className="profile-header-card">
                    <div className="cover-banner">
                        {user.coverimage ? (
                            <img src={user.coverimage} alt="Cover Banner" />
                        ) : null}

                        {/* Banner Quick Edit Button */}
                        <div className="banner-edit-overlay">
                            <button
                                className="banner-edit-btn"
                                onClick={() => coverInputRef.current?.click()}
                                disabled={loadingCover}
                            >
                                📷 {loadingCover ? "Uploading cover image..." : "Edit Cover image"}
                            </button>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleCoverSelectAndUpload(file);
                                }}
                            />
                        </div>
                    </div>

                    {/* Avatar with Camera Hover Overlay */}
                    <div className="profile-avatar-wrapper">
                        <div
                            className="avatar-container"
                            onClick={() => avatarInputRef.current?.click()}
                            title="Click to update avatar"
                        >
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="profile-avatar"
                            />
                            <div className="avatar-hover-overlay">
                                📷
                            </div>
                        </div>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleAvatarSelectAndUpload(file);
                            }}
                        />
                    </div>

                    <div className="profile-header-info">
                        <div className="user-name-title">
                            <h2>
                                {user.fullName} <span className="verified-badge">✓</span>
                            </h2>
                            <span className="user-handle">@{user.username}</span>
                            <span className="user-email-badge">✉️ {user.email}</span>

                            {profileStats && (
                                <div className="profile-stats-badges">
                                    <div className="stat-badge">
                                        👥 Subscribers: <span>{profileStats.subscriberscount || 0}</span>
                                    </div>
                                    <div className="stat-badge">
                                        📺 Subscribed To: <span>{profileStats.channelsubscribedtocount || 0}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings Forms Grid */}
                <div className="profile-grid">
                    {/* Card 1: Account Details Form */}
                    <div className="profile-card">
                        <h3>⚙️ Account Information</h3>

                        {detailsMessage && <div className="success-message">{detailsMessage}</div>}
                        {detailsError && <div className="error-message">{detailsError}</div>}

                        <form onSubmit={handleUpdateDetails} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username Handle</label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username handle"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-btn" disabled={loadingDetails}>
                                {loadingDetails ? "Saving Changes..." : "Save Account Details"}
                            </button>
                        </form>
                    </div>

                    {/* Card 2: Security & Password Change */}
                    <div className="profile-card">
                        <h3>🔒 Security & Password</h3>

                        {passwordMessage && <div className="success-message">{passwordMessage}</div>}
                        {passwordError && <div className="error-message">{passwordError}</div>}

                        <form onSubmit={handleChangePassword} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="oldPassword">Current Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="oldPassword"
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowOldPassword((prev) => !prev)}
                                        title={showOldPassword ? "Hide password" : "Show password"}
                                    >
                                        {showOldPassword ? "👁️‍🗨️" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        title={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? "👁️‍🗨️" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        title={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="auth-btn" disabled={loadingPassword}>
                                {loadingPassword ? "Changing Password..." : "Change Password"}
                            </button>
                        </form>
                    </div>

                    {/* Card 3: Manual Upload Controls (Full Width) */}
                    <div className="profile-card" style={{ gridColumn: "1 / -1" }}>
                        <h3>🖼️ Branding & Media Files</h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                            {/* Avatar Status Notification */}
                            <div>
                                {avatarMessage && <div className="success-message">{avatarMessage}</div>}
                                {avatarError && <div className="error-message">{avatarError}</div>}

                                <div className="form-group">
                                    <label>Avatar Profile Picture</label>
                                    <div className="custom-file-input">
                                        <label className="custom-file-label" onClick={() => avatarInputRef.current?.click()}>
                                            📁 Select & Upload New Avatar
                                        </label>
                                        {loadingAvatar && <p style={{ color: "#3ea6ff", fontSize: "0.85rem", textAlign: "center" }}>Uploading avatar...</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image Status Notification */}
                            <div>
                                {coverMessage && <div className="success-message">{coverMessage}</div>}
                                {coverError && <div className="error-message">{coverError}</div>}

                                <div className="form-group">
                                    <label>Channel Cover Banner</label>
                                    <div className="custom-file-input">
                                        <label className="custom-file-label" onClick={() => coverInputRef.current?.click()}>
                                            📁 Select & Upload New Cover Banner
                                        </label>
                                        {loadingCover && <p style={{ color: "#3ea6ff", fontSize: "0.85rem", textAlign: "center" }}>Uploading cover banner...</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Subscribed Channels List */}
                    <div className="profile-card" style={{ gridColumn: "1 / -1" }}>
                        <h3>📺 Subscribed Channels ({subscribedChannels.length})</h3>

                        {subscribedChannels.length === 0 ? (
                            <p style={{ color: "#aaa", fontSize: "0.9rem", marginTop: "8px" }}>
                                You haven't subscribed to any channels yet.
                            </p>
                        ) : (
                            <div className="subscribed-channels-grid">
                                {subscribedChannels.map((item) => (
                                    <div key={item.channel?._id || Math.random()} className="subscribed-channel-card">
                                        <div className="channel-card-info">
                                            {item.channel?.avatar ? (
                                                <img
                                                    src={item.channel.avatar}
                                                    alt={item.channel.username}
                                                    className="channel-card-avatar"
                                                />
                                            ) : (
                                                <div className="comment-user-placeholder">
                                                    {(item.channel?.username || "C")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <span className="channel-card-name">@{item.channel?.username}</span>
                                        </div>
                                        <button
                                            className="unsubscribe-icon-btn"
                                            onClick={() => handleUnsubscribeFromList(item.channel?._id)}
                                            title="Unsubscribe channel"
                                        >
                                            Subscribed 🔔
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
