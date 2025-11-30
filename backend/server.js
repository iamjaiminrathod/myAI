const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"  // ✅ Correct Model
    });

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: userMessage }] }
      ]
    });

    const reply = result.response.text();
    res.json({ reply });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API Failed", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
