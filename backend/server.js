const express = require('express');      // CommonJS
const fetch = require('node-fetch');      // node-fetch v2
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    // OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", data); // DEBUG

    // Safer reply extraction
    let reply = "No reply from AI";
    if (data.choices && data.choices.length > 0) {
      if (data.choices[0].message && data.choices[0].message.content) {
        reply = data.choices[0].message.content;
      } else if (data.choices[0].text) {
        reply = data.choices[0].text;
      }
    }

    res.json({ reply });

  } catch (err) {
    console.error("Error in /generate:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
