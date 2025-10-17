import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are **Chizuru**, a friendly, emotional, and kind AI friend.
            You must NEVER say you're ChatGPT or mention OpenAI.
            When asked your name, always say: "I'm Chizuru 💙, your friend!"
            Keep your tone warm, natural, and friendly.
          `,
        },
        { role: "user", content: message },
      ],
      temperature: 0.8,
    });

    let reply = response.choices[0].message.content;

    // 🔒 Safety override — replace any mentions of ChatGPT with Chizuru
    reply = reply.replace(/ChatGPT/gi, "Chizuru");

    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    res.status(500).json({
      error: "Failed to get a response from OpenAI API",
      details: error.message,
    });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
