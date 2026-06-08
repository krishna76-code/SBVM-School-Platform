import { pipeline } from '@xenova/transformers';

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    try {
      console.log('[EmbeddingService] Initializing Xenova/all-MiniLM-L6-v2 model...');
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('[EmbeddingService] Model loaded successfully.');
    } catch (err) {
      console.error('[EmbeddingService] Failed to load model:', err.message);
      throw err;
    }
  }
  return extractor;
};

/**
 * Generate 384-dimensional embedding vector for a string
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const generateEmbedding = async (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Input text must be a non-empty string');
  }

  const model = await getExtractor();
  const output = await model(text, { pooling: 'mean', normalize: true });
  
  // Convert Float32Array to native array
  return Array.from(output.data);
};

/**
 * Batch generate embeddings
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export const batchGenerateEmbeddings = async (texts) => {
  if (!Array.isArray(texts)) {
    throw new Error('Input must be an array of strings');
  }

  const embeddings = [];
  for (const text of texts) {
    const emb = await generateEmbedding(text);
    embeddings.push(emb);
  }
  return embeddings;
};
