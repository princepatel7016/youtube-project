import api from "./api";

export const loginUser = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
};

export const registerUser = async (formData) => {
    const response = await api.post("/users/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/users/logout");
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/users/current-user");
    return response.data;
};

export const updateAccountDetails = async (details) => {
    const response = await api.patch("/users/update-account", details);
    return response.data;
};

export const updateUserAvatar = async (formData) => {
    const response = await api.patch("/users/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateUserCoverImage = async (formData) => {
    const response = await api.patch("/users/cover-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.post("/users/change-password", passwordData);
    return response.data;
};
