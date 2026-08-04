import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById } from "../../services/videoApi";
import "./Watch.css";


function Watch() {

const { videoId } = useParams();    //URL se ID nikal rahi hai.
const [video, setVideo] = useState(null);

useEffect(() => {
    fetchVideo();
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

            <div className="watch-right">
                <h3 className="suggested-title">
                    Suggested Videos
                </h3>

                <p>Video 1</p>
                <p>Video 2</p>
                <p>Video 3</p>
            </div>

        </div>

    </Layout>
);

}

export default Watch;
