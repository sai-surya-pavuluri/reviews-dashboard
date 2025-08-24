# Flex Living Practical Assessment - Documentation

## Candidate: Sai Surya Pavuluri

## Role: AI Engineer

---

### 🔧 Tech Stack Used

* **Backend:** Flask (Python), SQLAlchemy, SQLite
* **Frontend:** React (Vite), plain CSS

---

### 📦 Overview of the Implementation

This documentation provides an overview of what was implemented as part of this Flex Living practical assessment:

#### 1. **Hostaway Integration (Mocked)**

* The provided JSON review data was used to simulate an integration with the Hostaway Reviews API.
* Data is parsed and normalized into a clean structure.
* Categories like cleanliness, communication, and house rules are extracted and saved.
* Data is persisted to an SQLite database using SQLAlchemy via a custom POST route: `/api/reviews/hostaway`

#### 2. **Manager Dashboard**

* A user-friendly dashboard is built using React with the following features:

  * Filter reviews by rating, channel, approval status, and property.
  * Sort any column using up/down arrows.
  * View KPIs like total reviews, average rating, and approval %.
  * Spot trends through a weekday-wise average rating bar chart.
  * Expand/collapse filter panel similar to modern booking dashboards.
  * Toggle review approval state (checkbox) with instant DB sync.

#### 3. **Review Display Page**

* Public-facing review display section replicates the look of Flex Living's property layout.
* Shows only reviews explicitly approved by the manager.
* User can select property from a dropdown — approved reviews for the selected property are displayed.
* Each review is shown as a card with tags for subratings (cleanliness, communication, etc).

---

### 🔍 Google Reviews Exploration

As part of the final step, I briefly explored the possibility of integrating Google Reviews using the Google Places API. At first glance, it seemed promising, but there were a few complications. The main issue was that Google requires an accurate place_id to fetch reviews, and getting that reliably for all mocked properties wasn’t straightforward — especially if the property names don’t exactly match what's listed on Google Maps. Even when a valid place_id was available, the API only returns limited recent reviews, and those too would be read-only. This made it difficult to use for internal approval or moderation flows like ones in the Manager Dashboard. In the end, while the integration was technically possible, it would require more setup — including verified Google business listings and manual mapping of each property — which felt abit far too stretch for this assessment given the time constraints too. So I decided to document the findings here rather than implement anything directly.

---

### ⚙️ API Behaviors

* `GET /api/reviews/` - Retrieves reviews with optional filters: `listingName`, `approved`, `minRating`, `channel`
* `POST /api/reviews/hostaway` - Accepts mocked Hostaway review JSON and persists data
* `PATCH /api/reviews/<id>` - Updates the `approved` field
* `DELETE /api/reviews/delete_all` - Dev-only endpoint to clear DB
* `GET /api/health` - Simple healthcheck endpoint

---

### 🚀 Setup Instructions

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py  # Runs at http://localhost:5000

# Frontend
cd ui
npm install
npm run dev  # Runs at http://localhost:5173
```

---

### 🙌 Final Notes

The assessment has been designed with scalability and real-world data handling in mind. The dashboard allows property managers to take fast and confident actions, and the public review section makes sure only curated reviews are shown — just as Flex intended.

Looking forward to the next step!

— Sai

