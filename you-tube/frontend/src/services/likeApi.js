import api from "./api";

export const toggleVideoLike = async (videoId) => {
    const response = await api.post(`/Like/togglevideolike/v/${videoId}`);
    return response.data;
};

export const getLikedVideos = async () => {
    const response = await api.get("/Like/videos");
    return response.data;
};
