import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import {
    createTweetApi,
    getAllTweetsApi,
    getUserTweetsApi,
    updateTweetApi,
    deleteTweetApi,
} from "../../services/tweetApi";
import { toggleTweetLike } from "../../services/likeApi";
import "./Tweets.css";

function Tweets() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all"); // "all" | "my"

    // Create Tweet State
    const [newTweetContent, setNewTweetContent] = useState("");
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState("");
    const [postSuccess, setPostSuccess] = useState("");

    // Editing State
    const [editingTweetId, setEditingTweetId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // Likes local tracking state { [tweetId]: { liked: boolean, count: number } }
    const [likedState, setLikedState] = useState({});

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchTweets();
    }, [user, activeTab]);

    async function fetchTweets() {
        setLoading(true);
        try {
            let res;
            if (activeTab === "my" && user?._id) {
                res = await getUserTweetsApi(user._id);
            } else {
                res = await getAllTweetsApi(1, 30);
            }

            const fetchedTweets = res?.data || [];
            setTweets(fetchedTweets);

            // Initialize like state
            const initialLikes = {};
            fetchedTweets.forEach((t) => {
                initialLikes[t._id] = {
                    liked: false,
                    count: t.likesCount || 0,
                };
            });
            setLikedState((prev) => ({ ...initialLikes, ...prev }));
        } catch (err) {
            console.error("Error fetching tweets:", err);
            setTweets([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateTweet(e) {
        e.preventDefault();
        setPostError("");
        setPostSuccess("");

        if (!newTweetContent.trim()) {
            setPostError("Tweet content cannot be empty.");
            return;
        }

        if (newTweetContent.length > 200) {
            setPostError("Tweet must be 200 characters or less.");
            return;
        }

        setPosting(true);
        try {
            const res = await createTweetApi(newTweetContent.trim());
            if (res?.data) {
                setPostSuccess("Tweet posted successfully! 🐦");
                setNewTweetContent("");
                // Refresh list
                const createdTweet = res.data;
                // Add owner info if missing
                if (!createdTweet.ownerDetails && user) {
                    createdTweet.ownerDetails = {
                        username: user.username,
                        avatar: user.avatar,
                    };
                }
                setTweets((prev) => [createdTweet, ...prev]);

                setTimeout(() => setPostSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error creating tweet:", err);
            setPostError(err.response?.data?.message || "Failed to post tweet.");
        } finally {
            setPosting(false);
        }
    }

    async function handleUpdateTweet(tweetId) {
        if (!editContent.trim()) {
            alert("Tweet content cannot be empty.");
            return;
        }
        if (editContent.length > 200) {
            alert("Tweet must be 200 characters or less.");
            return;
        }

        setEditLoading(true);
        try {
            const res = await updateTweetApi(tweetId, editContent.trim());
            if (res?.data) {
                setTweets((prev) =>
                    prev.map((t) => (t._id === tweetId ? { ...t, content: res.data.content } : t))
                );
                setEditingTweetId(null);
                setEditContent("");
            }
        } catch (err) {
            console.error("Error updating tweet:", err);
            alert(err.response?.data?.message || "Failed to update tweet.");
        } finally {
            setEditLoading(false);
        }
    }

    async function handleDeleteTweet(tweetId) {
        if (!window.confirm("Are you sure you want to delete this tweet?")) return;

        try {
            await deleteTweetApi(tweetId);
            setTweets((prev) => prev.filter((t) => t._id !== tweetId));
        } catch (err) {
            console.error("Error deleting tweet:", err);
            alert(err.response?.data?.message || "Failed to delete tweet.");
        }
    }

    async function handleLikeToggle(tweetId) {
        try {
            // Optimistic update
            setLikedState((prev) => {
                const current = prev[tweetId] || { liked: false, count: 0 };
                const newLiked = !current.liked;
                const newCount = newLiked ? current.count + 1 : Math.max(0, current.count - 1);
                return {
                    ...prev,
                    [tweetId]: { liked: newLiked, count: newCount },
                };
            });

            await toggleTweetLike(tweetId);
        } catch (err) {
            console.error("Error toggling tweet like:", err);
            // Revert optimistic update
            setLikedState((prev) => {
                const current = prev[tweetId] || { liked: false, count: 0 };
                const newLiked = !current.liked;
                const newCount = newLiked ? current.count + 1 : Math.max(0, current.count - 1);
                return {
                    ...prev,
                    [tweetId]: { liked: newLiked, count: newCount },
                };
            });
        }
    }

    // Helper to format date
    function formatDate(dateString) {
        if (!dateString) return "Just now";
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Check if tweet belongs to current user
    function isOwner(tweet) {
        if (!user) return false;
        const ownerId = typeof tweet.owner === "object" ? tweet.owner._id : tweet.owner;
        return ownerId === user._id;
    }

    const remainingChars = 200 - newTweetContent.length;

    return (
        <Layout>
            <div className="tweets-page">
                {/* Header */}
                <div className="tweets-header">
                    <div className="tweets-title-box">
                        <h2>🐦 Community Tweets</h2>
                        <p>Share updates, thoughts, and announcements with your community.</p>
                    </div>

                    <div className="tweets-tabs">
                        <button
                            className={`tweet-tab-btn ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            🌐 All Tweets
                        </button>
                        <button
                            className={`tweet-tab-btn ${activeTab === "my" ? "active" : ""}`}
                            onClick={() => setActiveTab("my")}
                        >
                            👤 My Tweets
                        </button>
                    </div>
                </div>

                {/* Tweet Composer Box */}
                <div className="tweet-composer-card">
                    <div className="composer-user-info">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.username} className="composer-avatar" />
                        ) : (
                            <div className="composer-avatar-placeholder">
                                {(user?.username || "U")[0].toUpperCase()}
                            </div>
                        )}
                        <span className="composer-username">@{user?.username || "You"}</span>
                    </div>

                    <form onSubmit={handleCreateTweet} className="composer-form">
                        <textarea
                            className="composer-textarea"
                            rows={3}
                            placeholder="What's happening? Share a post (max 200 chars)..."
                            value={newTweetContent}
                            onChange={(e) => setNewTweetContent(e.target.value)}
                            maxLength={200}
                        />

                        {postError && <div className="tweet-alert error">{postError}</div>}
                        {postSuccess && <div className="tweet-alert success">{postSuccess}</div>}

                        <div className="composer-footer">
                            <span
                                className={`char-counter ${
                                    remainingChars < 20 ? "warning" : ""
                                }`}
                            >
                                {remainingChars} / 200
                            </span>

                            <button
                                type="submit"
                                className="post-tweet-btn"
                                disabled={posting || !newTweetContent.trim()}
                            >
                                {posting ? "Posting..." : "Post Tweet 🚀"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tweets List / Feed */}
                <div className="tweets-feed-container">
                    {loading ? (
                        <div className="tweets-loading-box">
                            <div className="spinner"></div>
                            <p>Loading community tweets...</p>
                        </div>
                    ) : tweets.length === 0 ? (
                        <div className="tweets-empty-box">
                            <div className="empty-tweet-icon">💬</div>
                            <h3>No tweets found</h3>
                            <p>
                                {activeTab === "my"
                                    ? "You haven't posted any tweets yet. Start by writing one above!"
                                    : "Be the first to share a tweet with the community!"}
                            </p>
                        </div>
                    ) : (
                        tweets.map((tweet) => {
                            const isMyTweet = isOwner(tweet);
                            const isEditing = editingTweetId === tweet._id;
                            const likeInfo = likedState[tweet._id] || { liked: false, count: 0 };
                            const ownerObj = typeof tweet.owner === "object" ? tweet.owner : null;
                            const authorName =
                                ownerObj?.username ||
                                (isMyTweet ? user?.username : null) ||
                                "Community User";
                            const authorAvatar =
                                ownerObj?.avatar || (isMyTweet ? user?.avatar : null);

                            return (
                                <div key={tweet._id} className="tweet-card">
                                    <div className="tweet-card-header">
                                        <div className="tweet-author-info">
                                            {authorAvatar ? (
                                                <img
                                                    src={authorAvatar}
                                                    alt={authorName}
                                                    className="tweet-avatar"
                                                />
                                            ) : (
                                                <div className="tweet-avatar-placeholder">
                                                    {authorName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="tweet-author-details">
                                                <div className="tweet-author-name">
                                                    @{authorName}
                                                    {isMyTweet && (
                                                        <span className="you-badge">You</span>
                                                    )}
                                                </div>
                                                <div className="tweet-timestamp">
                                                    {formatDate(tweet.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {isMyTweet && !isEditing && (
                                            <div className="tweet-owner-actions">
                                                <button
                                                    className="tweet-action-icon edit"
                                                    onClick={() => {
                                                        setEditingTweetId(tweet._id);
                                                        setEditContent(tweet.content);
                                                    }}
                                                    title="Edit Tweet"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="tweet-action-icon delete"
                                                    onClick={() => handleDeleteTweet(tweet._id)}
                                                    title="Delete Tweet"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content or Edit Form */}
                                    {isEditing ? (
                                        <div className="tweet-edit-box">
                                            <textarea
                                                className="tweet-edit-textarea"
                                                rows={3}
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                maxLength={200}
                                            />
                                            <div className="tweet-edit-footer">
                                                <span className="char-counter">
                                                    {200 - editContent.length} / 200
                                                </span>
                                                <div className="tweet-edit-btns">
                                                    <button
                                                        className="cancel-edit-btn"
                                                        onClick={() => setEditingTweetId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="save-edit-btn"
                                                        disabled={editLoading}
                                                        onClick={() => handleUpdateTweet(tweet._id)}
                                                    >
                                                        {editLoading ? "Saving..." : "Save"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="tweet-body">
                                            <p className="tweet-content">{tweet.content}</p>
                                        </div>
                                    )}

                                    {/* Footer Actions (Like, Share, etc.) */}
                                    <div className="tweet-card-footer">
                                        <button
                                            className={`tweet-like-btn ${
                                                likeInfo.liked ? "liked" : ""
                                            }`}
                                            onClick={() => handleLikeToggle(tweet._id)}
                                        >
                                            {likeInfo.liked ? "❤️" : "🤍"}{" "}
                                            <span>
                                                {likeInfo.count > 0 ? likeInfo.count : "Like"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Tweets;
