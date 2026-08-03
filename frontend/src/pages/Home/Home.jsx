import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { getAllVideos } from "../../services/videoApi";
import VideoCard from "../../components/VideoCard/VideoCard";
import "./Home.css";

function Home() {

    const [videos, setVideos] = useState([]);
    //useState data ko store karta hai.

    useEffect(() => {
        //Page load hone ke baad ye kaam karna."
        fetchVideos();
    }, []);

    async function fetchVideos() {

        try {
            const response = await getAllVideos();
            console.log(response);
            setVideos(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1>Home Page</h1>
            <h2>Total Videos : {videos.length}</h2>

        <div className="home-container">
            {
                videos.map((video)=>(
                <VideoCard key={video._id} video={video}/>
                ))
            }
        </div>
        </Layout>
    );
}

export default Home;

//Parent(home) child(videcard) ko video bhej raha hai. 