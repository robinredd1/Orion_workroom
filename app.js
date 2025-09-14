(function(){
  let tvWidget = null;
  let ws = null;
  let currentSymbol = (window.DEFAULT_SYMBOL || "AAPL").toUpperCase();

  function initTV(symbol){
    if (tvWidget) {
      // remove old widget container contents
      document.getElementById("tv_chart_container").innerHTML = "";
    }
    tvWidget = new TradingView.widget({
      symbol: symbol,
      interval: "1",
      container_id: "tv_chart_container",
      library_path: "/",
      autosize: true,
      timezone: "America/Chicago",
      theme: "light",
      style: "1",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      calendar: true,
      studies: ["MACD@tv-basicstudies","RSI@tv-basicstudies"]
    });
  }

  function setStatus(text){
    const el = document.getElementById("wsStatus");
    el.textContent = "WS: " + text;
  }

  function appendTape(msg){
    const el = document.getElementById("tape");
    const line = document.createElement("div");
    line.textContent = msg;
    el.prepend(line);
    // keep at most ~200 lines
    while (el.children.length > 200) el.removeChild(el.lastChild);
  }

  function updateQuote({p, b, a, v}){
    if (p !== undefined) document.getElementById("qLast").textContent = p.toFixed(4);
    if (b !== undefined) document.getElementById("qBid").textContent  = b.toFixed(4);
    if (a !== undefined) document.getElementById("qAsk").textContent  = a.toFixed(4);
    if (v !== undefined) document.getElementById("qVol").textContent  = v.toLocaleString();
  }

  function wsSubscribe(symbol){
    if (!window.FINNHUB_KEY) { setStatus("No API key"); return; }
    const url = "wss://ws.finnhub.io?token=" + encodeURIComponent(window.FINNHUB_KEY);

    if (ws) { try { ws.close(); } catch(e){} }
    ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus("connected");
      // Finnhub trade stream
      ws.send(JSON.stringify({"type":"subscribe","symbol": symbol}));
      document.getElementById("qSymbol").textContent = symbol;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "trade" && data.data) {
          for (const t of data.data) {
            appendTape(new Date(t.t).toLocaleTimeString() + " " + t.s + " " + t.p);
            updateQuote({p: t.p});
          }
        } else if (data.type === "ping") {
          // ignore
        }
      } catch (e) {
        console.error(e);
      }
    };

    ws.onclose = () => setStatus("closed");
    ws.onerror = () => setStatus("error");
  }

  function loadSymbolFromInput(){
    const val = document.getElementById("symbolInput").value.trim().toUpperCase();
    if (!val) return;
    currentSymbol = val;
    initTV(currentSymbol);
    wsSubscribe(currentSymbol);
  }

  // UI init
  window.addEventListener("load", () => {
    document.getElementById("symbolInput").value = currentSymbol;
    document.getElementById("qSymbol").textContent = currentSymbol;
    document.getElementById("loadBtn").addEventListener("click", loadSymbolFromInput);
    initTV(currentSymbol);
    wsSubscribe(currentSymbol);
  });
})();