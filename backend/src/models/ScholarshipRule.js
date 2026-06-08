import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
  minScore: { type: Number, required: true },
  concession: { type: Number, required: true }
}, { _id: false });

const scholarshipRuleSchema = new mongoose.Schema({
  classRange: { 
    type: String, 
    required: true, 
    unique: true, 
    enum: ['Junior (Nursery-8)', 'Secondary (9-10)', 'Senior Secondary (11-12)'] 
  },
  boardTiers: [tierSchema],
  entranceTiers: [tierSchema],
  sportsNationalConcession: { type: Number, default: 25 },
  sportsStateConcession: { type: Number, default: 15 },
  incomeBelow25kConcession: { type: Number, default: 15 },
  incomeBelow50kConcession: { type: Number, default: 10 },
  maxTotalConcession: { type: Number, default: 75 },
  eligiblePrograms: [{ type: String }]
}, { timestamps: true });

const ScholarshipRule = mongoose.model('ScholarshipRule', scholarshipRuleSchema);
export default ScholarshipRule;
