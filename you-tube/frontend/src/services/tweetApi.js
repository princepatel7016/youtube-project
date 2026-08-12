import api from "./api";

export const createTweetApi = async (content) => {
    const response = await api.post("/Tweet/createTweet", { content });
    return response.data;
};

export const getAllTweetsApi = async (page = 1, limit = 20) => {
    const response = await api.get(`/Tweet/getTweet?page=${page}&limit=${limit}`);
    return response.data;
};

export const getUserTweetsApi = async (userId) => {
    const response = await api.get(`/Tweet/getusertweet/${userId}`);
    return response.data;
};

export const updateTweetApi = async (tweetId, content) => {
    const response = await api.patch(`/Tweet/updatetweet/${tweetId}`, { content });
    return response.data;
};

export const deleteTweetApi = async (tweetId) => {
    const response = await api.delete(`/Tweet/deletetweet/${tweetId}`);
    return response.data;
};
