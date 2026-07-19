require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Use memory storage — disk writes are unreliable on Vercel serverless
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
    res.send("🚀 EcoSort AI Backend Running");
});

app.post("/analyze", upload.single("image"), async (req, res) => {
    try {
        console.log("✅ Analyze request received");

        if (!req.file) {
            return res.status(400).json({
                error: "No image uploaded",
            });
        }

        // File is already in memory — no disk read needed
        const base64Image = req.file.buffer.toString("base64");

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemini-2.5-flash",
                response_format: { type: "json_object" },
                max_tokens: 500,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `You are EcoSort AI.
Analyze this waste image.
Return ONLY valid JSON.
{
  "waste": "",
  "category": "",
  "bin": "",
  "recyclable": "",
  "tip": ""
}`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${req.file.mimetype};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://ecosort-ai.vercel.app",
                    "X-Title": "EcoSort AI"
                }
            }
        );

        let text = response.data.choices[0]?.message?.content;
        if (!text) {
            throw new Error("No response received from the AI model.");
        }

        console.log("Raw Response Content:", text);

        // Extract JSON if it is wrapped in markdown or other text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        const result = JSON.parse(text.trim());
        res.json(result);

    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

const server = app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});

module.exports = app;