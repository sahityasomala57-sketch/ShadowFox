const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
        const json = JSON.parse(data);
        const generateModels = json.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
        console.log("Generate models:", generateModels.map(m => m.name));
    } catch (e) {
        console.error(e);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
