require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

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

        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString("base64");

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "meta-llama/llama-3.2-11b-vision-instruct:free",

                max_tokens: 300,

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
  "waste":"",
  "category":"",
  "bin":"",
  "recyclable":"",
  "tip":""
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
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "EcoSort AI"
                }
            }
        );

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        let text = response.data.choices[0].message.content;

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const result = JSON.parse(text);

        res.json(result);

    } catch (err) {

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});