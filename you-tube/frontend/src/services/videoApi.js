import api from "./api";

export const getAllVideos = async () => {
    const response = await api.get("/videos/getallvideo");
    return response.data;
};

export const getVideoById = async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
};

export const uploadVideo = async (formData) => {
    const response = await api.post("/videos/videoadd", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};