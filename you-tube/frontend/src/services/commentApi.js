import api from "./api";

export const getVideoComments = async (videoId) => {
    const response = await api.get(`/comment/getVideocomment/${videoId}`);
    return response.data;
};

export const addComment = async (videoId, content) => {
    const response = await api.post(`/comment/comment/${videoId}`, {
        content: content,
    });
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comment/deleteComment/${commentId}`);
    return response.data;
};