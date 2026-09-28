const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Hi"
        });
        console.log("Success with gemini-2.5-flash:", response.text);
    } catch(e) {
        console.error("Failed:", e.message, e);
    }
}
test();
