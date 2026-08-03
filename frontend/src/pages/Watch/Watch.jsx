import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById } from "../../services/videoApi";

function Watch() {

    const { videoId } = useParams();    //URL se ID nikal rahi hai.
    const [video, setVideo] = useState(null);
    useEffect(() => {
        fetchVideo();
    }, []);

    async function fetchVideo() {
        try {
            const response = await getVideoById(videoId);
            console.log(response);
            setVideo(response.data.data);
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
console.log(video);
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