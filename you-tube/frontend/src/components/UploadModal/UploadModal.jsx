import React, { useState } from "react";
import { uploadVideo } from "../../services/videoApi";
import "./UploadModal.css";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !description.trim()) {
            setError("Title and description are required.");
            return;
        }

        if (!videoFile || !thumbnail) {
            setError("Please select both video file and thumbnail image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videofile", videoFile);
        formData.append("thumbnail", thumbnail);

        setLoading(true);
        try {
            await uploadVideo(formData);
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setThumbnail(null);
            if (onUploadSuccess) onUploadSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to upload video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Upload Video</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Add a title that describes your video"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Tell viewers about your video"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Video File (Required)</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Thumbnail Image (Required)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-upload-btn" disabled={loading}>
                        {loading ? "Uploading to Cloudinary..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;
