from flask import Flask, request
from flask import send_from_directory
from flask_cors import CORS
from backend.models import Review
from api.db import db
from dateutil import parser
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory("static", path)

@app.route("/api/health")
def apiHealth():
    print("Yay! I'm still alive :)")
    return {"ok": True}

@app.route("/api/reviews/hostaway", methods=['POST'])
def createReview():
    print("Received payload:", request.json)
    payload = request.json

    if payload.get("status") != "success":
        return {"error": "Invalid response structure"}, 400

    reviews = payload["result"]
    inserted_ids = []

    for review_data in reviews:
        categories = review_data.get("reviewCategory", [])

        cleanliness = communication = respect = None
        for c in categories:
            if c["category"] == "cleanliness":
                cleanliness = c["rating"]
            elif c["category"] == "communication":
                communication = c["rating"]
            elif c["category"] == "respect_house_rules":
                respect = c["rating"]

        review = Review(
            external_id=str(review_data["id"]),
            review_type=review_data["type"],
            status=review_data.get("status", "published"),
            rating=review_data.get("rating"),
            public_review=review_data.get("publicReview"),
            cleanliness_rating=cleanliness,
            communication_rating=communication,
            respect_house_rules_rating=respect,
            guest_name=review_data["guestName"],
            listing_name=review_data["listingName"],
            submitted_at=parser.parse(review_data["submittedAt"]),
            channel="hostaway",
            approved=False,
        )

        db.session.add(review)
        db.session.commit()
        inserted_ids.append(review.id)

    return {"inserted_ids": inserted_ids}, 201

@app.route("/api/reviews/", methods=["GET"])
def retrieveReviews():
    listing_name = request.args.get("listingName")
    min_rating = request.args.get("minRating", type=float)
    approved = request.args.get("approved")
    channel = request.args.get("channel")

    query = Review.query

    if listing_name and listing_name != 'undefined':
        query = query.filter_by(listing_name=listing_name)
    if min_rating and min_rating != 'undefined':
        query = query.filter(Review.rating >= min_rating)
    if approved in ["true", "false"] :
        query = query.filter_by(approved=(approved == "true"))
    if channel and channel != 'undefined':
        query = query.filter_by(channel=channel)
    reviews = query.all()
    return {"reviews": [r.to_dict() for r in reviews]}


@app.route("/api/reviews/<int:review_id>", methods=['PATCH'])
def modifyReview(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {"error": "Review not found"}, 404

    data = request.json
    approved = data.get("approved")
    if approved is None:
        return {"error": "Missing 'approved' field"}, 400
    review.approved = approved

    db.session.commit()
    return {"message": "Review approved successfully"}

@app.route("/api/reviews/delete_all", methods=["DELETE"])
def delete_all_reviews():
    Review.query.delete()
    db.session.commit()
    return {"message": "All reviews deleted."}, 200


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
