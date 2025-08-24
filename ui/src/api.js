import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// // Get all reviews (no filters)
// export const fetchReviews = () => api.get("/api/reviews");

// Toggle review approval
export const toggleApproved = (id, approved) =>
  api.patch(`/api/reviews/${id}`, { approved });

// Fetch with filters
export const fetchReviews = async (params) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/reviews/?${query}`);
};

export default api;
