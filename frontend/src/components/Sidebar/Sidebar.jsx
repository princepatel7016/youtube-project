import "./Sidebar.css";

function Sidebar(){

    return(

        <div className="sidebar">
            <div className="sidebar-menu">
                <div className="sidebar-item">
                    🏠 Home
                </div>

                <div className="sidebar-item">
                    🔥 Trending
                </div>

                <div className="sidebar-item">
                    📺 Subscriptions
                </div>

                <div className="sidebar-item">
                    📜 History
                </div>

                <div className="sidebar-item">
                    👍 Liked Videos
                </div>

                <div className="sidebar-item">
                    📂 Playlist
                </div>
                
                <div className="sidebar-item">
                    ⬆ Upload
                </div>
            </div>
        </div>
    )

}

export default Sidebar;