import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import "../Login/Login.css";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
            setError("All fields except cover image are required.");
            return;
        }

        if (!avatar) {
            setError("Please upload an avatar image.");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("avatar", avatar);
        if (coverImage) {
            formData.append("coverimage", coverImage);
        }

        setLoading(true);
        try {
            await register(formData);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="auth-container">
                <div className="auth-card" style={{ maxWidth: "480px" }}>
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">to start watching & uploading videos</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="e.g. John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="e.g. johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="e.g. john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="avatar">Avatar Image (Required)</label>
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="coverImage">Cover Image (Optional)</label>
                            <input
                                id="coverImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
