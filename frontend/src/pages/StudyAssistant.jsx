import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, FileText, Sparkles, BookOpen, HelpCircle, MessageSquare,
  ChevronRight, ChevronLeft, Trash2, Loader2, CheckCircle2,
  AlertCircle, Clock, Bot, User, RotateCcw, X, Plus,
  Brain, Layers, FileQuestion, Send
} from 'lucide-react';
import API from '../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const StatusBadge = ({ status }) => {
  const map = {
    processing: { icon: Loader2, color: 'text-amber-400 bg-amber-950/40 border-amber-900/50', label: 'Processing', spin: true },
    ready:      { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50', label: 'Ready', spin: false },
    error:      { icon: AlertCircle, color: 'text-red-400 bg-red-950/40 border-red-900/50', label: 'Error', spin: false }
  };
  const s = map[status] || map.error;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.color}`}>
      <Icon className={`w-3 h-3 ${s.spin ? 'animate-spin' : ''}`} />
      {s.label}
    </span>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Upload Zone
const UploadZone = ({ onUpload, uploading }) => {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || file.type !== 'application/pdf') return;
    onUpload(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group
        ${dragging ? 'border-brand-500 bg-brand-950/30 scale-[1.01]' : 'border-slate-700 hover:border-brand-600 hover:bg-slate-900/50'}
        ${uploading ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all
        ${dragging ? 'bg-brand-600' : 'bg-slate-800 group-hover:bg-brand-900/50'}`}>
        {uploading
          ? <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          : <Upload className={`w-8 h-8 ${dragging ? 'text-white' : 'text-brand-400 group-hover:text-brand-300'}`} />
        }
      </div>

      <div className="text-center">
        <p className="font-bold text-slate-200 text-sm">
          {uploading ? 'Uploading & processing…' : dragging ? 'Drop PDF here' : 'Upload a PDF'}
        </p>
        <p className="text-slate-500 text-xs mt-1">Drag & drop or click to browse • Max 20 MB</p>
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-600">
        {['AI Summary', 'MCQs', 'Flashcards', 'Q&A Chat'].map(f => (
          <span key={f} className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-700" />{f}</span>
        ))}
      </div>
    </div>
  );
};

// Document Card
const DocCard = ({ doc, selected, onSelect, onDelete }) => (
  <div
    onClick={() => onSelect(doc)}
    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all group
      ${selected
        ? 'border-brand-600/60 bg-brand-950/30'
        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900'}`}
  >
    <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center">
      <FileText className="w-4 h-4 text-brand-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-200 truncate">{doc.fileName}</p>
      <div className="flex items-center gap-2 mt-1">
        <StatusBadge status={doc.status} />
        <span className="text-[9px] text-slate-600">{doc.pageCount}p • {fmt(doc.fileSize)}</span>
      </div>
    </div>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(doc._id); }}
      className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-600 hover:text-red-400 transition-all"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

