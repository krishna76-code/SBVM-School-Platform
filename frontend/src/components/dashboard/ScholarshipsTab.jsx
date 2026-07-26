import React from 'react';
import { Award } from 'lucide-react';

const ScholarshipsTab = ({
  scholarshipRules,
  editingRule,
  setEditingRule,
  savingRule,
  classOptions,
  handleSaveRule
}) => {
  return (
    <div className="space-y-6 font-sans text-left">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 font-sans">
            <Award className="w-5 h-5 text-gold-400 animate-pulse" /> Scholarship Rules Panel
          </h3>
          <p className="text-slate-400 text-xs mt-1 font-normal">Configure merit score tiers, sports/need criteria, and eligible classes in real-time.</p>
        </div>
      </div>

      {editingRule ? (
        <form onSubmit={handleSaveRule} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 text-xs text-left">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
            <h4 className="text-sm font-bold text-slate-200">Editing Rules for: <span className="text-gold-455 font-sans">{editingRule.classRange}</span></h4>
            <button type="button" onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-slate-200 font-bold">✕ Close Editor</button>
          </div>

          {/* Tiers Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Board Tiers */}
            <div className="space-y-4">
              <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Previous Board Marks Tiers</span>
              {editingRule.boardTiers.map((tier, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-[10px] text-slate-500 font-semibold w-16">Min Marks %:</span>
                  <input 
                    type="number" 
                    value={tier.minScore} 
                    onChange={(e) => {
                      const updated = [...editingRule.boardTiers];
                      updated[idx].minScore = Number(e.target.value);
                      setEditingRule({ ...editingRule, boardTiers: updated });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-semibold">Waiver %:</span>
                  <input 
                    type="number" 
                    value={tier.concession} 
                    onChange={(e) => {
                      const updated = [...editingRule.boardTiers];
                      updated[idx].concession = Number(e.target.value);
                      setEditingRule({ ...editingRule, boardTiers: updated });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const updated = editingRule.boardTiers.filter((_, i) => i !== idx);
                      setEditingRule({ ...editingRule, boardTiers: updated });
                    }}
                    className="text-rose-400 hover:text-rose-300 font-semibold px-2 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => {
                  const updated = [...editingRule.boardTiers, { minScore: 80, concession: 10 }];
                  setEditingRule({ ...editingRule, boardTiers: updated });
                }}
                className="text-brand-400 hover:text-brand-350 block font-bold text-[10px]"
              >
                + Add Board Score Tier
              </button>
            </div>

            {/* Entrance Tiers */}
            <div className="space-y-4">
              <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Entrance Test Tiers</span>
              {editingRule.entranceTiers.map((tier, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-[10px] text-slate-500 font-semibold w-16">Min Score %:</span>
                  <input 
                    type="number" 
                    value={tier.minScore} 
                    onChange={(e) => {
                      const updated = [...editingRule.entranceTiers];
                      updated[idx].minScore = Number(e.target.value);
                      setEditingRule({ ...editingRule, entranceTiers: updated });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-semibold">Waiver %:</span>
                  <input 
                    type="number" 
                    value={tier.concession} 
                    onChange={(e) => {
                      const updated = [...editingRule.entranceTiers];
                      updated[idx].concession = Number(e.target.value);
                      setEditingRule({ ...editingRule, entranceTiers: updated });
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const updated = editingRule.entranceTiers.filter((_, i) => i !== idx);
                      setEditingRule({ ...editingRule, entranceTiers: updated });
                    }}
                    className="text-rose-400 hover:text-rose-300 font-semibold px-2 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => {
                  const updated = [...editingRule.entranceTiers, { minScore: 80, concession: 10 }];
                  setEditingRule({ ...editingRule, entranceTiers: updated });
                }}
                className="text-brand-400 hover:text-brand-350 block font-bold text-[10px]"
              >
                + Add Entrance Score Tier
              </button>
            </div>
          </div>

          {/* Other Concessions */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-850">
            <div className="space-y-4">
              <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Sports Achievement Concessions</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">National Level Concession %</label>
                  <input 
                    type="number" 
                    value={editingRule.sportsNationalConcession} 
                    onChange={(e) => setEditingRule({ ...editingRule, sportsNationalConcession: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">State Level Concession %</label>
                  <input 
                    type="number" 
                    value={editingRule.sportsStateConcession} 
                    onChange={(e) => setEditingRule({ ...editingRule, sportsStateConcession: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Need-based & Caps</span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">Income &lt; 2.5L %</label>
                  <input 
                    type="number" 
                    value={editingRule.incomeBelow25kConcession} 
                    onChange={(e) => setEditingRule({ ...editingRule, incomeBelow25kConcession: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">Income &lt; 5.0L %</label>
                  <input 
                    type="number" 
                    value={editingRule.incomeBelow50kConcession} 
                    onChange={(e) => setEditingRule({ ...editingRule, incomeBelow50kConcession: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-1">Total Cap %</label>
                  <input 
                    type="number" 
                    value={editingRule.maxTotalConcession} 
                    onChange={(e) => setEditingRule({ ...editingRule, maxTotalConcession: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Eligible Classes */}
          <div className="space-y-3 pt-4 border-t border-slate-850">
            <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Eligible Programs / Standard Options</span>
            <div className="flex flex-wrap gap-2.5 pt-1.5">
              {classOptions.map((c) => {
                const isChecked = editingRule.eligiblePrograms?.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const updated = isChecked
                        ? editingRule.eligiblePrograms.filter(p => p !== c)
                        : [...editingRule.eligiblePrograms, c];
                      setEditingRule({ ...editingRule, eligiblePrograms: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      isChecked
                        ? 'bg-brand-950/40 border-brand-500 text-brand-400'
                        : 'bg-slate-900 border-slate-850 text-slate-450 hover:text-slate-350'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setEditingRule(null)}
              className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={savingRule}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-md shadow-brand-500/10"
            >
              {savingRule ? 'Saving Changes...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {(!scholarshipRules || scholarshipRules.length === 0) ? (
            <p className="text-slate-500 text-xs text-center col-span-3">No scholarship rules defined.</p>
          ) : (
            scholarshipRules.map((rule) => (
              <div key={rule._id} className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-4 text-xs flex flex-col justify-between hover:border-slate-800 transition-all">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-extrabold text-gold-400 tracking-wider bg-gold-950/20 px-2.5 py-0.5 rounded border border-gold-500/20 inline-block font-sans">
                    {rule.classRange}
                  </span>
                  
                  <div className="space-y-1.5 pt-2">
                    <span className="text-slate-400 font-bold block mb-1">Concession Merit Thresholds:</span>
                    {rule.boardTiers?.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>Board Marks &ge; {t.minScore}%:</span>
                        <span className="font-bold text-slate-200">{t.concession}% Waiver</span>
                      </div>
                    ))}
                    {rule.entranceTiers?.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>Entrance Marks &ge; {t.minScore}%:</span>
                        <span className="font-bold text-slate-200">{t.concession}% Waiver</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-semibold font-mono">Cap: {rule.maxTotalConcession}%</span>
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 font-semibold text-slate-300 transition-all text-[11px]"
                  >
                    Edit Rule
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScholarshipsTab;
