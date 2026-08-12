import api from "./api";

export const getChannelStatsApi = async () => {
    const response = await api.get("/Dashbord/stats");
    return response.data;
};

export const getChannelVideosApi = async () => {
    const response = await api.get("/Dashbord/videos");
    return response.data;
};
