import api from "./api";

export const getAllVideos = async () => {

    const response = await api.get("/videos/getAllvideo");

    return response.data;

};