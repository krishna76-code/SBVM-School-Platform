import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { v4 as uuidv4 } from 'uuid';
import StudyDocument from '../models/StudyDocument.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { generateText, generateJson } from '../services/gemini.service.js';
import { generateEmbedding, batchGenerateEmbeddings } from '../services/embedding.service.js';
import { addDocuments, queryDocuments, deleteDocuments } from '../services/chroma.service.js';
import { getCache, setCache } from '../services/cache.service.js';

// Constants for Text Chunking
const CHUNK_SIZE = 600;        // tokens ~ characters
const CHUNK_OVERLAP = 120;     // overlap window for continuity

/**
 * Split raw text into overlapping character-window chunks.
 * Returns array of { text, chunkIndex, charStart, charEnd }
 */
const chunkText = (rawText) => {
  const chunks = [];
  let start = 0;
  let chunkIndex = 0;
  const text = rawText.replace(/\s+/g, ' ').trim();

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunkTextStr = text.slice(start, end);

    // Don't add empty or whitespace-only chunks
    if (chunkTextStr.trim().length > 20) {
      chunks.push({
        text: chunkTextStr,
        chunkIndex,
        charStart: start,
        charEnd: end
      });
      chunkIndex++;
    }

    // Move forward with overlap
    start += CHUNK_SIZE - CHUNK_OVERLAP;
    if (start >= text.length) break;
  }

  return chunks;
};

// Helper to truncate text for prompts
const truncateForPrompt = (text, maxChars = 12000) =>
  text.length > maxChars ? text.slice(0, maxChars) + '\n\n[...document continues...]' : text;

