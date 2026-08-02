import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { getAllVideos } from "../../services/videoApi";

function Home() {

    const [videos, setVideos] = useState([]);

    useEffect(() => {

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

        </Layout>

    );

}

export default Home;