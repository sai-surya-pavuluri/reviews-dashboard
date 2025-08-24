import { useEffect, useState } from "react";
import { fetchReviews } from "../api";
import ReviewCard from "./ReviewCard";
import propertyImage from '../assets/property.png';

export default function PropertyPage() {
  const [reviews, setReviews] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
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

  const uniqueProperties = Array.from(new Set(reviews.map(r => r.listing_name)));

  const filteredReviews = selectedProperty
    ? reviews.filter(r => r.listing_name === selectedProperty)
    : reviews;

  return (
    <div style={{
        width: "1100px",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
      }}>
        
      <img
        src={propertyImage}
        alt="Property"
        style={{ width: "100%", height: "350px", borderRadius: 12 }}
      />
      <h2 style={{ marginTop: 16 }}>Guest Reviews</h2>
      <p style={{ color: "#666", fontSize: 15 }}>
        Select a property to view approved guest feedback.
      </p>

      <div style={{ margin: "16px 0" }}>
        <label htmlFor="propertySelect" style={{ marginRight: 8 }}>Property:</label>
        <select
          id="propertySelect"
          value={selectedProperty}
          onChange={e => setSelectedProperty(e.target.value)}
        >
          <option value="">All</option>
          {uniqueProperties.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading reviews…</p>
      ) : !filteredReviews.length ? (
        <p>No approved reviews yet for this property.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginTop: 24
          }}
        >
          {filteredReviews.map(r => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
