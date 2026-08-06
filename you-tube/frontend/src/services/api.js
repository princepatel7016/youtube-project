import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,   //"Jab bhi request bhejo, browser me jo cookies hain unhe bhi saath bhejna."
});

export default api;