/**
 * Receipt View Component
 * 
 * Displays a formatted digital receipt for a payment transaction.
 * Shown in PaymentDashboard when user clicks "View" on a payment row.
 * 
 * Features:
 * - Dynamic status badge (Verified/Declined/Pending) displayed as watermark
 * - Transaction details (ID, M-PESA code, timestamp)
 * - Tenant info and amount
 * - Conditional print button (only available if Verified)
 * - Red warning if Declined, amber if Pending
 * 
 * Props:
 * - receipt: Payment object from Redux state
 */

import React from 'react';

function ReceiptView({ receipt }) {
  if (!receipt) return null;

  const isVerified = receipt.status === 'Verified';
  const isDeclined = receipt.status === 'Declined';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 relative overflow-hidden w-full max-w-md mx-auto">
      
      {/* Dynamic Visual Watermark Badge depending on ledger state */}
      <div className={`absolute top-6 right-[-35px] text-white font-black text-xs py-1.5 px-10 rotate-45 tracking-widest shadow-sm uppercase select-none ${
        isVerified ? 'bg-emerald-500 shadow-emerald-100' :
        isDeclined ? 'bg-red-500 shadow-red-100' : 'bg-amber-500 shadow-amber-100'
      }`}>
        {isVerified ? 'Verified' : isDeclined ? 'Declined' : 'Pending'}
      </div>

      <div className="border-b border-gray-100 pb-4 mb-4">
        <h3 className="text-xl font-black tracking-tight text-blue-600">KEJALINK</h3>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Digital Caretaker Receipt</p>
      </div>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Transaction ID:</span>
          <span className="font-mono font-bold text-gray-800">{receipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">M-PESA Code:</span>
          <span className="font-mono font-semibold text-gray-700">{receipt.referenceCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Timestamp:</span>
          <span className="text-gray-700">{receipt.date} at {receipt.time}</span>
        </div>
        
        <hr className="border-gray-100" />

        <div className="flex justify-between">
          <span className="text-gray-400">Tenant Profile:</span>
          <span className="font-medium text-gray-800">{receipt.tenantName} (Unit {receipt.houseNumber})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Allocation:</span>
          <span className="text-gray-700">{receipt.type} — {receipt.month}</span>
        </div>
      </div>

      {/* Dynamic Amount Background Box */}
      <div className={`rounded-xl p-4 border flex justify-between items-center mb-6 ${
        isVerified ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
        isDeclined ? 'bg-red-50 border-red-100 text-red-900' : 'bg-amber-50 border-amber-100 text-amber-900'
      }`}>
        <span className="text-xs font-bold uppercase tracking-wider">Amount Processed</span>
        <span className="text-2xl font-black">KES {receipt.amount.toLocaleString()}</span>
      </div>

      {/* Action Footer Conditional Block */}
      <div>
        {isVerified ? (
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-950 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Print Clean Receipt Document
          </button>
        ) : (
          <div className={`p-2.5 rounded-lg text-center text-xs font-medium ${
            isDeclined ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isDeclined ? '❌ Receipt Voided: Invalid reference match.' : '⏳ Printable receipt hidden until landlord verification.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptView;