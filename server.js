const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.get("/", async (req, res) => {
  try {
    const tokenRes = await fetch(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "grant_type=client_credentials&client_id=rintu-api-client&client_secret=mmbolKN31P1b2FffVzFUUeThPxGbLJyJ"
      }
    );
    const td = await tokenRes.json();
    const fr = await fetch("https://opensky-network.org/api/states/all", {
      headers: { "Authorization": "Bearer " + td.access_token }
    });
    const data = await fr.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Running!"));
