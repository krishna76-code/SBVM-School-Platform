import { generateEmbedding } from './embedding.service.js';
import { queryDocuments } from './chroma.service.js';
import logger from '../utils/logger.js';

/**
 * Unified RAG Service for Vector Search and Context Preparation
 */
export const retrieveContext = async (collectionName, queryText, options = {}) => {
  const { topK = 5, minSimilarityScore = 0.3 } = options;

  try {
    const queryEmbedding = await generateEmbedding(queryText);
    const matches = await queryDocuments(collectionName, queryEmbedding, topK);

    if (!matches || matches.length === 0) {
      return { matches: [], contextString: '', hasContext: false };
    }

    const relevantMatches = matches.filter(m => m.score >= minSimilarityScore);

    if (relevantMatches.length === 0) {
      return { matches: [], contextString: '', hasContext: false };
    }

    const contextString = relevantMatches
      .map((m, idx) => {
        const title = m.metadata?.title || m.metadata?.fileName || `Section ${idx + 1}`;
        const category = m.metadata?.category ? ` [Category: ${m.metadata.category}]` : '';
        return `[Passage ${idx + 1}:${category} - ${title}]\n${m.text}`;
      })
      .join('\n\n');

    return {
      matches: relevantMatches,
      contextString,
      hasContext: true
    };
  } catch (error) {
    logger.warn(`[RAG Service] Retrieval failed for collection "${collectionName}"`, {
      error: error.message,
      query: queryText
    });
    return { matches: [], contextString: '', hasContext: false, error: error.message };
  }
};

export default {
  retrieveContext
};
