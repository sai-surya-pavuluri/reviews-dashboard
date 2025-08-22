from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/health")
def apiHealth():
    print("Yay! I'm still alive :)")
    return {"ok": True}

@app.route("/api/reviews/hostaway", methods=['GET'])
def retrieveReviews():
    pass

if __name__ == '__main__':
    app.run(debug=True, port=1234)
