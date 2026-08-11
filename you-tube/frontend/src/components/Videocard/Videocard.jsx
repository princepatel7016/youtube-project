import React from "react";
import { useNavigate } from "react-router-dom";
import "./Videocard.css";

function VideoCard({ video }) {
    const navigate = useNavigate();

    const formatDuration = (seconds) => {
        if (!seconds) return null;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="video-card" onClick={() => navigate(`/watch/${video._id}`)}>
            <div className="thumbnail-container">
                <img className="thumbnail" src={video.thumbnail} alt={video.title} />
                {video.duration ? (
                    <span className="video-duration">{formatDuration(video.duration)}</span>
                ) : null}
            </div>

            <div className="video-info">
                {video.owner?.avatar ? (
                    <img className="channel-avatar" src={video.owner.avatar} alt={video.owner.username} />
                ) : (
                    <div className="channel-avatar-placeholder">
                        {(video.owner?.username || "C")[0].toUpperCase()}
                    </div>
                )}

                <div className="video-details">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="channel-name">{video.owner?.username || "Channel"}</p>
                    <p className="views">{video.views} views</p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;