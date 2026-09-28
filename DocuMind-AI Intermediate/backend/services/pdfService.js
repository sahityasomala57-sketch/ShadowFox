const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extracts text from a PDF or TXT file.
 * Document extraction service.
 */
const extractText = async (filePath, mimetype, originalname) => {
  try {
    const ext = originalname.split('.').pop().toLowerCase();
    const isPDF = mimetype === 'application/pdf' || ext === 'pdf';
    const isTXT = mimetype === 'text/plain' || ext === 'txt';

    if (isPDF) {
      const dataBuffer = fs.readFileSync(filePath);
      console.log(`[EXTRACTION] Read PDF buffer size: ${dataBuffer.length} bytes`);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (isTXT) {
      const text = fs.readFileSync(filePath, 'utf8');
      console.log(`[EXTRACTION] Read TXT file length: ${text.length} characters`);
      return text;
    } else {
      throw new Error(`Unsupported file type. MIME: ${mimetype}, Ext: ${ext}`);
    }
  } catch (error) {
    console.error('[EXTRACTION ERROR] Real error in pdfService:', error);
    throw error; // Rethrow the actual error instead of hiding it
  }
};

module.exports = {
  extractText
};
