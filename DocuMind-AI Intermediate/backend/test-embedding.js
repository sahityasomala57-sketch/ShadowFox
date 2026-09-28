const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    const modelsToTest = ['text-embedding-004', 'embedding-001', 'text-embedding-004'];
    for (const m of modelsToTest) {
        try {
            console.log("Testing:", m);
            const response = await ai.models.embedContent({
                model: m,
                contents: "Test"
            });
            console.log("Success with:", m);
            return;
        } catch(e) {
            console.log("Failed:", m, e.message);
        }
    }
}
test();
