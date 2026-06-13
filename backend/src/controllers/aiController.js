import { generateText } from '../services/gemini.service.js';
import { generateEmbedding } from '../services/embedding.service.js';
import { queryDocuments } from '../services/chroma.service.js';
import { searchFaq, getCache, setCache } from '../services/cache.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// System Prompts
const PROSPECTUS_SYSTEM_PROMPT = `
You are the official AI Admission Counselor for Saraswati Bal Vidya Mandir (SBVM) School, Sikar, Rajasthan.
Your sole purpose is to assist prospective parents and students with questions regarding admissions, fee structures, curriculum, board affiliation, hostel amenities, and scholarship rules.

Strict Guidelines:
1. Grounding: You must answer questions based ONLY on the provided retrieved context. Do not invent details or assume information.
2. Boundaries: If the context does not contain the answer to a question, politely state that you do not have that specific information in your records and invite the user to contact the school admissions desk at +91 9111111111 or email admissions@sbvm.edu.in.
3. Steering: If the user asks about general, non-school topics (e.g. general programming, unrelated math questions, writing unrelated essays), politely guide the conversation back to SBVM admissions.
4. Tone: Be extremely helpful, welcoming, professional, and clear. Format responses beautifully using bullet points or markdown tables when discussing numbers or listings.
`;

const STUDY_TUTOR_PROMPT = (className, subjectName) => `
You are the AI Study Assistant for a student in ${className} studying ${subjectName} at Saraswati Bal Vidya Mandir (SBVM) School.
Explain academic concepts matching the student's grade standard. 
Provide clear definitions, real-life examples, and format your answers beautifully using markdown.
At the end of your explanation, always generate a short 3-question Multiple Choice Quiz (with answers labeled at the very end in a hidden format) so the student can test their understanding.
`;

// @desc    AI Admission Counselor Chat
// @route   POST /api/v1/ai/admission-counselor
// @access  Public
export const getAdmissionResponse = asyncHandler(async (req, res) => {
  const { message, history } = req.body; // history: Array of { role: 'user'|'model', parts: [{ text: String }] }

  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    // 1. MongoDB FAQ Search
    const faqAnswer = await searchFaq(message);
    if (faqAnswer) {
      return res.json({ reply: faqAnswer, source: 'FAQ' });
    }

    // 2. MongoDB AI Cache Lookup
    const cachedAnswer = await getCache('general', message);
    if (cachedAnswer) {
      return res.json({ reply: cachedAnswer, source: 'Cache' });
    }

    // 3. Vector Similarity Search in ChromaDB
    let contextString = '';
    try {
      const queryEmbedding = await generateEmbedding(message);
      const matches = await queryDocuments('prospectus', queryEmbedding, 3);

      if (matches && matches.length > 0) {
        // Filter matches by cosine similarity threshold (0.3 similarity corresponds to 0.7 distance)
        const relevantMatches = matches.filter(m => m.score > 0.3);
        if (relevantMatches.length > 0) {
          contextString = "Retrieved Prospectus Context:\n" + relevantMatches
            .map(m => `[Category: ${m.metadata.category || 'Prospectus'} - ${m.metadata.title || 'Section'}]: ${m.text}`)
            .join('\n\n');
        }
      }
    } catch (chromaError) {
      console.warn('[AI Controller] ChromaDB query failed, proceeding without vector context:', chromaError.message);
    }

    if (!contextString) {
      contextString = "No specific retrieved prospectus chunks match this query directly. Rely on general school profile policies if applicable.";
    }

    // 4. Send context to Gemini
    const reply = await generateText({
      systemInstruction: `${PROSPECTUS_SYSTEM_PROMPT}\n\n${contextString}`,
      prompt: message,
      history
    });

    // 5. Cache response in MongoDB
    await setCache('general', message, reply);

    res.json({ reply, source: 'AI' });
  } catch (error) {
    console.error('Gemini Counselor Error:', error.message);
    if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
      return res.json({
        reply: "Namaste! The AI Counselor has reached its daily free-tier query quota (20 queries/day). Please try again tomorrow, or feel free to contact our admissions desk at +91 9111111111 or email admissions@sbvm.edu.in.",
        source: 'System'
      });
    }
    res.status(500).json({ message: 'Error communicating with AI counselor' });
  }
});

