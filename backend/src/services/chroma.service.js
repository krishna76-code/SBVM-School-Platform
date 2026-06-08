import { ChromaClient } from 'chromadb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateEmbedding } from './embedding.service.js';

const client = new ChromaClient({
  path: process.env.CHROMA_URL || 'http://localhost:8000'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gets an existing collection or creates a new one with cosine similarity distance configuration.
 * @param {string} name 
 * @returns {Promise<any>} Chroma collection
 */
export const getCollection = async (name) => {
  return await client.getOrCreateCollection({
    name,
    metadata: { 'hnsw:space': 'cosine' }
  });
};

/**
 * Explicitly create a new collection
 * @param {string} collectionName 
 * @returns {Promise<any>}
 */
export const createCollection = async (collectionName) => {
  try {
    return await client.createCollection({
      name: collectionName,
      metadata: { 'hnsw:space': 'cosine' }
    });
  } catch (err) {
    console.error(`[ChromaService] Failed to create collection ${collectionName}:`, err.message);
    throw err;
  }
};

/**
 * Add documents to a collection
 * @param {string} collectionName 
 * @param {string[]} ids 
 * @param {number[][]} embeddings 
 * @param {object[]} metadatas 
 * @param {string[]} documents 
 * @returns {Promise<boolean>}
 */
export const addDocuments = async (collectionName, ids, embeddings, metadatas, documents) => {
  try {
    const collection = await getCollection(collectionName);
    await collection.add({ ids, embeddings, metadatas, documents });
    return true;
  } catch (err) {
    console.error(`[ChromaService] Failed to add documents to ${collectionName}:`, err.message);
    throw err;
  }
};

/**
 * Query documents from a collection and map output to match the format expected by controllers.
 * @param {string} collectionName 
 * @param {number[]} queryEmbedding 
 * @param {number} limit 
 * @param {object} where 
 * @returns {Promise<object[]>} array of matched document objects in custom standard format
 */
export const queryDocuments = async (collectionName, queryEmbedding, limit = 5, where = {}) => {
  try {
    const collection = await getCollection(collectionName);
    const queryOptions = {
      queryEmbeddings: [queryEmbedding],
      nResults: limit
    };
    if (where && Object.keys(where).length > 0) {
      queryOptions.where = where;
    }
    const results = await collection.query(queryOptions);

    const matches = [];
    if (results && results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        const id = results.ids[0][i];
        const text = results.documents[0][i] || '';
        const metadata = results.metadatas[0][i] || {};
        const distance = results.distances[0][i];

        // Map cosine distance back to cosine similarity (similarity = 1 - distance)
        const score = 1 - distance;

        matches.push({
          id,
          text,
          chunkIndex: metadata.chunkIndex !== undefined ? metadata.chunkIndex : i,
          score,
          metadata
        });
      }
    }
    return matches;
  } catch (err) {
    console.error(`[ChromaService] Failed to query collection ${collectionName}:`, err.message);
    throw err;
  }
};

/**
 * Delete documents from a collection, or delete the collection entirely if no query matches are specified.
 * @param {string} collectionName 
 * @param {string[]} [ids] 
 * @param {object} [where] 
 * @returns {Promise<boolean>}
 */
export const deleteDocuments = async (collectionName, ids = null, where = {}) => {
  try {
    if (!ids && Object.keys(where).length === 0) {
      // Delete the entire collection if no specifier
      await client.deleteCollection({ name: collectionName });
    } else {
      const collection = await getCollection(collectionName);
      if (ids && ids.length > 0) {
        await collection.delete({ ids });
      } else {
        await collection.delete({ where });
      }
    }
    return true;
  } catch (err) {
    console.error(`[ChromaService] Failed to delete from ${collectionName}:`, err.message);
    // Graceful exit if collection or target document doesn't exist
    if (err.message.includes('not exist') || err.message.includes('not found')) {
      return true;
    }
    throw err;
  }
};

/**
 * Update documents in a collection
 * @param {string} collectionName 
 * @param {string[]} ids 
 * @param {number[][]} embeddings 
 * @param {object[]} metadatas 
 * @param {string[]} documents 
 * @returns {Promise<boolean>}
 */
export const updateDocuments = async (collectionName, ids, embeddings, metadatas, documents) => {
  try {
    const collection = await getCollection(collectionName);
    await collection.update({ ids, embeddings, metadatas, documents });
    return true;
  } catch (err) {
    console.error(`[ChromaService] Failed to update documents in ${collectionName}:`, err.message);
    throw err;
  }
};

/**
 * Seed the prospectus database into ChromaDB if empty
 */
export const seedProspectus = async () => {
  try {
    console.log('[ChromaService] Checking prospectus collection in ChromaDB...');
    const collection = await getCollection('prospectus');
    const count = await collection.count();

    if (count === 0) {
      console.log('[ChromaService] Prospectus collection is empty. Starting seed process...');
      const schoolDataPath = path.join(__dirname, '../knowledge/schoolData.json');
      
      if (!fs.existsSync(schoolDataPath)) {
        console.warn(`[ChromaService] schoolData.json not found at ${schoolDataPath}. Skipping seed.`);
        return;
      }

      const schoolData = JSON.parse(fs.readFileSync(schoolDataPath, 'utf8'));
      console.log(`[ChromaService] Found ${schoolData.length} records to seed. Generating embeddings...`);

      const ids = [];
      const embeddings = [];
      const metadatas = [];
      const documents = [];

      for (const item of schoolData) {
        console.log(`[ChromaService] Generating embedding for: "${item.title}"`);
        const embedding = await generateEmbedding(item.content);
        
        ids.push(item.id);
        embeddings.push(embedding);
        metadatas.push({
          id: item.id,
          category: item.category,
          title: item.title
        });
        documents.push(item.content);
      }

      await collection.add({ ids, embeddings, metadatas, documents });
      console.log(`[ChromaService] Seeding completed. ${schoolData.length} documents indexed successfully.`);
    } else {
      console.log(`[ChromaService] Prospectus collection already contains ${count} items. Skipping seed.`);
    }
  } catch (err) {
    console.error('[ChromaService] Error seeding prospectus documents:', err.message);
  }
};
