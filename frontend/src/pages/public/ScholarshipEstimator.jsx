import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Sparkles, HelpCircle, GraduationCap, Calculator, 
  TrendingUp, Wallet, Percent, ArrowRight, ShieldCheck, CheckCircle
} from 'lucide-react';
import API from '../../services/api';

const ScholarshipEstimator = () => {
  const [className, setClassName] = useState('Class 11 Science');
  const [percentage, setPercentage] = useState('');
  const [entranceScore, setEntranceScore] = useState('');
  const [parentalIncome, setParentalIncome] = useState('');
  const [sportsLevel, setSportsLevel] = useState('None');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const classOptions = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Science', 'Class 11 Commerce', 'Class 11 Arts',
    'Class 12 Science', 'Class 12 Commerce', 'Class 12 Arts'
  ];

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (percentage === '' || entranceScore === '') {
      setError('Please enter both previous percentage and entrance exam score.');
      return;
    }

    const pctVal = Number(percentage);
    const scoreVal = Number(entranceScore);

    if (pctVal < 0 || pctVal > 100 || scoreVal < 0 || scoreVal > 100) {
      setError('Scores and percentages must be between 0 and 100.');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    try {
      const payload = {
        className,
        percentage: pctVal,
        entranceScore: scoreVal,
        parentalIncome: parentalIncome !== '' ? Number(parentalIncome) : 0,
        sportsLevel
      };

      const { data } = await API.post('/scholarships/evaluate', payload);
      
      if (data && data.status === 'success') {
        setResults(data.data);
      } else {
        setError('Could not estimate scholarship. Please try again.');
      }
    } catch (err) {
      console.error('Scholarship evaluation error:', err.message);
      setError(err.response?.data?.message || 'Error occurred while contacting the evaluation server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen pb-20 text-left font-sans relative">
      {/* Background Radial Glow */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] pulse-glow"></div>
      <div className="absolute bottom-20 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-gold-500/5 blur-[150px] pulse-glow"></div>

      <section className="relative py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Scholarship Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            Merit & Need-Based <br />
            <span className="gradient-text-gold">Scholarship Eligibility Estimator</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Calculate your tuition fee waiver instantly based on previous academic reports, entrance tests, and extracurricular excellence.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Form Column */}
        <div className="md:col-span-5">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 glow-brand">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-850">
              <div className="p-2 bg-brand-950/60 border border-brand-500/30 rounded-xl">
                <Calculator className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm font-sans">Eligibility Calculator</h3>
                <p className="text-[10px] text-slate-500">Provide scores to run rules engine checks</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/30 border border-rose-900/30 text-rose-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleCalculate} className="space-y-4">
              
              {/* Class Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Applying For Class / Standard</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                >
                  {classOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Previous Class Marks */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Previous Class Marks (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="e.g. 92.5"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                </div>

                {/* Entrance Exam Score */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Entrance Exam Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    value={entranceScore}
                    onChange={(e) => setEntranceScore(e.target.value)}
                    placeholder="e.g. 88"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                </div>
              </div>

              {/* Advanced / Optional Fields Accordion-like Section */}
              <div className="border-t border-slate-850 pt-4 mt-4 space-y-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Optional parameters (Need & Sports)</span>

                {/* Parental Annual Income */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Annual Parental Income (INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={parentalIncome}
                    onChange={(e) => setParentalIncome(e.target.value)}
                    placeholder="e.g. 240000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                  />
                  <span className="text-[9px] text-slate-500 mt-1 block">Provides up to 15% need-based waiver for &lt; ₹2.5L income</span>
                </div>

                {/* Sports Quota */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Sports Achievement Level</label>
                  <select
                    value={sportsLevel}
                    onChange={(e) => setSportsLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                  >
                    <option value="None">No Quota / None</option>
                    <option value="State">State Level Achiever</option>
                    <option value="National">National Level Participant</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 mt-6 shadow-md shadow-gold-500/10"
              >
                {loading ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-ping"></span>
                    Running Calculations...
                  </>
                ) : (
                  <>
                    Calculate Eligibility <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="md:col-span-7">
          {results ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Main Result Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden glow-gold">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold-500/10 blur-[50px] z-0"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-between border-b border-slate-850 pb-6">
                  <div className="text-center sm:text-left space-y-1.5">
                    <span className="text-[10px] uppercase font-extrabold text-gold-400 tracking-wider">Estimated Waiver</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-sans">
                      {results.totalConcessionPercentage}% <span className="text-gold-400">Tuition Waiver</span>
                    </h2>
                    <p className="text-slate-400 text-[11px] font-semibold flex items-center justify-center sm:justify-start gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Class Category: {results.classRange}
                    </p>
                  </div>
                  
                  {/* Visual concession circle */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        stroke="#f59e0b" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * results.totalConcessionPercentage) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute font-sans font-black text-lg text-slate-200">
                      {results.totalConcessionPercentage}%
                    </div>
                  </div>
                </div>

                {/* Concession Breakdown */}
                <div className="pt-6 space-y-4 text-xs">
                  <h4 className="font-bold text-slate-300 font-sans">concession Breakdown analysis:</h4>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Board Merit Concession:</span>
                      <span className="font-semibold text-slate-200">{results.concessionBreakdown.boardMerit}% waiver</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Entrance Score Concession:</span>
                      <span className="font-semibold text-slate-200">{results.concessionBreakdown.entranceMerit}% waiver</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-brand-400 font-semibold">Selected Merit (Highest of Board/Entrance):</span>
                      <span className="font-bold text-brand-400">{results.concessionBreakdown.selectedMeritConcession}% waiver</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Need-based Concession (Income):</span>
                      <span className="font-semibold text-slate-200">+{results.concessionBreakdown.needsConcession}% waiver</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Sports Quota Concession:</span>
                      <span className="font-semibold text-slate-200">+{results.concessionBreakdown.sportsConcession}% waiver</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-slate-300 pt-2.5 border-t border-slate-850/80">
                      <span>Calculated Cumulative Waiver:</span>
                      <span>
                        {results.concessionBreakdown.selectedMeritConcession + 
                         results.concessionBreakdown.needsConcession + 
                         results.concessionBreakdown.sportsConcession}%
                      </span>
                    </div>

                    {results.concessionBreakdown.selectedMeritConcession + 
                     results.concessionBreakdown.needsConcession + 
                     results.concessionBreakdown.sportsConcession > results.maxTotalConcession && (
                      <div className="text-[10px] text-amber-500 italic text-right">
                        * Waiver capped at maximum structural limit of {results.maxTotalConcession}%
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stream Fees Estimator Cards */}
              {results.feeEstimates && (
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Science Card */}
                  <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3.5">
                    <span className="px-2 py-0.5 rounded bg-brand-950 text-brand-400 font-extrabold uppercase text-[9px] border border-brand-900/40 inline-block">Science Stream</span>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold block">Original Base Fee:</span>
                      <span className="text-slate-400 line-through text-xs">₹{results.feeEstimates.scienceStream.originalFee.toLocaleString()} / year</span>
                    </div>
                    <div className="space-y-1 border-t border-slate-900 pt-2.5">
                      <span className="text-[10px] text-gold-500 font-bold block">Scholarship Saved amount:</span>
                      <span className="text-gold-400 text-xs font-bold">-₹{results.feeEstimates.scienceStream.concessionAmount.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1 border-t border-slate-900 pt-2.5">
                      <span className="text-[10px] text-slate-400 font-semibold block">Net Annual Tuition Fee:</span>
                      <span className="text-slate-100 text-base font-extrabold">₹{results.feeEstimates.scienceStream.finalFee.toLocaleString()} / year</span>
                    </div>
                  </div>

                  {/* Commerce/Arts Card */}
                  <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3.5">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-gold-400 font-extrabold uppercase text-[9px] border border-gold-900/40 inline-block">Commerce / Arts Stream</span>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold block">Original Base Fee:</span>
                      <span className="text-slate-400 line-through text-xs">₹{results.feeEstimates.commerceArtsStream.originalFee.toLocaleString()} / year</span>
                    </div>
                    <div className="space-y-1 border-t border-slate-900 pt-2.5">
                      <span className="text-[10px] text-gold-500 font-bold block">Scholarship Saved amount:</span>
                      <span className="text-gold-400 text-xs font-bold">-₹{results.feeEstimates.commerceArtsStream.concessionAmount.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1 border-t border-slate-900 pt-2.5">
                      <span className="text-[10px] text-slate-400 font-semibold block">Net Annual Tuition Fee:</span>
                      <span className="text-slate-100 text-base font-extrabold">₹{results.feeEstimates.commerceArtsStream.finalFee.toLocaleString()} / year</span>
                    </div>
                  </div>

                </div>
              )}

              {/* Eligible Programs */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs text-slate-400 font-bold block uppercase border-b border-slate-850 pb-2">Your Eligible Programs Roster</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {results.eligiblePrograms && results.eligiblePrograms.length > 0 ? (
                    results.eligiblePrograms.map((program) => (
                      <span key={program} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/35 text-emerald-400 text-[11px] font-bold">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" /> {program}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs">No specific program filters returned. General direct admissions apply.</span>
                  )}
                </div>
              </div>

              {/* CTA Box */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-bold text-slate-200">Qualify for a waiver? Claim it today!</h4>
                  <p className="text-slate-500 leading-normal">Register a Guest account and complete the admissions application dossier.</p>
                </div>
                <Link 
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shrink-0 inline-flex items-center gap-1.5"
                >
                  Apply Online Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 glass-panel border border-slate-850 rounded-3xl min-h-[350px] space-y-4">
              <Award className="w-16 h-16 text-slate-800 animate-pulse" style={{ animationDuration: '4s' }} />
              <div>
                <h4 className="text-slate-400 font-bold font-sans">Awaiting Score Inputs</h4>
                <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto leading-relaxed">Fill in applying standard grade, previous marks, and entrance scores to review eligible tuition waivers.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ScholarshipEstimator;
