import api from "./api";

export const getVideoComments = async (videoId) => {

    const response = await api.get(
        `/comment/getVideocomment/${videoId}`
    );

    return response.data;
};