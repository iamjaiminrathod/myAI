import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req,res)=>{
  const prompt = req.body.prompt;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages:[{role:"user", content: prompt}]
      })
    });
    const data = await response.json();
    res.json(data);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(3000, ()=>console.log("Backend running on port 3000"));
