const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKeyExists = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
console.log(`[GEMINI] API key loaded: ${apiKeyExists}`);

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates an embedding for a single text chunk.
 * Validates text, calls Gemini API, and extracts numerical vector.
 */
const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Invalid text provided for embedding');
  }

  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });
    return response.embeddings[0].values;
  } catch (error) {
    console.error('\n[EMBEDDING ERROR]');
    console.error(error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
};

/**
 * Generates embeddings for an array of texts.
 * Embedding generation for RAG pipeline.
 */
const generateEmbeddings = async (texts) => {
  console.log(`\n[EMBEDDING] Starting embedding generation`);
  console.log(`[EMBEDDING] Model: gemini-embedding-001`);
  console.log(`[EMBEDDING] Number of chunks: ${texts.length}`);

  try {
    const embeddings = [];
    for (let i = 0; i < texts.length; i++) {
      console.log(`[EMBEDDING] Generating embedding for chunk ${i + 1}`);
      const vector = await generateEmbedding(texts[i]);
      
      if (i === 0) {
          console.log(`[EMBEDDING] Gemini response received`);
          console.log(`[EMBEDDING] Embedding dimension: ${vector.length}`);
      }
      embeddings.push(vector);
    }
    
    console.log(`[EMBEDDING] Embedding generation completed`);
    return embeddings;
  } catch (error) {
    throw error; // Will be caught by documentController
  }
};

/**
 * Generates embedding for a single query text.
 */
const generateQueryEmbedding = async (query) => {
  return await generateEmbedding(query);
};

module.exports = {
  generateEmbeddings,
  generateQueryEmbedding,
  generateEmbedding
};
