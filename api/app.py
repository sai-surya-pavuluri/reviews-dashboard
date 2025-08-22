from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def homepage():
    return "<p>Hostaway Living!</p>"

@app.route("/api/reviews/hostaway", methods=['GET'])
def retrieveReviews():
    pass

if __name__ == '__main__':
    app.run()
