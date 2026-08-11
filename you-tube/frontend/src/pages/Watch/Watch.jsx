import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById, getAllVideos } from "../../services/videoApi";
import { getVideoComments, addComment, updateComment, deleteComment } from "../../services/commentApi";
import { toggleVideoLike, toggleCommentLike, getLikedVideos } from "../../services/likeApi";
import { toggleSubscription } from "../../services/subscriptionApi";
import { getUserChannelProfile } from "../../services/userApi";
import { getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, createPlaylist } from "../../services/playlistApi";
import { useAuth } from "../../context/AuthContext";
import "./Watch.css";

// Authentic YouTube SVG Icons
const ThumbUpIcon = ({ filled = false, size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ flexShrink: 0 }}>
        {filled ? (
            <path d="M3 11h3v10H3zm15.77 0h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11v10h11c1.24 0 2.29-.82 2.56-2.02l1.42-6.41c.32-1.34-.74-2.57-2.21-2.57z" />
        ) : (
            <path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h4h11c1.24 0 2.29-.82 2.56-2.02l1.42-6.41C22.3 11.23 20.76 11 18.77 11zM7 20H4v-8h3v8zm13.58-7.98l-1.42 6.41c-.1.43-.47.74-.91.74H8v-7.66l5.35-5.74c.15-.16.37-.25.59-.25.26 0 .47.15.56.36.01.03.1.28.01.69l-1.78 5.78H18.77c.69 0 1.29.35 1.62.91.13.23.23.51.19.83z" />
        )}
    </svg>
);

const ThumbDownIcon = ({ filled = false, size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ flexShrink: 0 }}>
        {filled ? (
            <path d="M4.23 14h4.23l-1.52 4.94C6.62 19.97 7.46 21 8.62 21c.58 0 1.14-.24 1.52-.65L15 14h4V4H6c-1.24 0-2.29.82-2.56 2.02L2.02 11.43C1.7 12.77 2.76 14 4.23 14zM17 4h3v8h-3V4z" />
        ) : (
            <path d="M17 3H6c-1.24 0-2.29.82-2.56 2.02L2.02 11.43C1.7 12.77 2.76 14 4.23 14h4.23l-1.52 4.94C6.62 19.97 7.46 21 8.62 21c.58 0 1.14-.24 1.52-.65L15 14h4V4h-2zm-2 9.66l-5.35 5.74c-.15.16-.37.25-.59.25-.26 0-.47-.15-.56-.36-.01-.03-.1-.28-.01-.69l1.78-5.78H4.23c-.69 0-1.29-.35-1.62-.91-.13-.23-.23-.51-.19-.83l1.42-6.41c.1-.43.47-.74.91-.74H15v7.66zM20 12h-3V5h3v7z" />
        )}
    </svg>
);

const ShareIcon = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M15 5.63L20.66 12 15 18.37V15v-1h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1L15 9.81v-1V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-8z" />
    </svg>
);

const BellIcon = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-3v-7c0-3.07-1.63-5.64-4.5-6.32V3c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C9.63 4.36 8 6.92 8 10v7l-2 2v1h16v-1l-2-2z" />
    </svg>
);

