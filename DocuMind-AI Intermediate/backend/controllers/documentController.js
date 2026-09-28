const fs = require('fs');
const path = require('path');
const { extractText } = require('../services/pdfService');
const { chunkText } = require('../services/chunkService');
const { generateEmbeddings } = require('../services/embeddingService');
const { storeEmbeddings, deleteDocumentChunks } = require('../services/vectorService');

const documentsFile = path.join(__dirname, '../uploads/documents.json');

// Initialize documents.json if it doesn't exist
if (!fs.existsSync(documentsFile)) {
    if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
        fs.mkdirSync(path.join(__dirname, '../uploads'));
    }
    fs.writeFileSync(documentsFile, JSON.stringify([]));
}

const getStoredDocuments = () => {
    return JSON.parse(fs.readFileSync(documentsFile, 'utf8'));
};

const saveStoredDocuments = (docs) => {
    fs.writeFileSync(documentsFile, JSON.stringify(docs, null, 2));
};

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded or unsupported file type' });
        }

        const { originalname, path: filePath, mimetype, size, filename } = req.file;
        const documentId = filename; // using generated filename as unique ID

        console.log(`\n[UPLOAD] File received: ${originalname}`);
        console.log(`[UPLOAD] Filename: ${filename}`);
        console.log(`[UPLOAD] MIME type: ${mimetype}`);
        console.log(`[UPLOAD] File size: ${size} bytes`);

        // 1. Extract text
        console.log(`[EXTRACTION] Starting text extraction...`);
        console.log(`[EXTRACTION] PDF/TXT detected`);
        const text = await extractText(filePath, mimetype, originalname);
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'This PDF does not contain extractable text. Please upload a text-based PDF.' });
        }
        console.log(`[EXTRACTION] Text extraction completed`);

        // 2. Chunk text
        console.log(`[CHUNKING] Creating chunks...`);
        const chunks = chunkText(text, 1000, 200);
        if (chunks.length === 0) {
            return res.status(400).json({ error: 'Failed to create chunks from document' });
        }

        // 3. Generate embeddings
        console.log(`[EMBEDDING] Generating embeddings...`);
        const embeddings = await generateEmbeddings(chunks);

        // 4. Store in Vector DB
        const metadata = {
            filename: originalname,
            source: 'uploaded_document'
        };
        await storeEmbeddings(chunks, embeddings, metadata, documentId);
        console.log(`[INGESTION] Document successfully indexed`);

        // Save to document list
        const docs = getStoredDocuments();
        docs.push({
            id: documentId,
            filename: originalname,
            chunks: chunks.length,
            uploadDate: new Date().toISOString()
        });
        saveStoredDocuments(docs);

        res.status(200).json({
            message: 'Document uploaded and processed successfully',
            documentName: originalname,
            chunksCreated: chunks.length,
            id: documentId
        });

    } catch (error) {
        console.error('\n[ERROR] Upload error Details:', error);
        res.status(500).json({ error: 'Backend failure during document ingestion: ' + error.message });
    }
};

const getDocuments = (req, res) => {
    try {
        const docs = getStoredDocuments();
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Remove from Vector DB
        await deleteDocumentChunks(id);
        
        // Remove file if exists
        const filePath = path.join(__dirname, '../uploads', id);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from document list
        let docs = getStoredDocuments();
        docs = docs.filter(doc => doc.id !== id);
        saveStoredDocuments(docs);

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument
};