// Helper to sanitize potential JSON outputs
const cleanJsonString = (str) => {
  return str.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. UPLOAD PDF
// ─────────────────────────────────────────────────────────────────────────────
export const uploadStudyPDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No PDF file uploaded. Please attach a file with key "pdf".', 400);
  }

  const { originalname, buffer, size, mimetype } = req.file;

  // Validate file type
  if (mimetype !== 'application/pdf') {
    throw new AppError('Only PDF files are accepted.', 400);
  }

  // Size limit: 20 MB
  if (size > 20 * 1024 * 1024) {
    throw new AppError('File size exceeds the 20 MB limit.', 400);
  }

  // Parse PDF text
  let parsedData;
  try {
    parsedData = await pdf(buffer);
  } catch (err) {
    throw new AppError('Failed to parse PDF. File may be corrupt or password-protected.', 422);
  }

  const rawText = parsedData.text;
  if (!rawText || rawText.trim().length < 50) {
    throw new AppError('PDF appears to contain no extractable text (may be a scanned image PDF).', 422);
  }

  // Generate unique namespace for ChromaDB (recorded as pineconeNamespace for schema backward compatibility)
  const namespace = `doc-${uuidv4()}`;

  // Create StudyDocument in DB immediately (status: processing)
  const doc = await StudyDocument.create({
    uploadedBy: req.user._id,
    fileName: originalname,
    fileSize: size,
    mimeType: mimetype,
    pageCount: parsedData.numpages,
    rawText,
    pineconeNamespace: namespace,
    status: 'processing'
  });

  // Process asynchronously
  (async () => {
    try {
      const chunks = chunkText(rawText);
      const ids = chunks.map(c => `${namespace}-chunk-${c.chunkIndex}`);
      const documents = chunks.map(c => c.text);
      const embeddings = await batchGenerateEmbeddings(documents);
      const metadatas = chunks.map(c => ({
        documentId: doc._id.toString(),
        fileName: originalname,
        namespace,
        chunkIndex: c.chunkIndex,
        charStart: c.charStart,
        charEnd: c.charEnd
      }));

      // Add to ChromaDB vector collection
      await addDocuments(namespace, ids, embeddings, metadatas, documents);

      await StudyDocument.findByIdAndUpdate(doc._id, {
        status: 'ready',
        chunkCount: chunks.length
      });
    } catch (err) {
      console.error('[StudyAssistant] ChromaDB Ingestion failed:', err.message);
      await StudyDocument.findByIdAndUpdate(doc._id, {
        status: 'error',
        errorMessage: err.message
      });
    }
  })();

  res.status(201).json({
    status: 'success',
    message: 'PDF uploaded and processing started.',
    document: {
      _id: doc._id,
      fileName: doc.fileName,
      pageCount: doc.pageCount,
      fileSize: doc.fileSize,
      status: doc.status,
      createdAt: doc.createdAt
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. LIST USER DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const listStudyDocuments = asyncHandler(async (req, res) => {
  const docs = await StudyDocument.find({ uploadedBy: req.user._id })
    .select('fileName fileSize pageCount status chunkCount createdAt summary mcqs flashcards')
    .sort({ createdAt: -1 });

  res.json({
    status: 'success',
    count: docs.length,
    documents: docs.map(d => ({
      _id: d._id,
      fileName: d.fileName,
      fileSize: d.fileSize,
      pageCount: d.pageCount,
      status: d.status,
      chunkCount: d.chunkCount,
      hasSummary: !!d.summary,
      mcqCount: d.mcqs?.length || 0,
      flashcardCount: d.flashcards?.length || 0,
      createdAt: d.createdAt
    }))
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET ONE DOCUMENT (with all artifacts)
// ─────────────────────────────────────────────────────────────────────────────
export const getStudyDocument = asyncHandler(async (req, res) => {
  const doc = await StudyDocument.findOne({
    _id: req.params.id,
    uploadedBy: req.user._id
  }).select('-rawText -__v');

  if (!doc) throw new AppError('Document not found or access denied.', 404);

  res.json({ status: 'success', document: doc });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. DELETE DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────
export const deleteStudyDocument = asyncHandler(async (req, res) => {
  const doc = await StudyDocument.findOne({
    _id: req.params.id,
    uploadedBy: req.user._id
  });

  if (!doc) throw new AppError('Document not found or access denied.', 404);

  // Delete from ChromaDB first
  await deleteDocuments(doc.pineconeNamespace);

  // Delete from MongoDB
  await doc.deleteOne();

  res.json({ status: 'success', message: 'Document and all associated vectors deleted.' });
});

// Helper: ensure document is ready and owned
const requireReadyDoc = async (docId, userId) => {
  const doc = await StudyDocument.findOne({ _id: docId, uploadedBy: userId });
  if (!doc) throw new AppError('Document not found or access denied.', 404);
  if (doc.status === 'processing') {
    throw new AppError('Document is still being processed. Please wait and try again.', 202);
  }
  if (doc.status === 'error') {
    throw new AppError(`Document processing failed: ${doc.errorMessage}`, 500);
  }
  return doc;
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. GENERATE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
export const generateSummary = asyncHandler(async (req, res) => {
  const doc = await requireReadyDoc(req.params.id, req.user._id);

  // Return cached summary if exists and not forced regenerate
  if (doc.summary && !req.body.regenerate) {
    return res.json({ status: 'success', cached: true, summary: doc.summary });
  }

  const systemPrompt = `You are an expert academic summarizer for a CBSE school study assistant.
Your summaries are structured, clear, and tailored for students.
Format the summary with:
1. A brief Overview (2-3 sentences)
2. Key Concepts (bullet list)
3. Important Definitions or Terms
4. Key Takeaways (2-3 points)
Keep the total summary under 600 words.`;

  const userPrompt = `Summarize the following academic document:\n\n${truncateForPrompt(doc.rawText, 14000)}`;

  const summary = await generateText({
    systemInstruction: systemPrompt,
    prompt: userPrompt
  });

  // Cache in DB
  await StudyDocument.findByIdAndUpdate(doc._id, { summary });

  res.json({ status: 'success', cached: false, summary });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. GENERATE MCQs
// ─────────────────────────────────────────────────────────────────────────────
export const generateMCQs = asyncHandler(async (req, res) => {
  const doc = await requireReadyDoc(req.params.id, req.user._id);
  const { count = 10, regenerate = false } = req.body;

  if (doc.mcqs?.length > 0 && !regenerate) {
    return res.json({ status: 'success', cached: true, mcqs: doc.mcqs });
  }

  const mcqCount = Math.min(Math.max(parseInt(count) || 10, 3), 20);

  const systemPrompt = `You are an expert CBSE exam question setter.
Generate exactly ${mcqCount} multiple-choice questions from the provided document.
Return ONLY a valid JSON object in this exact format:
{
  "mcqs": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation of why this answer is correct."
    }
  ]
}
Rules:
- Questions must be factual and directly from the document
- All 4 options must be plausible
- Vary difficulty (easy, medium, hard)
- No repeated questions`;

  const userPrompt = `Generate ${mcqCount} MCQs from this document:\n\n${truncateForPrompt(doc.rawText, 14000)}`;

  const rawResponse = await generateJson({
    systemInstruction: systemPrompt,
    prompt: userPrompt
  });

  let parsed;
  try {
    parsed = JSON.parse(cleanJsonString(rawResponse));
  } catch {
    throw new AppError('Failed to parse MCQ response from AI. Please try again.', 500);
  }

  const mcqs = (parsed.mcqs || []).map(q => ({
    question: q.question,
    options: q.options || [],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || ''
  }));

  if (mcqs.length === 0) {
    throw new AppError('AI returned no MCQs. The document may be too short.', 500);
  }

  // Cache in DB
  await StudyDocument.findByIdAndUpdate(doc._id, { mcqs });

  res.json({ status: 'success', cached: false, mcqs });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. GENERATE FLASHCARDS
// ─────────────────────────────────────────────────────────────────────────────
export const generateFlashcards = asyncHandler(async (req, res) => {
  const doc = await requireReadyDoc(req.params.id, req.user._id);
  const { count = 12, regenerate = false } = req.body;

  if (doc.flashcards?.length > 0 && !regenerate) {
    return res.json({ status: 'success', cached: true, flashcards: doc.flashcards });
  }

  const cardCount = Math.min(Math.max(parseInt(count) || 12, 5), 25);

  const systemPrompt = `You are an expert academic flashcard creator for CBSE students.
Generate exactly ${cardCount} flashcards from the provided document.
Return ONLY a valid JSON object in this exact format:
{
  "flashcards": [
    {
      "front": "Term, concept, or question (concise, max 20 words)",
      "back": "Definition, answer, or explanation (concise, max 60 words)"
    }
  ]
}
Rules:
- Front side: key terms, formulas, or short questions
- Back side: clear, accurate definitions or answers
- Cover the most important concepts
- Make cards concise and memorable`;

  const userPrompt = `Create ${cardCount} flashcards from this document:\n\n${truncateForPrompt(doc.rawText, 14000)}`;

  const rawResponse = await generateJson({
    systemInstruction: systemPrompt,
    prompt: userPrompt
  });

  let parsed;
  try {
    parsed = JSON.parse(cleanJsonString(rawResponse));
  } catch {
    throw new AppError('Failed to parse flashcard response from AI. Please try again.', 500);
  }

  const flashcards = (parsed.flashcards || []).map(f => ({
    front: f.front,
    back: f.back
  }));

  if (flashcards.length === 0) {
    throw new AppError('AI returned no flashcards. The document may be too short.', 500);
  }

  // Cache in DB
  await StudyDocument.findByIdAndUpdate(doc._id, { flashcards });

  res.json({ status: 'success', cached: false, flashcards });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. RAG Q&A — Answer questions from PDF
// ─────────────────────────────────────────────────────────────────────────────
export const askDocumentQuestion = asyncHandler(async (req, res) => {
  const doc = await requireReadyDoc(req.params.id, req.user._id);
  const { question } = req.body;

  if (!question || question.trim().length < 3) {
    throw new AppError('Please provide a valid question.', 400);
  }

  const docIdStr = doc._id.toString();

  // 1. Check AI Cache on MongoDB
  const cachedAnswer = await getCache(docIdStr, question);
  if (cachedAnswer) {
    return res.json({
      status: 'success',
      answer: cachedAnswer,
      sources: [],
      ragContext: true,
      source: 'Cache'
    });
  }

  // 2. Retrieve relevant chunks from ChromaDB via vector similarity search
  let relevantChunks;
  try {
    const queryEmbedding = await generateEmbedding(question);
    relevantChunks = await queryDocuments(doc.pineconeNamespace, queryEmbedding, 6);
  } catch (err) {
    console.error('[StudyAssistant] Vector search failed:', err.message);
    throw new AppError('Vector search failed. Please try again shortly.', 500);
  }

  if (!relevantChunks || relevantChunks.length === 0) {
    return res.json({
      status: 'success',
      answer: "I couldn't find relevant sections in this document to answer your question. Please try rephrasing or ask about a topic covered in the PDF.",
      sources: [],
      ragContext: false
    });
  }

  // 3. Build context from retrieved chunks (similarity threshold 0.3 similarity)
  const context = relevantChunks
    .filter(c => c.score > 0.3)
    .map((c, i) => `[Passage ${i + 1} (relevance: ${(c.score * 100).toFixed(0)}%)]:\n${c.text}`)
    .join('\n\n');

  // 4. Compose RAG prompt
  const systemPrompt = `You are a precise academic study assistant for SBVM School students.
You answer questions EXCLUSIVELY based on the provided document passages.
Rules:
- Answer only from the provided context passages
- If the answer is not in the passages, clearly state: "This information is not covered in the uploaded document."
- Be concise and accurate
- Use markdown formatting for clarity (bold key terms, bullet points for lists)
- Cite passage numbers when referencing specific facts (e.g., "According to Passage 2...")`;

  const userPrompt = `Document Context Passages:
${context}

Student's Question: ${question}

Provide a clear, accurate answer based only on the above passages.`;

  // 5. Call Gemini
  let answer;
  try {
    answer = await generateText({
      systemInstruction: systemPrompt,
      prompt: userPrompt
    });

    // 6. Cache the AI response in MongoDB
    await setCache(docIdStr, question, answer);
  } catch (error) {
    if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
      return res.json({
        status: 'success',
        answer: "The AI study engine has reached its daily free-tier query limit (20 queries/day). Please try again tomorrow, or review the document manually in the meantime.",
        sources: [],
        ragContext: false,
        source: 'System Limit'
      });
    }
    throw error;
  }

  res.json({
    status: 'success',
    answer,
    sources: relevantChunks.map(c => ({
      chunkIndex: c.chunkIndex,
      score: parseFloat(c.score?.toFixed(4) || '0'),
      preview: c.text?.slice(0, 120) + '...'
    })),
    ragContext: true,
    source: 'AI'
  });
});
