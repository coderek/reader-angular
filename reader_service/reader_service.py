# py3
import json
import sys

from flask import Flask, request, make_response

sys.path.append('/home/coderek/Code/reader/reader_service')

from feed_service import fetch_feed

from flask_cors import CORS


counter = 1

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['POST'])
def feed_fetcher():
    url = request.json['url']
    global counter
    feed = fetch_feed(url, counter)
    if url == "test_feed":
        counter+=1
    
    serialized = json.dumps(feed, ensure_ascii=False)
    resp = make_response(serialized)
    resp.headers['Content-Type'] = 'application/json'
    return resp


if __name__ == "__main__":
    app.run()
