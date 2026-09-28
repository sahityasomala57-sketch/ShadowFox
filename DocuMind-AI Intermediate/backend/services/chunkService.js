/**
 * Chunking strategy for RAG.
 * Splits text into chunks of roughly 1000 characters with 200 character overlap.
 */
const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  if (!text || text.trim() === '') {
    return [];
  }

  // Clean the extracted text by removing excessive whitespace
  const cleanedText = text.replace(/\s+/g, ' ').trim();

  const chunks = [];
  let i = 0;

  while (i < cleanedText.length) {
    let end = i + chunkSize;
    
    // If not at the end of the text, try to find a natural break point (like a space or period)
    if (end < cleanedText.length) {
      let nextSpace = cleanedText.lastIndexOf(' ', end);
      if (nextSpace > i + chunkSize - overlap) { // Only break at space if it's within a reasonable distance
        end = nextSpace;
      }
    }
    
    chunks.push(cleanedText.substring(i, end).trim());
    i = end - overlap; // Move forward, keeping the overlap
  }

  return chunks;
};

module.exports = {
  chunkText
};
