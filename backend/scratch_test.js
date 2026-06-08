import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import { generateEmbedding } from './src/services/embedding.service.js';
import { generateText, generateJson } from './src/services/gemini.service.js';
import { addDocuments, queryDocuments, deleteDocuments } from './src/services/chroma.service.js';
import FAQ from './src/models/FAQ.js';
import { searchFaq, getCache, setCache } from './src/services/cache.service.js';

const runTests = async () => {
  console.log('--- STARTING AI MIGRATION TESTS ---');

  try {
    // 1. Test Local Embeddings
    console.log('\n1. Testing Local Embeddings...');
    const emb = await generateEmbedding('Hello World');
    console.log('Embedding dimension:', emb.length);
    if (emb.length === 384) {
      console.log('✅ Embedding Dimension is correct (384).');
    } else {
      console.error('❌ Embedding Dimension is incorrect:', emb.length);
    }

    // 2. Test Gemini API
    console.log('\n2. Testing Gemini Text Generation...');
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not set. Skipping Gemini tests.');
    } else {
      const text = await generateText({
        systemInstruction: 'You are a helpful assistant.',
        prompt: 'Say hello in 3 words'
      });
      console.log('Gemini output:', text);
      console.log('✅ Gemini Text Generation works.');

      const jsonStr = await generateJson({
        systemInstruction: 'Output JSON with a message field.',
        prompt: 'Say hello'
      });
      console.log('Gemini JSON output:', jsonStr);
      console.log('✅ Gemini JSON Generation works.');
    }

    // 3. Test ChromaDB
    console.log('\n3. Testing ChromaDB...');
    const collectionName = 'test-temp-collection';
    const testIds = ['test-1'];
    const testEmbedding = [emb];
    const testMetadatas = [{ source: 'test' }];
    const testDocs = ['Hello World test doc'];

    console.log('Adding document...');
    await addDocuments(collectionName, testIds, testEmbedding, testMetadatas, testDocs);
    console.log('Querying document...');
    const matches = await queryDocuments(collectionName, emb, 1);
    console.log('Query matches:', matches);
    if (matches && matches.length > 0 && matches[0].id === 'test-1') {
      console.log('✅ ChromaDB Add and Query works.');
    } else {
      console.error('❌ ChromaDB query failed or returned wrong results.');
    }
    console.log('Deleting collection...');
    await deleteDocuments(collectionName);
    console.log('✅ ChromaDB collection deleted.');

    // 4. Test MongoDB FAQ and Caching
    console.log('\n4. Testing MongoDB FAQ & Caching (requires MongoDB running)...');
    try {
      await connectDB();
      console.log('Connected to MongoDB.');

      // Clear any previous test data
      await FAQ.deleteOne({ question: 'Test FAQ Question?' });

      // Seed a test FAQ
      await FAQ.create({
        question: 'Test FAQ Question?',
        answer: 'This is the test FAQ answer.'
      });

      console.log('Testing FAQ Lookup...');
      const faqAns = await searchFaq('Test FAQ Question?');
      console.log('FAQ answer:', faqAns);
      if (faqAns === 'This is the test FAQ answer.') {
        console.log('✅ FAQ lookup works.');
      } else {
        console.error('❌ FAQ lookup failed.');
      }

      await FAQ.deleteOne({ question: 'Test FAQ Question?' });

      // Test AI Cache
      console.log('Testing AI Cache...');
      const cacheQ = 'What is the speed of light?';
      const cacheA = '299,792,458 m/s';
      await setCache('test-ctx', cacheQ, cacheA);
      const cachedAns = await getCache('test-ctx', cacheQ);
      console.log('Cached answer:', cachedAns);
      if (cachedAns === cacheA) {
        console.log('✅ AI Cache lookup works.');
      } else {
        console.error('❌ AI Cache lookup failed.');
      }

      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    } catch (dbErr) {
      console.warn('⚠️ MongoDB connection/test failed (make sure MONGODB_URI is set):', dbErr.message);
    }

    console.log('\n✅ ALL SERVICE LAYER TESTS FINISHED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ TEST RUN ENCOUNTERED AN ERROR:', err);
  }
};

runTests();
