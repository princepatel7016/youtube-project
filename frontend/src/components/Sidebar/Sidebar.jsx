import React from 'react'

const Sidebar = () => {
return (
    <div>
    <div
        style={{
        width: "220px",
        background: "#181818",
        color: "white",
        height: "calc(100vh - 60px)",
        padding: "20px",
        }}
    >
        <p>🏠 Home</p>

        <p>🔥 Trending</p>

        <p>📜 History</p>

        <p>👍 Liked Videos</p>

        <p>📁 Playlist</p>
    </div>
    </div>
)
}

export default Sidebar
