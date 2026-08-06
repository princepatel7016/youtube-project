import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById, getAllVideos } from "../../services/videoApi";
import "./Watch.css";
import { useNavigate } from "react-router-dom";
import { getVideoComments } from "../../services/commentApi";

function Watch() {

const { videoId } = useParams();    //URL se ID nikal rahi hai.
const navigate = useNavigate();

const [video, setVideo] = useState(null);
const [suggestedVideos, setSuggestedVideos] = useState([]);
const [comments, setComments] = useState([]);

useEffect(() => {
    fetchVideo();
    fetchSuggestedVideos();
    fetchComments();
}, [videoId]);

    async function fetchVideo() {
        try {
            const res = await getVideoById(videoId);
            console.log("getVideoById response:", res);
            // res is the ApiResponse object from backend; video is in res.data
            setVideo(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    if (!video) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    async function fetchSuggestedVideos() {
    try {
        const res = await getAllVideos();
        setSuggestedVideos(res.data);
    } catch (error) {
        console.log(error);
    }
}

async function fetchComments() {

    try {
        const res = await getVideoComments(videoId);
        console.log("Comments:", res);
        setComments(res.data);
    } catch (error) {
        console.log(error);
    }
}

return (
<Layout>

<div className="watch-page">
    <div className="watch-left">
        <video
            className="video-player"
            controls
            src={video.videofile}
            >
            Your browser does not support the video tag.
        </video>

        <h2 className="video-title">
            {video.title}
        </h2>

    <div className="video-stats">
        <span>
            {video.views} Views
        </span>
        <div className="video-actions">
            <button>👍 Like</button>
            <button>🔗 Share</button>
            <button>💾 Save</button>
        </div>
    </div>

    <div className="description-box">
        <p>{video.description}</p>
    </div>
    
</div>


<div className="comments-section">
    <h3>Comments</h3>
    {
        comments.length === 0 ? (
            <p>No Comments Yet</p>
        ) : (
            comments.map((comment) => (
                <div key={comment._id}>
                    <h4>{comment.owner.username}</h4>
                    <p>{comment.content}</p>
                </div>
            ))
        )
    }
</div>


<div className="watch-right">
    <h3 className="suggested-title">
        Suggested Videos
    </h3>

    {suggestedVideos.map((item) => (
        <div
            key={item._id}
            onClick={() => navigate(`/watch/${item._id}`)}
            style={{
            marginBottom: "15px",
            cursor: "pointer"
    }}
>
            <img
                src={item.thumbnail}
                alt={item.title}
                width="100%"
            />
            <h4>{item.title}</h4>
        </div>
    ))}
</div>

</div>

</Layout>
);

}

export default Watch;
