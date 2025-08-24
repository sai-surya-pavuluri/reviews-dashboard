import { useEffect, useState } from "react";
import { fetchReviews } from "../api";
import ReviewCard from "./ReviewCard";
import propertyImage from '../assets/property.png';

export default function PropertyPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchReviews({ approved: "true" });
        setReviews(data.reviews || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      {/* Property Header */}
      <img
        src={propertyImage}
        alt="Property"
        style={{ width: "100%", height: "auto", borderRadius: 12 }}
      />
      <h2 style={{ marginTop: 16 }}>Beautiful London Apartment</h2>
      <p style={{ color: "#666", fontSize: 15 }}>
        Discover what guests are saying about this elegant London property.
      </p>

      {/* Review Section */}
      {loading ? (
        <p>Loading reviews…</p>
      ) : !reviews.length ? (
        <p>No approved reviews yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginTop: 24
          }}
        >
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
