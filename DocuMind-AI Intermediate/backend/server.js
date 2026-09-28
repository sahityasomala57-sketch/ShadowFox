const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const documentRoutes = require('./routes/documentRoutes');
const questionRoutes = require('./routes/questionRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'DocuMind AI Backend is running' });
});

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/questions', questionRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
