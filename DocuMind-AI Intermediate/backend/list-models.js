const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function list() {
    try {
        const models = await ai.models.list();
        // The list() might return an async iterable or an array depending on SDK version
        if (models && models.length) {
            console.log(models.map(m => m.name).filter(n => n.includes('embed')));
        } else {
             // For async iterables
             for await (const model of ai.models.list()) {
                 if (model.name.includes('embed')) console.log(model.name);
             }
        }
    } catch(e) {
        console.error(e);
    }
}
list();
