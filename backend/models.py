from api.db import db

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    external_id = db.Column(db.String(64), nullable=False)
    review_type   = db.Column(db.String(32), nullable=False)
    status        = db.Column(db.String(32), nullable=False, default="published")
    rating        = db.Column(db.Float)
    public_review          = db.Column(db.Text)

    cleanliness_rating         = db.Column(db.Float, nullable=False)
    communication_rating       = db.Column(db.Float, nullable=False)
    respect_house_rules_rating = db.Column(db.Float, nullable=False)

    guest_name    = db.Column(db.String(255), nullable=False)
    listing_name  = db.Column(db.String(255), nullable=False)
    submitted_at  = db.Column(db.DateTime(timezone=True), nullable=False)
    channel       = db.Column(db.String(32), nullable=False, default="hostaway")
    approved      = db.Column(db.Boolean, nullable=False, default=False)

    __table_args__ = (
        db.UniqueConstraint("channel", "external_id", name="uq_channel_external_id"),
        db.Index("idx_reviews_listing_date", "listing_name", "submitted_at"),
    )


    def to_dict(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "review_type": self.review_type,
            "status": self.status,
            "rating": self.rating,
            "public_review": self.public_review,
            "cleanliness_rating": self.cleanliness_rating,
            "communication_rating": self.communication_rating,
            "respect_house_rules_rating": self.respect_house_rules_rating,
            "guest_name": self.guest_name,
            "listing_name": self.listing_name,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "channel": self.channel,
            "approved": self.approved,
        }
