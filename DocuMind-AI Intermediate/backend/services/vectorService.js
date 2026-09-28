const fs = require('fs');
const path = require('path');

const VECTOR_FILE = path.join(__dirname, '../uploads/vectors.json');

const getCollection = () => {
    if (fs.existsSync(VECTOR_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(VECTOR_FILE, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
};

const saveCollection = (data) => {
    // Ensure directory exists
    const dir = path.dirname(VECTOR_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(VECTOR_FILE, JSON.stringify(data));
};

const storeEmbeddings = async (chunks, embeddings, metadata, documentId) => {
    const collection = getCollection();
    
    chunks.forEach((chunk, index) => {
        collection.push({
            id: `${documentId}-chunk-${index}`,
            embedding: embeddings[index],
            metadata: {
                ...metadata,
                chunk_number: index,
                document_id: documentId
            },
            document: chunk
        });
    });

    saveCollection(collection);
};

const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const searchSimilarChunks = async (queryEmbedding, nResults = 5) => {
    const collection = getCollection();
    
    const scoredChunks = collection.map(item => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding)
    }));

    scoredChunks.sort((a, b) => b.score - a.score);
    const topResults = scoredChunks.slice(0, nResults);

    // Format to match Chroma's expected response format:
    return {
        documents: [topResults.map(r => r.document)],
        metadatas: [topResults.map(r => r.metadata)],
        distances: [topResults.map(r => 1 - r.score)]
    };
};

const deleteDocumentChunks = async (documentId) => {
    let collection = getCollection();
    collection = collection.filter(item => item.metadata.document_id !== documentId);
    saveCollection(collection);
};

module.exports = {
    storeEmbeddings,
    searchSimilarChunks,
    deleteDocumentChunks,
    client: {}
};
