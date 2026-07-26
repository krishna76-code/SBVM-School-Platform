/**
 * Sentence-Aware & Paragraph-Aware Recursive Text Chunker
 * Splits raw document text into readable, cohesive context passages for vector embedding.
 */

/**
 * Splits text into chunks respecting sentence boundaries and paragraph breaks.
 * @param {string} rawText - Unstructured document text
 * @param {object} options - Chunking options
 * @param {number} options.chunkSize - Maximum character target per chunk
 * @param {number} options.chunkOverlap - Overlap characters between consecutive chunks
 * @returns {Array<{ text: string, chunkIndex: number, charStart: number, charEnd: number }>}
 */
export const recursiveChunkText = (rawText, options = {}) => {
  const chunkSize = options.chunkSize || 600;
  const chunkOverlap = options.chunkOverlap || 120;

  if (!rawText || typeof rawText !== 'string') {
    return [];
  }

  // Normalize whitespace while preserving structural paragraph breaks
  const normalized = rawText
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into paragraphs first
  const paragraphs = normalized.split(/\n\s*\n/);
  const chunks = [];
  let currentChunkText = '';
  let currentStart = 0;
  let chunkIndex = 0;

  const pushChunk = (text, start) => {
    const trimmed = text.trim();
    if (trimmed.length >= 25) {
      chunks.push({
        text: trimmed,
        chunkIndex: chunkIndex++,
        charStart: start,
        charEnd: start + trimmed.length
      });
    }
  };

  let position = 0;
  for (const paragraph of paragraphs) {
    const paraText = paragraph.trim();
    if (!paraText) continue;

    // If paragraph fits in current chunk buffer
    if (currentChunkText.length + paraText.length + 1 <= chunkSize) {
      if (currentChunkText.length === 0) {
        currentStart = position;
      }
      currentChunkText += (currentChunkText ? '\n\n' : '') + paraText;
    } else {
      // Current chunk buffer is full, push it
      if (currentChunkText) {
        pushChunk(currentChunkText, currentStart);

        // Keep overlap from the end of current chunk for continuity
        const overlapText = currentChunkText.slice(-chunkOverlap);
        const lastSpace = overlapText.indexOf(' ');
        const cleanOverlap = lastSpace !== -1 ? overlapText.slice(lastSpace + 1) : overlapText;

        currentChunkText = cleanOverlap + '\n\n' + paraText;
        currentStart = Math.max(0, position - cleanOverlap.length);
      } else {
        // Single paragraph exceeds chunkSize -> split by sentences
        const sentences = paraText.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [paraText];
        for (const sentence of sentences) {
          if (currentChunkText.length + sentence.length <= chunkSize) {
            if (currentChunkText.length === 0) currentStart = position;
            currentChunkText += sentence;
          } else {
            if (currentChunkText) pushChunk(currentChunkText, currentStart);
            currentChunkText = sentence;
            currentStart = position;
          }
        }
      }
    }
    position += paraText.length + 2;
  }

  // Push final remaining chunk
  if (currentChunkText) {
    pushChunk(currentChunkText, currentStart);
  }

  return chunks;
};

export default recursiveChunkText;