// @desc    AI Study Companion Tutor
// @route   POST /api/v1/ai/study-assistant
// @access  Private (Student)
export const getStudyHelp = asyncHandler(async (req, res) => {
  const { query, subject, currentClass } = req.body;

  if (!query || !subject || !currentClass) {
    return res.status(400).json({ message: 'Query, subject, and currentClass are required' });
  }

  try {
    const systemInstruction = STUDY_TUTOR_PROMPT(currentClass, subject);
    const reply = await generateText({
      systemInstruction,
      prompt: query
    });

    res.json({ reply });
  } catch (error) {
    console.error('Gemini Study Assistant Error:', error.message);
    if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
      return res.json({
        reply: "The AI Study Assistant has reached its daily free-tier query limit. Please try again tomorrow, or refer to your textbook in the meantime!"
      });
    }
    res.status(500).json({ message: 'Error communicating with AI tutor' });
  }
});

// @desc    Calculate Scholarship Concessions
// @route   POST /api/v1/ai/scholarship-estimator
// @access  Public
export const calculateScholarship = asyncHandler(async (req, res) => {
  const { previousMarks, entranceScore, parentalIncome, sportsLevel } = req.body;

  // Validation
  if (previousMarks === undefined || entranceScore === undefined || parentalIncome === undefined) {
    return res.status(400).json({ message: 'Please provide previous marks, entrance score, and parental income' });
  }

  try {
    let marksConcession = 0;
    let entranceConcession = 0;
    let incomeConcession = 0;
    let sportsConcession = 0;

    // 1. Previous Marks Concessions
    if (previousMarks >= 95) marksConcession = 50;
    else if (previousMarks >= 90) marksConcession = 30;
    else if (previousMarks >= 85) marksConcession = 20;

    // 2. Entrance Test Marks Concessions
    if (entranceScore >= 90) entranceConcession = 40;
    else if (entranceScore >= 80) entranceConcession = 25;

    // 3. Parental Income Need-based Concessions
    if (parentalIncome < 250000) incomeConcession = 15;
    else if (parentalIncome < 500000) incomeConcession = 10;

    // 4. Sports Achievement Concessions
    if (sportsLevel === 'National') sportsConcession = 25;
    else if (sportsLevel === 'State') sportsConcession = 15;

    // Find highest merit-based concession between Board Marks and Entrance Test
    const meritConcession = Math.max(marksConcession, entranceConcession);

    // Sum merit, income (need-based), and sports concessions
    let totalConcession = meritConcession + incomeConcession + sportsConcession;

    // Cap total concession at 75%
    if (totalConcession > 75) {
      totalConcession = 75;
    }

    // Reference fee calculation based on class Grade 11-12 Science (Standard Integration baseline)
    const baseScienceFee = 95000;
    const baseCommerceFee = 80000;

    const scienceDiscount = (baseScienceFee * totalConcession) / 100;
    const scienceFinal = baseScienceFee - scienceDiscount;

    const commerceDiscount = (baseCommerceFee * totalConcession) / 100;
    const commerceFinal = baseCommerceFee - commerceDiscount;

    res.json({
      concessionBreakdown: {
        boardMerit: marksConcession,
        entranceMerit: entranceConcession,
        needsConcession: incomeConcession,
        sportsConcession: sportsConcession,
        selectedMeritConcession: meritConcession
      },
      totalConcessionPercentage: totalConcession,
      feeEstimates: {
        scienceStream: {
          originalFee: baseScienceFee,
          concessionAmount: scienceDiscount,
          finalFee: scienceFinal
        },
        commerceArtsStream: {
          originalFee: baseCommerceFee,
          concessionAmount: commerceDiscount,
          finalFee: commerceFinal
        }
      }
    });
  } catch (error) {
    console.error('Scholarship Calculation Error:', error.message);
    res.status(500).json({ message: 'Error calculating scholarship' });
  }
});
