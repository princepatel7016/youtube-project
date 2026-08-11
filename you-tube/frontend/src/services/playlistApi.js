import api from "./api";

// Create a new playlist
export const createPlaylist = async (data) => {
    const response = await api.post("/playlist/createPlaylist", data);
    return response.data;
};

// Get all playlists created by a user
export const getUserPlaylists = async (userId) => {
    try {
        const response = await api.get(`/playlist/getUserPlaylist/${userId}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return { data: [] };
        }
        throw error;
    }
};

// Get a single playlist by ID
export const getPlaylistById = async (playlistId) => {
    const response = await api.get(`/playlist/getPlaylistById/${playlistId}`);
    return response.data;
};

// Add video to a playlist
export const addVideoToPlaylist = async (videoId, playlistId) => {
    const response = await api.patch(`/playlist/addPlaylist/${videoId}/${playlistId}`);
    return response.data;
};

// Remove video from a playlist
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
    const response = await api.patch(`/playlist/removePlaylist/${videoId}/${playlistId}`);
    return response.data;
};

// Update playlist name & description
export const updatePlaylist = async (playlistId, data) => {
    const response = await api.patch(`/playlist/updatePlaylist/${playlistId}`, data);
    return response.data;
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
    const response = await api.delete(`/playlist/deletePlaylist/${playlistId}`);
    return response.data;
};
