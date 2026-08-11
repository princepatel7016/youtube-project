import api from "./api";

// Toggle subscription to a channel
export const toggleSubscription = async (channelId) => {
    const response = await api.post(`/Subsctiption/c/${channelId}`);
    return response.data;
};

// Get list of subscribers for a channel
export const getChannelSubscribers = async (channelId) => {
    const response = await api.get(`/Subsctiption/u/${channelId}`);
    return response.data;
};

// Get list of channels subscribed by a user
export const getSubscribedChannels = async (userId) => {
    const response = await api.get(`/Subsctiption/c/${userId}`);
    return response.data;
};
