import ScholarshipRule from '../models/ScholarshipRule.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// @desc    Get all scholarship rules
// @route   GET /api/v1/scholarships
// @access  Public
export const getRules = asyncHandler(async (req, res) => {
  const rules = await ScholarshipRule.find().sort({ classRange: 1 });
  res.json({ status: 'success', data: rules });
});

// @desc    Update scholarship rule config
// @route   PUT /api/v1/scholarships/:id
// @access  Private (Admin)
export const updateRule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    boardTiers, 
    entranceTiers, 
    sportsNationalConcession, 
    sportsStateConcession,
    incomeBelow25kConcession,
    incomeBelow50kConcession,
    maxTotalConcession,
    eligiblePrograms 
  } = req.body;

  const rule = await ScholarshipRule.findById(id);
  if (!rule) {
    throw new AppError('Scholarship rule configuration not found', 404);
  }

  // Update fields if provided
  if (boardTiers) rule.boardTiers = boardTiers;
  if (entranceTiers) rule.entranceTiers = entranceTiers;
  if (sportsNationalConcession !== undefined) rule.sportsNationalConcession = sportsNationalConcession;
  if (sportsStateConcession !== undefined) rule.sportsStateConcession = sportsStateConcession;
  if (incomeBelow25kConcession !== undefined) rule.incomeBelow25kConcession = incomeBelow25kConcession;
  if (incomeBelow50kConcession !== undefined) rule.incomeBelow50kConcession = incomeBelow50kConcession;
  if (maxTotalConcession !== undefined) rule.maxTotalConcession = maxTotalConcession;
  if (eligiblePrograms) rule.eligiblePrograms = eligiblePrograms;

  await rule.save();

  res.json({ status: 'success', data: rule });
});

// @desc    Evaluate student scholarship eligibility dynamically
// @route   POST /api/v1/scholarships/evaluate
// @access  Public
export const evaluateEligibility = asyncHandler(async (req, res) => {
  const { className, percentage, entranceScore, parentalIncome = 0, sportsLevel = 'None' } = req.body;

  if (!className || percentage === undefined || entranceScore === undefined) {
    throw new AppError('Please provide className, previous class percentage, and entrance score', 400);
  }

  // 1. Resolve Class Range
  let classRange = 'Junior (Nursery-8)';
  const name = className.toLowerCase();
  
  if (name.includes('11') || name.includes('12') || name.includes('senior')) {
    classRange = 'Senior Secondary (11-12)';
  } else if (name.includes('9') || name.includes('10') || name.includes('secondary')) {
    classRange = 'Secondary (9-10)';
  }

  // 2. Load Rules from Database
  const rule = await ScholarshipRule.findOne({ classRange });
  if (!rule) {
    throw new AppError(`Scholarship rules configuration not found for ${classRange}`, 404);
  }

  // 3. Compute Concessions
  let boardConcession = 0;
  let entranceConcession = 0;
  let incomeConcession = 0;
  let sportsConcession = 0;

  // A. Board Tiers Match (find highest tier satisfied)
  const sortedBoardTiers = [...rule.boardTiers].sort((a, b) => b.minScore - a.minScore);
  const matchedBoard = sortedBoardTiers.find(tier => Number(percentage) >= tier.minScore);
  if (matchedBoard) boardConcession = matchedBoard.concession;

  // B. Entrance Tiers Match (find highest tier satisfied)
  const sortedEntranceTiers = [...rule.entranceTiers].sort((a, b) => b.minScore - a.minScore);
  const matchedEntrance = sortedEntranceTiers.find(tier => Number(entranceScore) >= tier.minScore);
  if (matchedEntrance) entranceConcession = matchedEntrance.concession;

  // C. Need-based Concession
  if (parentalIncome > 0) {
    if (parentalIncome < 250000) {
      incomeConcession = rule.incomeBelow25kConcession;
    } else if (parentalIncome < 500000) {
      incomeConcession = rule.incomeBelow50kConcession;
    }
  }

  // D. Sports Concession
  if (sportsLevel === 'National') {
    sportsConcession = rule.sportsNationalConcession;
  } else if (sportsLevel === 'State') {
    sportsConcession = rule.sportsStateConcession;
  }

  // Find highest merit-based concession between Board Marks and Entrance Test
  const meritConcession = Math.max(boardConcession, entranceConcession);

  // Sum concessions
  let totalConcession = meritConcession + incomeConcession + sportsConcession;

  // Cap total concession at max limit
  if (totalConcession > rule.maxTotalConcession) {
    totalConcession = rule.maxTotalConcession;
  }

  // Base Science and Commerce baseline rates
  const baseScienceFee = 95000;
  const baseCommerceFee = 80000;

  const scienceDiscount = (baseScienceFee * totalConcession) / 100;
  const scienceFinal = baseScienceFee - scienceDiscount;

  const commerceDiscount = (baseCommerceFee * totalConcession) / 100;
  const commerceFinal = baseCommerceFee - commerceDiscount;

  res.json({
    status: 'success',
    data: {
      classRange,
      concessionBreakdown: {
        boardMerit: boardConcession,
        entranceMerit: entranceConcession,
        needsConcession: incomeConcession,
        sportsConcession: sportsConcession,
        selectedMeritConcession: meritConcession
      },
      totalConcessionPercentage: totalConcession,
      maxTotalConcession: rule.maxTotalConcession,
      eligiblePrograms: rule.eligiblePrograms,
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
    }
  });
});
