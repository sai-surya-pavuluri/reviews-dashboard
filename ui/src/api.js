import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

export const toggleApproved = (id, approved) =>
  api.patch(`/api/reviews/${id}`, { approved });

export const fetchReviews = async (params) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/reviews/?${query}`);
};

export default api;
