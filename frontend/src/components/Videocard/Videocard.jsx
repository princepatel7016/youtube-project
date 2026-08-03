import "./VideoCard.css";
import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {

    const navigate = useNavigate();  //Ye React Router ka hook hai.Ye page change karne ke liye use hota hai.

return (
    <div
    className="video-card"
    onClick={() => navigate(`/watch/${video._id}`)}
    >
        <img
        className="thumbnail"
        src={video.thumbnail}
        alt={video.title}
        />

    <div className="video-info">
        <div className="video-details">

        <h3 className="video-title">{video.title}</h3>

        <p className="channel-name">My Channel</p>

        <p className="views">{video.views} Views</p>

        </div>
    </div>

    </div>
  );
}

export default VideoCard;