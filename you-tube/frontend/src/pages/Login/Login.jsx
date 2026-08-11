import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";
import "./Login.css";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!identifier.trim() || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            // Pass identifier as both username and email to handle either
            await login({
                username: identifier,
                email: identifier,
                password: password,
            });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Sign In</h2>
                    <p className="auth-subtitle">to continue to YouTube</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="identifier">Username or Email</label>
                            <input
                                id="identifier"
                                type="text"
                                placeholder="Enter username or email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
