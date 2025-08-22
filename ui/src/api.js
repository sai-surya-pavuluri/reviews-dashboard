import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:1234" });

export const fetchReviews = (params) => api.get("/api/reviews", { params });
export const toggleApproved = (id, approved) => api.patch(`/api/reviews/${id}`, { approved });
export const fetchPublicReviews = (listingId) => api.get("/public/reviews", { params: { listingId } });

export default api;
