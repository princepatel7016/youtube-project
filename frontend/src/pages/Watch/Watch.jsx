import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById } from "../../services/videoApi";


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

        <video
            src={video.videofile}
            controls
            width="100%"
            height="500"
        >
        Your browser does not support the video tag.
        </video>


            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <p>{video.views} Views</p>
        </Layout>
    );

}

export default Watch;