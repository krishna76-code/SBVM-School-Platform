import FAQ from '../models/FAQ.js';
import AiCache from '../models/AiCache.js';

const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

/**
 * Searches MongoDB FAQ collection for a match using exact regex match and text index matching.
 * @param {string} question 
 * @returns {Promise<string|null>} answer if found, otherwise null
 */
export const searchFaq = async (question) => {
  try {
    const cleanedQuestion = question.trim().toLowerCase();

    // 1. Exact match lookup (case-insensitive)
    const exactMatch = await FAQ.findOne({
      question: { $regex: new RegExp(`^${escapeRegex(cleanedQuestion)}$`, 'i') }
    });
    if (exactMatch) {
      console.log(`[CacheService] FAQ exact hit for: "${cleanedQuestion}"`);
      return exactMatch.answer;
    }

    // 2. Text index search (falls back to keyword score if text index exists)
    const textMatch = await FAQ.findOne(
      { $text: { $search: question } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    if (textMatch && textMatch._doc && textMatch._doc.score > 1.2) {
      console.log(`[CacheService] FAQ text score hit (${textMatch._doc.score}) for: "${question}"`);
      return textMatch.answer;
    }

    return null;
  } catch (err) {
    console.error('[CacheService] FAQ search failed:', err.message);
    return null;
  }
};

/**
 * Query cache for a normalized question and context
 * @param {string} context - 'general' or StudyDocument ObjectId
 * @param {string} question 
 * @returns {Promise<string|null>} cached answer or null
 */
export const getCache = async (context, question) => {
  try {
    const key = question.trim().toLowerCase();
    const cacheEntry = await AiCache.findOne({ context, question: key });
    if (cacheEntry) {
      console.log(`[CacheService] AI Cache HIT for key: "${key}" in context: "${context}"`);
      return cacheEntry.answer;
    }
    return null;
  } catch (err) {
    console.error('[CacheService] Cache lookup failed:', err.message);
    return null;
  }
};

/**
 * Save an AI response to MongoDB cache
 * @param {string} context - 'general' or StudyDocument ObjectId
 * @param {string} question 
 * @param {string} answer 
 * @returns {Promise<boolean>}
 */
export const setCache = async (context, question, answer) => {
  try {
    const key = question.trim().toLowerCase();
    await AiCache.findOneAndUpdate(
      { context, question: key },
      { answer, provider: 'Gemini' },
      { upsert: true, new: true }
    );
    console.log(`[CacheService] Cached response for key: "${key}" in context: "${context}"`);
    return true;
  } catch (err) {
    console.error('[CacheService] Cache saving failed:', err.message);
    return false;
  }
};
