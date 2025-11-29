const express = require('express');
const fetch = require('node-fetch'); // v2
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html

// Gemini endpoint
app.post('/generate', async (req, res) => {
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

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI reply failed";

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Backend running on port ${PORT}`)
);
