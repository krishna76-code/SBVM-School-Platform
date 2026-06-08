import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, ShieldCheck, CreditCard, ArrowRight, Clock, CheckCircle, AlertCircle, X, Printer, Sparkles } from 'lucide-react';
import API from '../services/api';

const Fees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment modal state
  const [selectedFee, setSelectedFee] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paying, setPaying] = useState(false);

  // Receipt modal state
  const [receiptFee, setReceiptFee] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const resolveStudentId = () => {
    return user.role === 'Parent' 
      ? (localStorage.getItem('activeChildId') || user.profile?.children?.[0]?._id || user.profile?.children?.[0]) 
      : user.profile?._id;
  };

  const fetchFees = async () => {
    setLoading(true);
    try {
      const studentId = resolveStudentId();
      if (studentId) {
        const { data } = await API.get(`/portal/fees/${studentId}`);
        setFees(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching fees:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFees();
    }
  }, [user]);

  // Listener to child switcher reloads
  useEffect(() => {
    const handleSync = () => fetchFees();
    window.addEventListener('child-switched', handleSync);
    return () => window.removeEventListener('child-switched', handleSync);
  }, []);

  const handleOpenPayModal = (fee) => {
    setSelectedFee(fee);
    setShowPayModal(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setPaying(true);
    try {
      const { data } = await API.post(`/portal/fees/pay/${selectedFee._id}`, {
        paymentMethod: `${paymentMethod} (Simulated)`
      });
      alert('Payment simulation successful!');
      setShowPayModal(false);
      
      // Trigger receipt modal
      setReceiptFee(data.data);
      setShowReceiptModal(true);
      
      fetchFees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing payment');
    } finally {
      setPaying(false);
    }
  };

  // Compute fee stats
  const totalInvoiced = fees.reduce((sum, f) => sum + f.finalAmount, 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.finalAmount, 0);
  const pendingAmount = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-gold-400" /> Fees Ledger & Accounts
          </h2>
          <p className="text-slate-400 text-xs mt-1">Review student term invoices, calculate concessions, and pay simulated dues.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total Billing</span>
              <h3 className="text-2xl font-extrabold text-slate-100">₹{totalInvoiced.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-500">Waivers pre-calculated</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total Settled</span>
              <h3 className="text-2xl font-extrabold text-emerald-400">₹{totalPaid.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-500">Cleared payment invoices</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Remaining Dues</span>
              <h3 className={`text-2xl font-extrabold ${pendingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                ₹{pendingAmount.toLocaleString()}
              </h3>
              <p className="text-[10px] text-slate-500">Outstanding balance</p>
            </div>
          </div>

          {/* Fees Listing Table */}
          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Term</th>
                  <th className="p-4">Standard Rate</th>
                  <th className="p-4">Concession</th>
                  <th className="p-4">Final Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {fees.length === 0 ? (
                  <tr><td colSpan="6" className="p-6 text-center text-slate-500">No invoices generated for this student.</td></tr>
                ) : (
                  fees.map((fee) => (
                    <tr key={fee._id} className="hover:bg-slate-900/20 transition-all text-slate-350">
                      <td className="p-4 font-bold text-slate-200">{fee.term} Term Fee</td>
                      <td className="p-4">₹{fee.amount.toLocaleString()}</td>
                      <td className="p-4 text-gold-450 font-semibold">{fee.concession}% Waiver</td>
                      <td className="p-4 font-extrabold text-slate-100">₹{fee.finalAmount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fee.status === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' :
                          fee.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                          'bg-rose-950 text-rose-400 border border-rose-900/30'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {fee.status === 'Paid' ? (
                          <button
                            onClick={() => {
                              setReceiptFee(fee);
                              setShowReceiptModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-brand-400 hover:text-brand-300 hover:border-slate-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" /> Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenPayModal(fee)}
                            className="px-3 py-1.5 rounded-lg bg-brand-650 hover:bg-brand-600 text-[10px] font-bold text-white transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)] inline-flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 1. PAYMENT SIMULATION MODAL */}
      {/* ============================================================ */}
      {showPayModal && selectedFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Simulated Online Payment</h3>
                <p className="text-xs text-slate-500">SBVM Fee Gateway • {selectedFee.term} Term</p>
              </div>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-5 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Standard Term Amount:</span>
                  <span>₹{selectedFee.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gold-450">
                  <span>Scholarship Waiver Concession:</span>
                  <span>-{selectedFee.concession}%</span>
                </div>
                <div className="flex justify-between border-t border-slate-900 pt-2 font-bold text-slate-100 text-sm">
                  <span>Net Payable Amount:</span>
                  <span>₹{selectedFee.finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Card', 'Net Banking'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        paymentMethod === method
                          ? 'bg-brand-950/40 border-brand-500 text-brand-400'
                          : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> {paying ? 'Authorizing...' : `Pay ₹${selectedFee.finalAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. RECEIPT VIEW MODAL */}
      {/* ============================================================ */}
      {showReceiptModal && receiptFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h3 className="text-lg font-bold text-slate-200 font-sans">Payment Receipt</h3>
              </div>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <div className="space-y-4 text-xs text-slate-350">
              <div className="text-center py-4 space-y-1 bg-slate-900/30 border border-slate-850 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transaction Settled</span>
                <h2 className="text-3xl font-black text-emerald-400">₹{receiptFee.finalAmount.toLocaleString()}</h2>
                <span className="text-[10px] text-slate-400 font-medium">Status: PAID</span>
              </div>

              <div className="space-y-2 border-t border-b border-slate-850 py-3 leading-loose">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Term Invoice:</span>
                  <span className="font-bold text-slate-200">{receiptFee.term} Term Fee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment Gateway:</span>
                  <span className="font-bold text-slate-200">{receiptFee.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Settlement Time:</span>
                  <span className="font-bold text-slate-200">{new Date(receiptFee.paymentDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Reference Transaction ID:</span>
                  <span className="font-bold text-slate-200 font-mono text-[11px]">{receiptFee.transactionId}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 font-bold text-xs text-center block transition-all"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Fees;
