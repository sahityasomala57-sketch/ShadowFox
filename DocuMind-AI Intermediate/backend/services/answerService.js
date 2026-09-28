const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Grounded answer generation using Gemini.
 * Constructs prompt with context and ensures grounding.
 */
const generateAnswer = async (question, contextChunks) => {
  // Context construction
  const contextText = contextChunks.join('\n\n---\n\n');

  // Grounding requirements
  const prompt = `You are a document question-answering assistant.
Answer the user's question ONLY using the supplied document context.
Do not use information from your general knowledge.
If the answer cannot be found in the supplied context, respond exactly:
I couldn't find this information in the uploaded documents.
Do not invent facts.

Document Context:
${contextText}

Question:
${question}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error generating answer:', error);
    throw new Error('Failed to generate answer from AI model');
  }
};

module.exports = {
  generateAnswer
};
