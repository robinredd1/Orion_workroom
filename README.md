# Orion Workroom (Lite) – Finnhub + TradingView

A lightweight web dashboard that looks/feels like a trading "workroom": TradingView chart + Finnhub time & sales via WebSocket.

> **Per your request** the Finnhub API key is embedded directly in `config.py`. This is convenient, but not secure for public repos.

## What you get
- Live chart (TradingView widget) with 1‑min default and MACD/RSI studies
- Time & Sales stream from Finnhub WebSocket
- Quick symbol switcher (top right)
- Clean, Orion‑style layout

## Run locally
```bash
pip install -r requirements.txt
python app.py
```
Open http://localhost:5000

## Run on Replit
1. Create a new Repl (Python).
2. Upload all the files in this zip.
3. Make sure `.replit` exists with: `run = "python app.py"`
4. Click **Run**.
5. Use the webview to open the app.

## Notes
- The TradingView widget and Finnhub WebSocket both require internet access from your browser.
- **Placing orders:** This app is display‑only. Keep Thinkorswim open on another device to place orders.
- If a symbol doesn't stream trades frequently, you may see fewer tape updates. Try liquid tickers (AAPL, NVDA, TSLA, SPY, etc.).

## Change defaults
Edit `config.py`:
```py
FINNHUB_API_KEY = "YOUR_KEY"
DEFAULT_SYMBOL = "AAPL"
```