// Summary Panel
const SummaryPanel = ({ docId, cached, cachedData }) => {
  const [summary, setSummary] = useState(cachedData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (regen = false) => {
    setLoading(true); setError(null);
    try {
      const { data } = await API.post(`/study/documents/${docId}/summary`, { regenerate: regen });
      setSummary(data.summary);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate summary.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (!summary && !loading) generate(); }, [docId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      <p className="text-sm">Generating summary…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center gap-3 py-12">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm text-red-300">{error}</p>
      <button onClick={() => generate()} className="text-xs text-brand-400 hover:underline">Retry</button>
    </div>
  );

  if (!summary) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" /> Document Summary
        </h3>
        <button onClick={() => generate(true)} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-brand-400 transition-colors">
          <RotateCcw className="w-3 h-3" /> Regenerate
        </button>
      </div>
      <div className="prose prose-invert prose-sm max-w-none bg-slate-900/60 rounded-xl p-5 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap text-xs">
        {summary}
      </div>
    </div>
  );
};

// MCQ Panel
const MCQPanel = ({ docId, cachedData }) => {
  const [mcqs, setMcqs] = useState(cachedData?.length ? cachedData : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(10);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);

  const generate = async (regen = false) => {
    setLoading(true); setError(null); setAnswers({}); setRevealed({}); setScore(null);
    try {
      const { data } = await API.post(`/study/documents/${docId}/mcqs`, { count, regenerate: regen });
      setMcqs(data.mcqs);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate MCQs.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (!mcqs && !loading) generate(); }, [docId]);

  const handleAnswer = (qi, opt) => {
    setAnswers(a => ({ ...a, [qi]: opt }));
    setRevealed(r => ({ ...r, [qi]: true }));
  };

  const calcScore = () => {
    let correct = 0;
    mcqs.forEach((q, i) => { if (answers[i] === q.correctAnswer) correct++; });
    setScore({ correct, total: mcqs.length });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      <p className="text-sm">Generating {count} MCQs…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center gap-3 py-12">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm text-red-300">{error}</p>
      <button onClick={() => generate()} className="text-xs text-brand-400 hover:underline">Retry</button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-400" /> Practice MCQs
          {mcqs && <span className="text-[10px] text-slate-500 font-normal">({mcqs.length} questions)</span>}
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-brand-500"
          >
            {[5, 10, 15, 20].map(n => <option key={n}>{n}</option>)}
          </select>
          <button onClick={() => generate(true)} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-brand-400 transition-colors px-2 py-1 rounded border border-slate-800 hover:border-slate-700">
            <RotateCcw className="w-3 h-3" /> New Set
          </button>
          {mcqs && !score && (
            <button onClick={calcScore} className="flex items-center gap-1 text-[10px] bg-brand-600 hover:bg-brand-500 text-white px-3 py-1 rounded-lg font-bold transition-colors">
              Check Score
            </button>
          )}
        </div>
      </div>

      {score && (
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${score.correct / score.total >= 0.7 ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-amber-950/30 border-amber-900/50'}`}>
          <div className="text-3xl font-black text-slate-100">{score.correct}<span className="text-base text-slate-500">/{score.total}</span></div>
          <div>
            <p className="font-bold text-sm text-slate-200">{score.correct / score.total >= 0.7 ? '🎉 Great performance!' : '📚 Keep practicing!'}</p>
            <p className="text-xs text-slate-400">{Math.round(score.correct / score.total * 100)}% accuracy</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {(mcqs || []).map((q, qi) => (
          <div key={qi} className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-200">
              <span className="text-brand-400 mr-2">Q{qi + 1}.</span>{q.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(q.options || []).map((opt, oi) => {
                const chosen = answers[qi] === opt;
                const isCorrect = opt === q.correctAnswer;
                const show = revealed[qi];
                return (
                  <button
                    key={oi}
                    onClick={() => !revealed[qi] && handleAnswer(qi, opt)}
                    disabled={revealed[qi]}
                    className={`text-left text-[11px] px-3 py-2 rounded-lg border transition-all font-medium
                      ${show
                        ? isCorrect
                          ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300'
                          : chosen
                            ? 'border-red-700 bg-red-950/40 text-red-300'
                            : 'border-slate-800 text-slate-500'
                        : 'border-slate-700 hover:border-brand-600 hover:bg-brand-950/20 text-slate-300 cursor-pointer'
                      }`}
                  >
                    <span className="font-bold mr-2 text-slate-500">{String.fromCharCode(65 + oi)}.</span>{opt}
                  </button>
                );
              })}
            </div>
            {revealed[qi] && q.explanation && (
              <p className="text-[10px] text-slate-400 bg-slate-900 rounded-lg px-3 py-2 border border-slate-800">
                <span className="font-bold text-gold-400">Explanation: </span>{q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Flashcard Panel
const FlashcardPanel = ({ docId, cachedData }) => {
  const [cards, setCards] = useState(cachedData?.length ? cachedData : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(12);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const generate = async (regen = false) => {
    setLoading(true); setError(null); setCurrent(0); setFlipped(false);
    try {
      const { data } = await API.post(`/study/documents/${docId}/flashcards`, { count, regenerate: regen });
      setCards(data.flashcards);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate flashcards.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (!cards && !loading) generate(); }, [docId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      <p className="text-sm">Creating {count} flashcards…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center gap-3 py-12">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm text-red-300">{error}</p>
      <button onClick={() => generate()} className="text-xs text-brand-400 hover:underline">Retry</button>
    </div>
  );

  if (!cards) return null;

  const card = cards[current];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-gold-400" /> Flashcards
          <span className="text-[10px] text-slate-500 font-normal">({cards.length} cards)</span>
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-brand-500"
          >
            {[5, 8, 12, 15, 20, 25].map(n => <option key={n}>{n}</option>)}
          </select>
          <button onClick={() => generate(true)} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-brand-400 transition-colors px-2 py-1 rounded border border-slate-800">
            <RotateCcw className="w-3 h-3" /> New Set
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-brand-600 to-gold-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((current + 1) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 shrink-0">{current + 1} / {cards.length}</span>
      </div>

      {/* Flip Card */}
      <div className="flex justify-center">
        <div
          className={`relative w-full max-w-md h-52 cursor-pointer`}
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped(f => !f)}
        >
          <div
            className="absolute inset-0 rounded-2xl transition-all duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-[9px] text-brand-400 font-bold uppercase tracking-widest mb-3">Term / Concept</div>
              <p className="text-sm font-bold text-slate-100 leading-relaxed">{card.front}</p>
              <p className="text-[10px] text-slate-600 mt-4">Click to flip</p>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-brand-950 to-slate-900 rounded-2xl border border-brand-800/40"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="text-[9px] text-gold-400 font-bold uppercase tracking-widest mb-3">Answer / Definition</div>
              <p className="text-sm text-slate-200 leading-relaxed">{card.back}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => { setCurrent(c => Math.max(0, c - 1)); setFlipped(false); }}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:border-slate-600 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => { setFlipped(false); setCurrent(c => Math.min(cards.length - 1, c + 1)); }}
          disabled={current === cards.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* All cards grid */}
      <div className="border-t border-slate-800 pt-4">
        <p className="text-[10px] text-slate-600 font-semibold mb-3">ALL CARDS</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {cards.map((c, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setFlipped(false); }}
              className={`text-left p-2.5 rounded-xl border text-[10px] transition-all
                ${i === current ? 'border-brand-600 bg-brand-950/30 text-brand-300' : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'}`}
            >
              <span className="font-bold text-slate-600 mr-1">{i + 1}.</span>
              {c.front.slice(0, 50)}{c.front.length > 50 ? '…' : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Q&A / RAG Chat Panel
const QAPanel = ({ docId }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Ask me anything about this document. I'll find the most relevant passages and give you a precise, cited answer." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleAsk = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const { data } = await API.post(`/study/documents/${docId}/ask`, { question: q });
      setMessages(m => [...m, { role: 'ai', text: data.answer, sources: data.sources, ragContext: data.ragContext }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'ai', text: 'An error occurred. Please try again.', error: true }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[560px]">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <MessageSquare className="w-4 h-4 text-brand-400" />
        <h3 className="text-sm font-bold text-slate-200">Ask the Document</h3>
        <span className="ml-auto flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />RAG Active
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center
              ${msg.role === 'user' ? 'bg-brand-600' : 'bg-slate-800 border border-slate-700'}`}>
              {msg.role === 'user'
                ? <User className="w-3.5 h-3.5 text-white" />
                : <Bot className="w-3.5 h-3.5 text-gold-400" />}
            </div>
            <div className={`max-w-[82%] space-y-2`}>
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : msg.error
                    ? 'bg-red-950/40 border border-red-900/40 text-red-300 rounded-tl-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}
              >
                {msg.text}
              </div>
              {/* Source citations */}
              {msg.sources?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.sources.slice(0, 3).map((s, si) => (
                    <span key={si} title={s.preview} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 cursor-help">
                      Passage {s.chunkIndex + 1} • {(s.score * 100).toFixed(0)}% match
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 shrink-0 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-gold-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {['Summarize the main idea', 'What are the key concepts?', 'List all important dates or formulas', 'Explain the conclusion'].map(p => (
            <button key={p} onClick={() => setInput(p)}
              className="text-[10px] px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-brand-600 hover:text-brand-300 transition-all">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleAsk} className="flex gap-2 pt-3 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about the document…"
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
        />
        <button type="submit" disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all disabled:opacity-40 disabled:pointer-events-none">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'summary',    label: 'Summary',    icon: Sparkles,       color: 'text-gold-400'    },
  { id: 'mcqs',       label: 'MCQs',       icon: HelpCircle,     color: 'text-brand-400'   },
  { id: 'flashcards', label: 'Flashcards', icon: Layers,         color: 'text-emerald-400' },
  { id: 'qa',         label: 'Ask PDF',    icon: MessageSquare,  color: 'text-purple-400'  }
];

// ─── Main StudyAssistant Component ────────────────────────────────────────────
const StudyAssistant = () => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const pollRef = useRef(null);

  // Fetch document list
  const fetchDocs = useCallback(async () => {
    try {
      const { data } = await API.get('/study/documents');
      setDocs(data.documents || []);
      // Update selected doc if it changed
      if (selectedDoc) {
        const updated = data.documents.find(d => d._id === selectedDoc._id);
        if (updated) setSelectedDoc(updated);
      }
    } catch (e) {
      console.error('Failed to fetch documents:', e);
    } finally { setLoadingDocs(false); }
  }, [selectedDoc?._id]);

  useEffect(() => { fetchDocs(); }, []);

  // Poll if any doc is processing
  useEffect(() => {
    const hasProcessing = docs.some(d => d.status === 'processing');
    if (hasProcessing) {
      pollRef.current = setInterval(fetchDocs, 4000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [docs, fetchDocs]);

  const handleUpload = async (file) => {
    setUploading(true); setUploadError(null);
    const form = new FormData();
    form.append('pdf', file);
    try {
      const { data } = await API.post('/study/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchDocs();
      setSelectedDoc(data.document);
      setActiveTab('summary');
    } catch (e) {
      setUploadError(e.response?.data?.message || 'Upload failed. Please try again.');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document and all its data?')) return;
    try {
      await API.delete(`/study/documents/${id}`);
      if (selectedDoc?._id === id) setSelectedDoc(null);
      await fetchDocs();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed.');
    }
  };

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setActiveTab('summary');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-400" /> AI Study Assistant
          </h2>
          <p className="text-slate-500 text-xs mt-1">Upload PDFs • Generate summaries, MCQs, flashcards • Ask questions via RAG</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-brand-300 bg-brand-950/30 border border-brand-900/40 px-3 py-1.5 rounded-full font-semibold">
          <Sparkles className="w-3 h-3" /> GPT-4o-mini + Pinecone
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">

        {/* ── Left Sidebar: Document Library ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Upload Zone */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upload PDF</h3>
            <UploadZone onUpload={handleUpload} uploading={uploading} />
            {uploadError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-xl px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />{uploadError}
                <button onClick={() => setUploadError(null)} className="ml-auto"><X className="w-3 h-3" /></button>
              </div>
            )}
          </div>

          {/* Document Library */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> My Documents
              <span className="ml-auto text-slate-600 font-normal">{docs.length}</span>
            </h3>

            {loadingDocs ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              </div>
            ) : docs.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-xs">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No documents yet. Upload a PDF to begin.
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {docs.map(doc => (
                  <DocCard
                    key={doc._id}
                    doc={doc}
                    selected={selectedDoc?._id === doc._id}
                    onSelect={handleSelectDoc}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Panel: AI Features ── */}
        <div className="lg:col-span-8 glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {!selectedDoc ? (
            <div className="flex flex-col items-center justify-center gap-5 py-24 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                <Brain className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <p className="text-slate-400 font-semibold text-sm">No document selected</p>
                <p className="text-slate-600 text-xs mt-1">Upload a PDF or select one from your library to activate AI features</p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
                {[
                  { icon: Sparkles, label: 'Smart Summary',    color: 'text-gold-400' },
                  { icon: HelpCircle, label: 'Practice MCQs',  color: 'text-brand-400' },
                  { icon: Layers, label: 'Flip Flashcards',    color: 'text-emerald-400' },
                  { icon: MessageSquare, label: 'Ask Anything', color: 'text-purple-400' }
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-500">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />{label}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Doc Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/30">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{selectedDoc.fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={selectedDoc.status} />
                    <span className="text-[9px] text-slate-600">{selectedDoc.pageCount}p • {fmt(selectedDoc.fileSize)} • {selectedDoc.chunkCount} chunks</span>
                  </div>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-600 hover:text-slate-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Processing overlay */}
              {selectedDoc.status === 'processing' && (
                <div className="m-5 flex items-center gap-3 text-sm text-amber-300 bg-amber-950/30 border border-amber-900/40 rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  Embedding document into vector database… AI features will unlock shortly.
                </div>
              )}

              {selectedDoc.status === 'error' && (
                <div className="m-5 flex items-center gap-3 text-sm text-red-300 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Processing failed. Please delete and re-upload the document.
                </div>
              )}

              {/* Tabs */}
              {selectedDoc.status === 'ready' && (
                <>
                  <div className="flex border-b border-slate-800 px-5 overflow-x-auto">
                    {TABS.map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap
                            ${activeTab === tab.id
                              ? `border-brand-500 ${tab.color}`
                              : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                          <Icon className="w-3.5 h-3.5" />{tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab content */}
                  <div className="p-5">
                    {activeTab === 'summary' && (
                      <SummaryPanel
                        key={selectedDoc._id + '-summary'}
                        docId={selectedDoc._id}
                        cachedData={selectedDoc.summary}
                      />
                    )}
                    {activeTab === 'mcqs' && (
                      <MCQPanel
                        key={selectedDoc._id + '-mcqs'}
                        docId={selectedDoc._id}
                        cachedData={selectedDoc.mcqs}
                      />
                    )}
                    {activeTab === 'flashcards' && (
                      <FlashcardPanel
                        key={selectedDoc._id + '-flashcards'}
                        docId={selectedDoc._id}
                        cachedData={selectedDoc.flashcards}
                      />
                    )}
                    {activeTab === 'qa' && (
                      <QAPanel
                        key={selectedDoc._id + '-qa'}
                        docId={selectedDoc._id}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudyAssistant;
