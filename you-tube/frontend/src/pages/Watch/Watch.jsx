import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById, getAllVideos } from "../../services/videoApi";
import { getVideoComments, addComment, updateComment, deleteComment } from "../../services/commentApi";
import { toggleVideoLike } from "../../services/likeApi";
import { useAuth } from "../../context/AuthContext";
import "./Watch.css";

function Watch() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [video, setVideo] = useState(null);
    const [suggestedVideos, setSuggestedVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [commentError, setCommentError] = useState("");

    // State for inline comment editing
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState("");

    useEffect(() => {
        fetchVideo();
        fetchSuggestedVideos();
        fetchComments();
    }, [videoId]);

    async function fetchVideo() {
        try {
            const res = await getVideoById(videoId);
            setVideo(res.data);
        } catch (error) {
            console.error("Error fetching video:", error);
        }
    }

    async function fetchSuggestedVideos() {
        try {
            const res = await getAllVideos();
            if (res && res.data) {
                // Filter out the currently watching video
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

    async function handleToggleLike() {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            await toggleVideoLike(videoId);
            setIsLiked((prev) => !prev);
        } catch (error) {
            console.error("Like error:", error);
        }
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
                        <div className="channel-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {video.owner?.avatar && (
                                <img
                                    src={video.owner.avatar}
                                    alt={video.owner.username}
                                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                                />
                            )}
                            <span style={{ fontWeight: "600" }}>{video.owner?.username || "Channel"}</span>
                            <span style={{ color: "#aaa", fontSize: "0.9rem" }}>• {video.views} Views</span>
                        </div>

                        <div className="video-actions">
                            <button
                                onClick={handleToggleLike}
                                className={`like-btn ${isLiked ? "liked" : ""}`}
                                style={isLiked ? { backgroundColor: "#cc0000", color: "#fff" } : {}}
                            >
                                👍 {isLiked ? "Liked" : "Like"}
                            </button>
                            <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
                                🔗 Share
                            </button>
                        </div>
                    </div>

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
                            <button onClick={handleAddComment}>Add Comment</button>
                        </div>

                        {comments.length === 0 ? (
                            <p style={{ color: "#aaa", marginTop: "16px" }}>No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => {
                                const isOwner =
                                    user &&
                                    (user._id === comment.owner?._id || user.username === comment.owner?.username);

                                const isEditing = editingCommentId === comment._id;

                                return (
                                    <div key={comment._id} className="comment">
                                        <div className="comment-header">
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                {comment.owner?.avatar && (
                                                    <img
                                                        src={comment.owner.avatar}
                                                        alt={comment.owner.username}
                                                        style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                                                    />
                                                )}
                                                <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
                                                    {comment.owner?.username || "User"}
                                                </h4>
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
                                            <p style={{ margin: "6px 0 0 32px", color: "#ddd" }}>{comment.content}</p>
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
