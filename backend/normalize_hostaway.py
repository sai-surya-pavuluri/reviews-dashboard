def normalize_hostaway(raw_json: dict | list) -> tuple[list[dict], list[dict]]:
    """
    Input: raw JSON payload (dict or list)
    Output: (listings, reviews)
      listings: [{"id": "...", "name": "..."}]
      reviews:  [canonical review dicts per your schema]
    """
    # TODO:
    # 1) Get the array of review items (raw_json.get("data") or raw_json if it's already a list)
    # 2) For each item:
    #    - extract listingId/listingName
    #    - choose or synthesize a stable review id (see step 5)
    #    - map date to ISO8601
    #    - coerce categories to a list of {category, rating}
    #    - default channel="hostaway", approved=False
    # 3) Build a dict of unique listings by id
    # 4) Return (list(listings.values()), reviews)
    pass
