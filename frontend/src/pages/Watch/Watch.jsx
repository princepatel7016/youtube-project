import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { getVideoById } from "../../services/videoApi";

function Watch() {

    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    useEffect(() => {
        fetchVideo();
    }, []);

    async function fetchVideo() {
        try {
            const response = await getVideoById(videoId);
            console.log(response);
            setVideo(response.data);
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
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <p>{video.views} Views</p>
        </Layout>
    );
}

export default Watch;