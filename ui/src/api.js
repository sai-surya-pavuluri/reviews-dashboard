import axios from "axios";

const api = axios.create({
  baseURL: "https://bug-free-space-goldfish-p5x6r6xvj9vc99p7-1234.app.github.dev",
});

// Get all reviews (no filters)
export const fetchReviews = () => api.get("/api/reviews");

// Toggle review approval
export const toggleApproved = (id, approved) =>
  api.patch(`/api/reviews/${id}`, { approved });

// Fetch with filters
export const fetchReviewsByFilters = async (params) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/reviews/?${query}`);
};

export default api;
