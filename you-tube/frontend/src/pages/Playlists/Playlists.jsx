import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import {
    getUserPlaylists,
    createPlaylist,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist
} from "../../services/playlistApi";
import { getAllVideos } from "../../services/videoApi";
import { useAuth } from "../../context/AuthContext";
import "./Playlists.css";

function Playlists() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [allVideosMap, setAllVideosMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(false);

    // Modal / Form state for Create Playlist
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    // Add Video to Playlist Modal State
    const [showAddVideoModal, setShowAddVideoModal] = useState(false);
    const [allAvailableVideos, setAllAvailableVideos] = useState([]);
    const [videoSearchQuery, setVideoSearchQuery] = useState("");

    // Edit Playlist state
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchPlaylistsAndVideos();
    }, [user]);

    async function fetchPlaylistsAndVideos() {
        setLoading(true);
        try {
            const [plRes, vidRes] = await Promise.all([
                getUserPlaylists(user._id),
                getAllVideos()
            ]);

            const userPls = plRes?.data || [];
            setPlaylists(userPls);

            const vMap = {};
            (vidRes?.data || []).forEach(v => {
                vMap[v._id] = v;
            });
            setAllVideosMap(vMap);

            if (userPls.length > 0 && !selectedPlaylist) {
                loadPlaylistDetails(userPls[0]._id, vMap);
            }
        } catch (error) {
            console.error("Error loading playlists:", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadPlaylistDetails(playlistId, vMap = allVideosMap) {
        setVideosLoading(true);
        try {
            const res = await getPlaylistById(playlistId);
            if (res && res.data) {
                setSelectedPlaylist(res.data);
                const vidIds = res.data.video || [];
                const vList = vidIds.map(id => typeof id === 'object' ? id : (vMap[id] || { _id: id, title: "Video" })).filter(Boolean);
                setPlaylistVideos(vList);
            }
        } catch (error) {
            console.error("Error loading playlist details:", error);
        } finally {
            setVideosLoading(false);
        }
    }

    async function handleCreatePlaylist(e) {
        e.preventDefault();
        setFormError("");

        if (!name.trim()) {
            setFormError("Playlist name is required.");
            return;
        }
        if (!description.trim()) {
            setFormError("Playlist description is required.");
            return;
        }

        setFormLoading(true);
        try {
            const res = await createPlaylist({ name, description });
            if (res && res.data) {
                setName("");
                setDescription("");
                setShowCreateModal(false);
                const updatedPls = [...playlists, res.data];
                setPlaylists(updatedPls);
                loadPlaylistDetails(res.data._id);
            }
        } catch (error) {
            console.error("Create playlist error:", error);
            setFormError(error.response?.data?.message || "Failed to create playlist.");
        } finally {
            setFormLoading(false);
        }
    }

    async function handleUpdatePlaylist(e) {
        e.preventDefault();
        if (!editingPlaylist) return;

        try {
            const res = await updatePlaylist(editingPlaylist._id, {
                name: editName,
                description: editDescription
            });
            if (res && res.data) {
                setEditingPlaylist(null);
                setPlaylists(prev => prev.map(p => p._id === res.data._id ? res.data : p));
                if (selectedPlaylist?._id === res.data._id) {
                    setSelectedPlaylist(res.data);
                }
            }
        } catch (error) {
            console.error("Update playlist error:", error);
            alert(error.response?.data?.message || "Failed to update playlist.");
        }
    }

    async function handleDeletePlaylist(playlistId) {
        if (!window.confirm("Are you sure you want to delete this playlist?")) return;

        try {
            await deletePlaylist(playlistId);
            const remaining = playlists.filter(p => p._id !== playlistId);
            setPlaylists(remaining);
            if (selectedPlaylist?._id === playlistId) {
                if (remaining.length > 0) {
                    loadPlaylistDetails(remaining[0]._id);
                } else {
                    setSelectedPlaylist(null);
                    setPlaylistVideos([]);
                }
            }
        } catch (error) {
            console.error("Delete playlist error:", error);
            alert(error.response?.data?.message || "Failed to delete playlist.");
        }
    }

    async function handleOpenAddVideoModal() {
        setShowAddVideoModal(true);
        try {
            const res = await getAllVideos();
            if (res && res.data) {
                setAllAvailableVideos(res.data);
            }
        } catch (err) {
            console.error("Error fetching all videos for playlist:", err);
        }
    }

    async function handleAddVideo(video) {
        if (!selectedPlaylist) return;

        try {
            await addVideoToPlaylist(video._id, selectedPlaylist._id);
            setPlaylistVideos(prev => {
                if (prev.some(v => v._id === video._id)) return prev;
                return [...prev, video];
            });
            setSelectedPlaylist(prev => ({
                ...prev,
                video: [...(prev.video || []), video._id]
            }));
            setPlaylists(prev => prev.map(p => {
                if (p._id === selectedPlaylist._id) {
                    return {
                        ...p,
                        video: [...(p.video || []), video._id]
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error("Add video error:", error);
            alert(error.response?.data?.message || "Failed to add video to playlist.");
        }
    }

    async function handleRemoveVideo(videoId) {
        if (!selectedPlaylist) return;

        try {
            await removeVideoFromPlaylist(videoId, selectedPlaylist._id);
            setPlaylistVideos(prev => prev.filter(v => v._id !== videoId));
            setSelectedPlaylist(prev => ({
                ...prev,
                video: (prev.video || []).filter(id => (typeof id === 'object' ? id._id : id) !== videoId)
            }));
            setPlaylists(prev => prev.map(p => {
                if (p._id === selectedPlaylist._id) {
                    return {
                        ...p,
                        video: (p.video || []).filter(id => (typeof id === 'object' ? id._id : id) !== videoId)
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error("Remove video error:", error);
        }
    }

    return (
        <Layout>
            <div className="playlists-page">
                {/* Header Banner */}
                <div className="playlists-header">
                    <div>
                        <h2>📂 Your Playlists</h2>
                        <p>Manage your custom video collections and playlists.</p>
                    </div>
                    <button className="create-playlist-btn" onClick={() => setShowCreateModal(true)}>
                        + Create Playlist
                    </button>
                </div>

                {/* Create Playlist Modal */}
                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="playlist-modal" onClick={e => e.stopPropagation()}>
                            <h3>📂 Create New Playlist</h3>
                            {formError && <div className="error-message">{formError}</div>}
                            <form onSubmit={handleCreatePlaylist}>
                                <div className="form-group">
                                    <label>Playlist Name</label>
                                    <input
                                        type="text"
                                        placeholder="My Favorite Music, Coding Tutorials..."
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Add a description for this playlist..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn" disabled={formLoading}>
                                        {formLoading ? "Creating..." : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Main Content: Playlists Sidebar Grid + Selected Playlist Content */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                        <h3>Loading playlists...</h3>
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="playlists-empty-state">
                        <div className="empty-icon">📂</div>
                        <h3>No Playlists Created Yet</h3>
                        <p>Create custom playlists to save your favorite videos and organize them.</p>
                        <button className="create-playlist-btn" onClick={() => setShowCreateModal(true)}>
                            + Create First Playlist
                        </button>
                    </div>
                ) : (
                    <div className="playlists-layout">
                        {/* Playlists Selection Bar */}
                        <div className="playlists-sidebar-list">
                            <h4>Playlists ({playlists.length})</h4>
                            {playlists.map(pl => {
                                const isSelected = selectedPlaylist?._id === pl._id;
                                const count = pl.video?.length || 0;

                                return (
                                    <div
                                        key={pl._id}
                                        className={`playlist-item-card ${isSelected ? "active" : ""}`}
                                        onClick={() => loadPlaylistDetails(pl._id)}
                                    >
                                        <div className="playlist-card-icon">📂</div>
                                        <div className="playlist-card-text">
                                            <h5>{pl.name}</h5>
                                            <span>{count} {count === 1 ? "video" : "videos"}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Playlist Details & Videos */}
                        <div className="playlist-detail-content">
                            {selectedPlaylist ? (
                                <>
                                    <div className="selected-playlist-header">
                                        <div>
                                            <h3>{selectedPlaylist.name}</h3>
                                            <p className="playlist-desc">{selectedPlaylist.description}</p>
                                            <span className="playlist-badge">
                                                {playlistVideos.length} {playlistVideos.length === 1 ? "video" : "videos"}
                                            </span>
                                        </div>

                                        <div className="playlist-action-btns">
                                            <button
                                                className="action-btn add-vid-pl-btn"
                                                onClick={handleOpenAddVideoModal}
                                                title="Add videos to playlist"
                                            >
                                                ➕ Add Videos
                                            </button>
                                            <button
                                                className="action-btn edit-pl-btn"
                                                onClick={() => {
                                                    setEditingPlaylist(selectedPlaylist);
                                                    setEditName(selectedPlaylist.name);
                                                    setEditDescription(selectedPlaylist.description);
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="action-btn delete-pl-btn"
                                                onClick={() => handleDeletePlaylist(selectedPlaylist._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add Video to Playlist Modal */}
                                    {showAddVideoModal && (
                                        <div className="modal-overlay" onClick={() => setShowAddVideoModal(false)}>
                                            <div className="playlist-modal" onClick={e => e.stopPropagation()}>
                                                <h3>🎬 Add Videos to "{selectedPlaylist.name}"</h3>
                                                <input
                                                    type="text"
                                                    className="video-search-input"
                                                    placeholder="Search videos by title or channel..."
                                                    value={videoSearchQuery}
                                                    onChange={e => setVideoSearchQuery(e.target.value)}
                                                />

                                                <div className="add-video-list">
                                                    {allAvailableVideos
                                                        .filter(v => {
                                                            if (!videoSearchQuery.trim()) return true;
                                                            const q = videoSearchQuery.toLowerCase();
                                                            return (
                                                                v.title?.toLowerCase().includes(q) ||
                                                                v.owner?.username?.toLowerCase().includes(q)
                                                            );
                                                        })
                                                        .map(v => {
                                                            const isAdded = playlistVideos.some(pv => pv._id === v._id);

                                                            return (
                                                                <div key={v._id} className="add-video-item">
                                                                    <div className="add-video-item-info">
                                                                        {v.thumbnail && (
                                                                            <img src={v.thumbnail} alt={v.title} className="add-video-thumb" />
                                                                        )}
                                                                        <div>
                                                                            <div className="add-video-title">{v.title}</div>
                                                                            <div className="add-video-channel">@{v.owner?.username || "Channel"}</div>
                                                                        </div>
                                                                    </div>

                                                                    {isAdded ? (
                                                                        <button
                                                                            className="added-btn-small"
                                                                            onClick={() => handleRemoveVideo(v._id)}
                                                                            title="Click to remove from playlist"
                                                                        >
                                                                            ✓ Added (Remove)
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="add-btn-small"
                                                                            onClick={() => handleAddVideo(v)}
                                                                        >
                                                                            + Add
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                <div className="modal-actions">
                                                    <button className="submit-btn" onClick={() => setShowAddVideoModal(false)}>
                                                        Done
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inline Edit Form */}
                                    {editingPlaylist && editingPlaylist._id === selectedPlaylist._id && (
                                        <form onSubmit={handleUpdatePlaylist} className="edit-playlist-form">
                                            <h4>Edit Playlist Details</h4>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                placeholder="Playlist Name"
                                                required
                                            />
                                            <textarea
                                                value={editDescription}
                                                onChange={e => setEditDescription(e.target.value)}
                                                placeholder="Playlist Description"
                                                rows={2}
                                                required
                                            />
                                            <div className="form-buttons">
                                                <button type="submit" className="save-edit-btn">Save Changes</button>
                                                <button type="button" className="cancel-edit-btn" onClick={() => setEditingPlaylist(null)}>Cancel</button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Video Grid */}
                                    {videosLoading ? (
                                        <div style={{ padding: "40px 0", color: "#aaa", textAlign: "center" }}>
                                            Loading videos...
                                        </div>
                                    ) : playlistVideos.length === 0 ? (
                                        <div className="no-videos-in-playlist">
                                            <p>No videos in this playlist yet.</p>
                                            <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
                                                Browse videos and click "Save to Playlist" to add videos here.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="playlist-videos-grid">
                                            {playlistVideos.map(video => (
                                                <div key={video._id} className="playlist-video-wrapper">
                                                    <VideoCard video={video} />
                                                    <button
                                                        className="remove-video-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveVideo(video._id);
                                                        }}
                                                        title="Remove from playlist"
                                                    >
                                                        ❌ Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ padding: "40px", color: "#aaa", textAlign: "center" }}>
                                    Select a playlist to view its videos.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Playlists;
