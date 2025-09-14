from flask import Flask, render_template
import config

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html",
                           finnhub_key=config.FINNHUB_API_KEY,
                           default_symbol=config.DEFAULT_SYMBOL)

if __name__ == "__main__":
    # On Replit or local
    app.run(host="0.0.0.0", port=5000, debug=False)
