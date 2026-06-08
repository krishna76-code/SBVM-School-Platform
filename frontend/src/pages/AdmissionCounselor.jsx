import React, { useState } from 'react';
import { Send, Bot, Calculator, ShieldAlert, Sparkles, Receipt } from 'lucide-react';
import API from '../services/api';

const AdmissionCounselor = () => {
  // Chat States
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Namaste! Welcome to Saraswati Bal Vidya Mandir (SBVM). I am your AI admission counselor. Ask me about our school curriculum, board success rates, hostel amenities, or fee concessions!" }] }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Calculator States
  const [targetClass, setTargetClass] = useState('Class 11 Science');
  const [previousMarks, setPreviousMarks] = useState('');
  const [entranceScore, setEntranceScore] = useState('');
  const [parentalIncome, setParentalIncome] = useState('');
  const [sportsLevel, setSportsLevel] = useState('None');
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const classOptions = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Science', 'Class 11 Commerce', 'Class 11 Arts',
    'Class 12 Science', 'Class 12 Commerce', 'Class 12 Arts'
  ];

  // Handle Chat Submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Append User message
    const updatedMessages = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(updatedMessages);
    setChatLoading(true);

    try {
      // Map history format for Gemini API standard
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      const { data } = await API.post('/ai/admission-counselor', {
        message: userMessage,
        history: chatHistory
      });

      setMessages([...updatedMessages, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (error) {
      console.error('Chat error:', error.message);
      setMessages([...updatedMessages, { role: 'model', parts: [{ text: "I'm experiencing connectivity issues right now. Please try again shortly or contact our admission desk at +91 9111111111." }] }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Calculator Submit
  const handleCalculatorSubmit = async (e) => {
    e.preventDefault();
    if (!previousMarks || !entranceScore || !parentalIncome || calcLoading) return;

    setCalcLoading(true);
    try {
      const { data } = await API.post('/scholarships/evaluate', {
        className: targetClass,
        percentage: Number(previousMarks),
        entranceScore: Number(entranceScore),
        parentalIncome: Number(parentalIncome),
        sportsLevel
      });

      setCalcResult(data.data);
    } catch (error) {
      console.error('Calculator error:', error.message);
      alert('Error calculating scholarship. Please verify your inputs.');
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans">
          Admission Counsel <span className="gradient-text">&</span> Scholarships
        </h1>
        <p className="text-slate-400 text-sm">
          Discover fee concessions, calculate annual estimates, and chat with our counselor in real-time.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Scholarship Calculator */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Calculator className="w-5 h-5 text-gold-400" />
              <h3 className="font-bold text-slate-100 font-sans">Scholarship Fee Concession Engine</h3>
            </div>

            <form onSubmit={handleCalculatorSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Target Class / Standard</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                >
                  {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Previous Class Score (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={previousMarks}
                  onChange={(e) => setPreviousMarks(e.target.value)}
                  placeholder="e.g. 92"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">SBVM Entrance Test Score (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={entranceScore}
                  onChange={(e) => setEntranceScore(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Parental Annual Income (INR)</label>
                <input 
                  type="number" 
                  value={parentalIncome}
                  onChange={(e) => setParentalIncome(e.target.value)}
                  placeholder="e.g. 350000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Sports / Co-curricular Level</label>
                <select
                  value={sportsLevel}
                  onChange={(e) => setSportsLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="None">None</option>
                  <option value="State">State Level Achievement</option>
                  <option value="National">National Level Achievement</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={calcLoading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white transition-all"
              >
                {calcLoading ? 'Calculating...' : 'Evaluate Eligibility'}
              </button>
            </form>

            {/* Results display */}
            {calcResult && (
              <div className="border-t border-slate-800 pt-6 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">Concession Rate:</span>
                  <span className="text-xl font-extrabold text-gold-400">{calcResult.totalConcessionPercentage}% Waiver</span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800/80">
                    <Receipt className="w-3.5 h-3.5" /> Est. Annual Fee Concessions
                  </div>

                  <div className="text-xs space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class 11-12 Science (Integrated):</span>
                      <span className="text-slate-200 font-bold">₹{calcResult.feeEstimates.scienceStream.finalFee} <span className="line-through text-slate-600 font-normal">₹95,000</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class 11-12 Commerce / Arts:</span>
                      <span className="text-slate-200 font-bold">₹{calcResult.feeEstimates.commerceArtsStream.finalFee} <span className="line-through text-slate-600 font-normal">₹80,000</span></span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Eligible Program Standards:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 font-sans">
                    {calcResult.eligiblePrograms && calcResult.eligiblePrograms.length > 0 ? (
                      calcResult.eligiblePrograms.map((prog) => (
                        <span key={prog} className="px-2 py-0.5 bg-brand-950/40 text-brand-400 border border-brand-900/30 rounded font-semibold text-[10px]">
                          {prog}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic text-[10px]">No eligible programs found for this tier.</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-start text-[10px] text-slate-500 leading-normal">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Estimated calculations are based on self-reported inputs. Formal scholarship concessions will be assigned after verifying authentic certificates during admissions.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: AI Counselor Chat Bot */}
        <div className="md:col-span-7 flex flex-col h-[580px] glass-panel border border-slate-800 rounded-2xl overflow-hidden relative">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 shrink-0 bg-slate-900/50">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-gold-400" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-200 font-sans text-sm">AI Enrollment Counselor</h4>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Online • Prospectus Helper
              </span>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-400 font-bold">GPT-4o-MINI</span>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <Bot className="w-4 h-4 text-gold-400" />
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              );
            })}
            
            {chatLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <Bot className="w-4 h-4 text-gold-400" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-500 rounded-tl-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-800 bg-slate-900/30 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask counselor, e.g. What is the fee for Class 11 Science?"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              disabled={chatLoading}
              required
            />
            <button 
              type="submit" 
              disabled={chatLoading}
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdmissionCounselor;