function Watch() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [video, setVideo] = useState(null);
    const [suggestedVideos, setSuggestedVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentError, setCommentError] = useState("");

    // Subscription State
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [channelOwnerId, setChannelOwnerId] = useState(null);

    // Store like status for comments: { [commentId]: { isLiked: boolean, isDisliked: boolean, count: number } }
    const [commentLikes, setCommentLikes] = useState({});

    // State for inline comment editing
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState("");

    // Playlist Modal State
    const [showSavePlaylistModal, setShowSavePlaylistModal] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
    const [showCreateInModal, setShowCreateInModal] = useState(false);

    async function handleOpenPlaylistModal() {
        if (!user) {
            navigate("/login");
            return;
        }
        setShowSavePlaylistModal(true);
        try {
            const res = await getUserPlaylists(user._id);
            setUserPlaylists(res?.data || []);
        } catch (err) {
            console.error("Error fetching user playlists:", err);
        }
    }

    async function handleToggleVideoInPlaylist(playlist) {
        const vidList = playlist.video || [];
        const isAlreadyIn = vidList.some(v => (typeof v === 'object' ? v._id : v) === videoId);

        try {
            if (isAlreadyIn) {
                await removeVideoFromPlaylist(videoId, playlist._id);
            } else {
                await addVideoToPlaylist(videoId, playlist._id);
            }
            const res = await getUserPlaylists(user._id);
            setUserPlaylists(res?.data || []);
        } catch (err) {
            console.error("Error toggling playlist video:", err);
        }
    }

    async function handleCreateAndAddInModal(e) {
        e.preventDefault();
        if (!newPlaylistName.trim() || !newPlaylistDesc.trim()) return;

        try {
            const res = await createPlaylist({ name: newPlaylistName, description: newPlaylistDesc });
            if (res && res.data) {
                await addVideoToPlaylist(videoId, res.data._id);
                setNewPlaylistName("");
                setNewPlaylistDesc("");
                setShowCreateInModal(false);
                const refreshRes = await getUserPlaylists(user._id);
                setUserPlaylists(refreshRes?.data || []);
            }
        } catch (err) {
            console.error("Create playlist error in modal:", err);
        }
    }

    useEffect(() => {
        fetchVideo();
        fetchSuggestedVideos();
        fetchComments();
        if (user) {
            checkIfVideoLiked();
        } else {
            setIsLiked(false);
            setIsDisliked(false);
        }
    }, [videoId, user]);

    useEffect(() => {
        if (video?.owner?.username) {
            fetchChannelProfile(video.owner.username);
        }
    }, [video, user]);

    async function fetchChannelProfile(username) {
        try {
            const res = await getUserChannelProfile(username);
            if (res && res.data) {
                setIsSubscribed(!!res.data.issubscribed);
                setSubscribersCount(res.data.subscriberscount || 0);
                if (res.data._id) {
                    setChannelOwnerId(res.data._id);
                }
            }
        } catch (error) {
            console.error("Error fetching channel profile:", error);
        }
    }

    async function handleToggleSubscribe() {
        if (!user) {
            navigate("/login");
            return;
        }

        const targetChannelId = channelOwnerId || video?.owner?._id || (typeof video?.owner === 'string' ? video.owner : null);

        if (!targetChannelId) {
            console.error("Channel owner ID not found for subscription");
            return;
        }

        const newSubscribedState = !isSubscribed;
        setIsSubscribed(newSubscribedState);
        setSubscribersCount((prev) => (newSubscribedState ? prev + 1 : Math.max(0, prev - 1)));

        try {
            await toggleSubscription(targetChannelId);
        } catch (error) {
            console.error("Subscription error:", error);
            // Revert state on error
            setIsSubscribed(!newSubscribedState);
            setSubscribersCount((prev) => (!newSubscribedState ? prev + 1 : Math.max(0, prev - 1)));
        }
    }

    function recordWatchHistory(videoObj) {
        if (!videoObj || !videoObj._id) return;
        try {
            const stored = JSON.parse(localStorage.getItem("yt_watch_history") || "[]");
            const filtered = stored.filter(item => item._id !== videoObj._id);
            const updated = [{ ...videoObj, watchedAt: new Date().toISOString() }, ...filtered];
            localStorage.setItem("yt_watch_history", JSON.stringify(updated.slice(0, 50)));
        } catch (e) {
            console.error("Error saving watch history:", e);
        }
    }

    async function fetchVideo() {
        try {
            const res = await getVideoById(videoId);
            if (res && res.data) {
                setVideo(res.data);
                const count = res.data?.likesCount ?? res.data?.likes ?? 0;
                setLikeCount(count);
                recordWatchHistory(res.data);
            }
        } catch (error) {
            console.error("Error fetching video:", error);
        }
    }

    async function fetchSuggestedVideos() {
        try {
            const res = await getAllVideos();
            if (res && res.data) {
                setSuggestedVideos(res.data.filter((item) => item._id !== videoId));
            }
        } catch (error) {
            console.error("Error fetching suggested videos:", error);
        }
    }

    async function fetchComments() {
        try {
            const res = await getVideoComments(videoId);
            if (res && res.data) {
                setComments(res.data);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }

    async function checkIfVideoLiked() {
        try {
            const res = await getLikedVideos();
            if (res && res.data) {
                const alreadyLiked = res.data.some(
                    (item) => item.video?._id === videoId || item.video === videoId
                );
                setIsLiked(alreadyLiked);
                if (alreadyLiked) {
                    setLikeCount((prev) => (prev > 0 ? prev : 1));
                }
            }
        } catch (error) {
            console.error("Error checking video liked status:", error);
        }
    }

    async function handleToggleLike() {
        if (!user) {
            navigate("/login");
            return;
        }

        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
        if (nextLiked) setIsDisliked(false);

        try {
            await toggleVideoLike(videoId);
        } catch (error) {
            console.error("Like error:", error);
            // Revert state on error
            setIsLiked(!nextLiked);
            setLikeCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
        }
    }

    function handleToggleDislike() {
        if (!user) {
            navigate("/login");
            return;
        }

        setIsDisliked((prev) => {
            if (!prev) setIsLiked(false);
            return !prev;
        });
    }

    async function handleToggleCommentLike(commentId) {
        if (!user) {
            navigate("/login");
            return;
        }

        const currentStatus = commentLikes[commentId] || { isLiked: false, isDisliked: false, count: 0 };
        const newIsLiked = !currentStatus.isLiked;
        const newIsDisliked = newIsLiked ? false : currentStatus.isDisliked;
        const countDiff = newIsLiked ? 1 : -1;
        const newCount = Math.max(0, (currentStatus.count || 0) + countDiff);

        setCommentLikes((prev) => ({
            ...prev,
            [commentId]: {
                isLiked: newIsLiked,
                isDisliked: newIsDisliked,
                count: newCount,
            },
        }));

        try {
            await toggleCommentLike(commentId);
        } catch (error) {
            console.error("Comment like error:", error);
            // Revert state if API call failed
            setCommentLikes((prev) => ({
                ...prev,
                [commentId]: currentStatus,
            }));
        }
    }

    function handleToggleCommentDislike(commentId) {
        if (!user) {
            navigate("/login");
            return;
        }

        const currentStatus = commentLikes[commentId] || { isLiked: false, isDisliked: false, count: 0 };
        const newIsDisliked = !currentStatus.isDisliked;
        let newCount = currentStatus.count || 0;
        let newIsLiked = currentStatus.isLiked;

        if (newIsDisliked && currentStatus.isLiked) {
            newIsLiked = false;
            newCount = Math.max(0, newCount - 1);
        }

        setCommentLikes((prev) => ({
            ...prev,
            [commentId]: {
                isLiked: newIsLiked,
                isDisliked: newIsDisliked,
                count: newCount,
            },
        }));
    }

    async function handleAddComment() {
        setCommentError("");
        if (!user) {
            navigate("/login");
            return;
        }

        if (!commentText.trim()) {
            return;
        }

        try {
            await addComment(videoId, commentText);
            setCommentText("");
            fetchComments();
        } catch (error) {
            console.error("Add comment error:", error);
            setCommentError(error.response?.data?.message || "Failed to add comment.");
        }
    }

    const startEditing = (comment) => {
        setEditingCommentId(comment._id);
        setEditingContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    async function handleUpdateComment(commentId) {
        setCommentError("");
        if (!user) return;

        if (!editingContent.trim()) {
            setCommentError("Comment content cannot be empty.");
            return;
        }

        try {
            await updateComment(commentId, editingContent);
            cancelEditing();
            fetchComments();
        } catch (error) {
            console.error("Update comment error:", error);
            setCommentError(error.response?.data?.message || "Failed to update comment.");
        }
    }

    async function handleDeleteComment(commentId) {
        setCommentError("");
        if (!user) return;

        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error("Delete comment error:", error);
            setCommentError(error.response?.data?.message || "Failed to delete comment.");
        }
    }

    if (!video) {
        return (
            <Layout>
                <div style={{ padding: "40px", textAlign: "center" }}>
                    <h2>Loading video...</h2>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="watch-page">
                <div className="watch-left">
                    <video
                        className="video-player"
                        controls
                        autoPlay
                        src={video.videofile}
                    >
                        Your browser does not support the video tag.
                    </video>

                    <h2 className="video-title">{video.title}</h2>

                    <div className="video-stats">
                        <div className="channel-info">
                            {video.owner?.avatar ? (
                                <img
                                    src={video.owner.avatar}
                                    alt={video.owner.username}
                                    className="channel-avatar-img"
                                />
                            ) : (
                                <div className="channel-avatar-placeholder">
                                    {(video.owner?.username || "C")[0].toUpperCase()}
                                </div>
                            )}
                            <div className="channel-details">
                                <span className="channel-name-txt">{video.owner?.username || "Channel"}</span>
                                <span className="video-subscribers-txt">
                                    {subscribersCount} {subscribersCount === 1 ? "subscriber" : "subscribers"}
                                </span>
                            </div>

                            {user && ((channelOwnerId && user._id === channelOwnerId) || (video.owner?._id && user._id === video.owner._id) || (user.username === video.owner?.username)) ? (
                                <span className="yt-owner-badge">Channel Owner</span>
                            ) : (
                                <button
                                    onClick={handleToggleSubscribe}
                                    className={`yt-subscribe-btn ${isSubscribed ? "subscribed" : "not-subscribed"}`}
                                    title={isSubscribed ? "Click to Unsubscribe" : "Click to Subscribe"}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <BellIcon size={18} />
                                            <span>Subscribed</span>
                                        </>
                                    ) : (
                                        <span>Subscribe</span>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="video-actions">
                            <div className="yt-like-dislike-container">
                                <button
                                    onClick={handleToggleLike}
                                    className={`yt-like-btn ${isLiked ? "liked" : ""}`}
                                    title="I like this"
                                    aria-label="Like video"
                                >
                                    <ThumbUpIcon filled={isLiked} size={19} />
                                    <span>{likeCount > 0 ? likeCount : (isLiked ? 1 : "Like")}</span>
                                </button>
                                <div className="yt-pill-divider" />
                                <button
                                    onClick={handleToggleDislike}
                                    className={`yt-dislike-btn ${isDisliked ? "disliked" : ""}`}
                                    title="I dislike this"
                                    aria-label="Dislike video"
                                >
                                    <ThumbDownIcon filled={isDisliked} size={19} />
                                </button>
                            </div>

                            <button
                                className="yt-action-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboard!");
                                }}
                            >
                                <ShareIcon size={19} />
                                <span>Share</span>
                            </button>

                            <button
                                className="yt-action-btn"
                                onClick={handleOpenPlaylistModal}
                                title="Save to playlist"
                            >
                                <span>📂 Save</span>
                            </button>
                        </div>
                    </div>

                    {/* Save to Playlist Modal */}
                    {showSavePlaylistModal && (
                        <div className="modal-overlay" onClick={() => setShowSavePlaylistModal(false)}>
                            <div className="playlist-modal" onClick={e => e.stopPropagation()}>
                                <h3>📂 Save video to...</h3>

                                {userPlaylists.length === 0 ? (
                                    <p style={{ color: "#aaa", fontSize: "0.9rem" }}>No playlists created yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "14px 0" }}>
                                        {userPlaylists.map(pl => {
                                            const vidList = pl.video || [];
                                            const isAlreadyIn = vidList.some(v => (typeof v === 'object' ? v._id : v) === videoId);

                                            return (
                                                <label key={pl._id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#f1f1f1", fontSize: "0.95rem" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isAlreadyIn}
                                                        onChange={() => handleToggleVideoInPlaylist(pl)}
                                                        style={{ width: "18px", height: "18px", accentColor: "#3ea6ff" }}
                                                    />
                                                    <span>{pl.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {!showCreateInModal ? (
                                    <button
                                        className="action-btn"
                                        style={{ marginTop: "12px", width: "100%" }}
                                        onClick={() => setShowCreateInModal(true)}
                                    >
                                        + Create New Playlist
                                    </button>
                                ) : (
                                    <form onSubmit={handleCreateAndAddInModal} style={{ marginTop: "14px", borderTop: "1px solid #333", paddingTop: "14px" }}>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                placeholder="Playlist name"
                                                value={newPlaylistName}
                                                onChange={e => setNewPlaylistName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginTop: "8px" }}>
                                            <input
                                                type="text"
                                                placeholder="Playlist description"
                                                value={newPlaylistDesc}
                                                onChange={e => setNewPlaylistDesc(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="modal-actions" style={{ marginTop: "12px" }}>
                                            <button type="button" className="cancel-btn" onClick={() => setShowCreateInModal(false)}>Cancel</button>
                                            <button type="submit" className="submit-btn">Create & Save</button>
                                        </div>
                                    </form>
                                )}

                                <div className="modal-actions" style={{ marginTop: "16px" }}>
                                    <button className="cancel-btn" onClick={() => setShowSavePlaylistModal(false)}>Done</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="description-box">
                        <p>{video.description}</p>
                    </div>

                    <div className="comments-section">
                        <h3>Comments ({comments.length})</h3>

                        {commentError && <p className="error-message">{commentError}</p>}

                        <div className="comment-input">
                            <input
                                type="text"
                                placeholder={user ? "Write a comment..." : "Sign in to write a comment"}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            />
                            <button onClick={handleAddComment}>Comment</button>
                        </div>

                        {comments.length === 0 ? (
                            <p style={{ color: "#aaa", marginTop: "16px" }}>No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => {
                                const isOwner =
                                    user &&
                                    (user._id === comment.owner?._id || user.username === comment.owner?.username);

                                const isEditing = editingCommentId === comment._id;
                                const status = commentLikes[comment._id] || {};

                                return (
                                    <div key={comment._id} className="comment">
                                        <div className="comment-header">
                                            <div className="comment-user-info">
                                                {comment.owner?.avatar ? (
                                                    <img
                                                        src={comment.owner.avatar}
                                                        alt={comment.owner.username}
                                                        className="comment-user-avatar"
                                                    />
                                                ) : (
                                                    <div className="comment-user-placeholder">
                                                        {(comment.owner?.username || "U")[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="comment-author">
                                                    @{comment.owner?.username || "User"}
                                                </span>
                                            </div>

                                            {isOwner && !isEditing && (
                                                <div className="comment-action-btns">
                                                    <button
                                                        className="action-icon-btn edit-btn"
                                                        onClick={() => startEditing(comment)}
                                                        title="Edit comment"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-icon-btn delete-btn"
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        title="Delete comment"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div className="edit-comment-container">
                                                <input
                                                    type="text"
                                                    className="edit-comment-input"
                                                    value={editingContent}
                                                    onChange={(e) => setEditingContent(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleUpdateComment(comment._id)}
                                                />
                                                <div className="edit-comment-actions">
                                                    <button
                                                        className="save-edit-btn"
                                                        onClick={() => handleUpdateComment(comment._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-edit-btn"
                                                        onClick={cancelEditing}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="comment-content">{comment.content}</p>

                                                <div className="comment-footer">
                                                    <div className="comment-like-dislike-group">
                                                        <button
                                                            className={`comment-icon-btn comment-like-btn ${
                                                                status.isLiked ? "liked" : ""
                                                            }`}
                                                            onClick={() => handleToggleCommentLike(comment._id)}
                                                            title="Like comment"
                                                        >
                                                            <ThumbUpIcon filled={!!status.isLiked} size={16} />
                                                        </button>
                                                        {status.count > 0 && (
                                                            <span className="comment-like-count">
                                                                {status.count}
                                                            </span>
                                                        )}
                                                        <button
                                                            className={`comment-icon-btn comment-dislike-btn ${
                                                                status.isDisliked ? "disliked" : ""
                                                            }`}
                                                            onClick={() => handleToggleCommentDislike(comment._id)}
                                                            title="Dislike comment"
                                                        >
                                                            <ThumbDownIcon filled={!!status.isDisliked} size={16} />
                                                        </button>
                                                    </div>
                                                    <button className="comment-reply-btn">Reply</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="watch-right">
                    <h3 className="suggested-title">Suggested Videos</h3>

                    {suggestedVideos.map((item) => (
                        <div
                            key={item._id}
                            className="suggested-card"
                            onClick={() => navigate(`/watch/${item._id}`)}
                        >
                            <img src={item.thumbnail} alt={item.title} className="suggested-thumb" />
                            <div className="suggested-info">
                                <h4>{item.title}</h4>
                                <p>{item.owner?.username || "Channel"}</p>
                                <p>{item.views} views</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Watch;

