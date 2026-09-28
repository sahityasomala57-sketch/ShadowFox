const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3000;

// Check whether API key is loaded
console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

// Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Middleware
app.use(express.json());
app.use(express.static("public"));

// AI generation API
app.post("/api/generate", async (req, res) => {

    try {

        const { prompt } = req.body;

        console.log("Request received");

        // Validate input
        if (!prompt || prompt.trim() === "") {

            return res.status(400).json({
                error: "Please enter some text."
            });

        }

        // Send request to Gemini
        const response = await ai.models.generateContent({

            model: "gemini-3.1-flash-lite",

            contents: prompt

        });

        console.log("Gemini response received");

        // Send AI response to frontend
        res.json({

            result: response.text

        });

    } catch (error) {

        console.error("========== GEMINI ERROR ==========");
        console.error(error);
        console.error("==================================");

        res.status(500).json({

            error: "Gemini API request failed. Please try again."

        });

    }

});

// Start server
app.listen(PORT, () => {

    console.log(
        `StudyMate running at http://localhost:${PORT}`
    );

});