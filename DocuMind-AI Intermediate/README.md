# DocuMind AI

Document-Based Question Answering Assistant using Retrieval-Augmented Generation (RAG).

## Project Objective
DocuMind AI allows users to upload PDF and TXT documents and ask questions about their content. It uses a true RAG architecture, meaning questions are answered strictly using the context found in the uploaded documents. The application generates embeddings, stores them in a vector database, retrieves relevant chunks, and uses Google Gemini to generate grounded answers.

## Features
- Upload PDF and TXT documents.
- Process and chunk documents automatically.
- Store document embeddings in a local ChromaDB instance.
- Ask questions and receive answers grounded *only* in the provided documents.
- View exact source chunks and similarity scores used to generate the answer.
- Modern, responsive, dark-mode AI interface.

## Technology Stack
- **Frontend**: React, Vite, Axios, Vanilla CSS
- **Backend**: Node.js, Express.js, Multer (file uploads), pdf-parse (text extraction)
- **AI**: Google Gemini API (`@google/genai` SDK) for Embeddings (`text-embedding-004`) and Generation (`gemini-2.5-flash`).
- **Vector Database**: ChromaDB

## Architecture & RAG Workflow

1. **Document Ingestion**
   - **Text Extraction**: Text is extracted from uploaded PDF or TXT files.
   - **Chunking**: Text is split into chunks of ~1000 characters with 200 characters of overlap. This ensures context isn't lost between boundaries.
   - **Embeddings**: Each chunk is converted into an embedding vector using Gemini's text embedding model.
   - **Vector Storage**: Embeddings and metadata are saved to ChromaDB.
2. **Retrieval & Answer Generation**
   - **Question Embedding**: The user's question is converted into an embedding vector.
   - **Similarity Search**: ChromaDB retrieves the top 5 most similar document chunks.
   - **Context Construction**: Retrieved chunks are combined into a prompt context.
   - **Grounded Answer**: The context and question are sent to Gemini. The prompt strictly instructs the model to answer *only* from the context and to use a fallback message ("I couldn't find this information in the uploaded documents.") if the answer isn't present.
   - **Hallucination Reduction**: Grounding constraints prevent the model from using its pre-trained general knowledge.

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python or Docker (to run ChromaDB)
- Google Gemini API Key

### 1. Start ChromaDB
You must run a local instance of ChromaDB. 
Via Docker:
```bash
docker run -p 8000:8000 chromadb/chroma
```
Or via Python:
```bash
pip install chromadb
chroma run --path ./chroma_data
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
CHROMA_URL=http://localhost:8000
```
Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- `POST /api/documents/upload` - Upload a document (multipart/form-data)
- `GET /api/documents` - List uploaded documents
- `DELETE /api/documents/:id` - Delete a document
- `POST /api/questions/ask` - Ask a question (`{ question: "..." }`)
- `GET /api/health` - Health check

## Limitations & Future Improvements
- Currently uses a simple JSON file for document metadata persistence. A relational DB (PostgreSQL/SQLite) would be better for production.
- Advanced chunking strategies (e.g., semantic chunking) could improve retrieval accuracy.
- Support for more document types (DOCX, CSV).
