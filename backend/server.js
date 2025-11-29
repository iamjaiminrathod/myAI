const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PING route - used for keep-alive & health check
app.get("/ping", (req, res) => {
    res.json({ status: "alive" });
});

// GEMINI AI ROUTE
app.post("/generate", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        console.log("AI Response:", data);

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI reply failed";

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Default home test
app.get("/", (req, res) => {
    res.send("AI Backend is running...");
});

// ---------- KEEP SERVER AWAKE (SELF-PING) ----------
setInterval(() => {
    fetch("https://myai-3-rtmk.onrender.com/ping")
        .then(r => console.log("Self-ping OK:", r.status))
        .catch(e => console.log("Self-ping Failed:", e.message));
}, 1000 * 60 * 5); // every 5 minutes
// ----------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
