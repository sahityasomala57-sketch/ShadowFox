const { generateQueryEmbedding } = require('../services/embeddingService');
const { searchSimilarChunks } = require('../services/vectorService');
const { generateAnswer } = require('../services/answerService');

const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === '') {
            return res.status(400).json({ error: 'Empty question provided' });
        }

        // 1. Convert question into an embedding
        const queryEmbedding = await generateQueryEmbedding(question);

        // 2. Search ChromaDB
        const searchResults = await searchSimilarChunks(queryEmbedding, 5); // top 5 chunks
        
        const distances = searchResults.distances[0]; // array of distances
        const documents = searchResults.documents[0]; // array of text chunks
        const metadatas = searchResults.metadatas[0]; // array of metadatas
        
        if (!documents || documents.length === 0) {
            return res.status(404).json({ error: 'No uploaded documents or no relevant chunks found.' });
        }
        
        // Define a threshold for relevance based on cosine distance.
        // ChromaDB with cosine distance: lower is more similar.
        // We'll proceed with generating the answer, but if nothing is truly relevant,
        // the prompt instructions will force Gemini to say "I couldn't find this information..."
        
        const sources = documents.map((doc, index) => ({
            text: doc,
            filename: metadatas[index].filename,
            chunk_number: metadatas[index].chunk_number,
            similarity: 1 - (distances[index] || 0) // rough conversion for display
        }));

        // 3. Grounded Answer Generation
        const answer = await generateAnswer(question, documents);

        // Check if Gemini used the fallback phrase
        if (answer.trim().includes("I couldn't find this information in the uploaded documents.")) {
             return res.status(200).json({
                answer: "I couldn't find this information in the uploaded documents.",
                sources: [] // No relevant sources if not found
            });
        }

        // 4. Return Answer and Sources
        res.status(200).json({
            answer: answer,
            sources: sources
        });

    } catch (error) {
        console.error('Question error:', error);
        res.status(500).json({ error: 'Backend failure during question processing: ' + error.message });
    }
};

module.exports = {
    askQuestion
};
