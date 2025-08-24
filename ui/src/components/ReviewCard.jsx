export default function ReviewCard({ review }) {
  return (
    <div
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        overflow: "hidden",
        border: "1px solid #eee",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div
        style={{
          padding: "16px",
          background: "#f9f9f9",
          fontStyle: "italic",
          fontSize: 15,
          color: "#333",
          lineHeight: 1.5,
          minHeight: "120px"
        }}
      >
        “{review.public_review || "No comment provided."}”
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{ fontWeight: "bold", marginBottom: 4 }}>
          {review.guestName}
        </div>
        <div style={{ color: "#888", fontSize: 14 }}>
          {review.submittedAt?.slice(0, 10)} &nbsp; 
          Rating: ⭐ {review.rating ?? "—"}/5
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {review.cleanliness_rating != null && (
            <Tag label="🧼 Cleanliness:" value={review.cleanliness_rating} />
          )}
          {review.communication_rating != null && (
            <Tag label="💬 Communication:" value={review.communication_rating} />
          )}
          {review.respect_house_rules_rating != null && (
            <Tag label="🏠 House Rules:" value={review.respect_house_rules_rating} />
          )}
        </div>
      </div>
    </div>
  );
}

function Tag({ label, value }) {
  return (
    <div
      style={{
        background: "#eee",
        padding: "4px 8px",
        borderRadius: 8,
        fontSize: 13,
        color: "#333"
      }}
    >
      {label} {value}
    </div>
  );
}
