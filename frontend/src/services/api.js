import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,   //"Jab bhi request bhejo, browser me jo cookies hain unhe bhi saath bhejna."
});

export default api;