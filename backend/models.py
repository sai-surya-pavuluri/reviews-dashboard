from api.db import db

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(32), nullable=False, default="hostaway")

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
    channel       = db.Column(db.String(32), nullable=False, default="unknown")
    approved      = db.Column(db.Boolean, nullable=False, default=False)

    __table_args__ = (
        db.UniqueConstraint("source", "external_id", name="uq_source_external_id"),
        db.Index("idx_reviews_listing_date", "listing_name", "submitted_at"),
    )
