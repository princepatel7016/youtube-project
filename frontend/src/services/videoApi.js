import api from "./api";

export const getAllVideos = async () => {

    const response = await api.get("/videos/getallvideo");
    return response.data
};

export const getVideoById = async (videoId) => {

    const response = await api.get(`/videos/${videoId}`);
    return response.data;
};