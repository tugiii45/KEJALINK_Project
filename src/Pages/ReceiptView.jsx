import React from 'react';

function ReceiptView({ receipt }) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 relative overflow-hidden print:p-0 print:shadow-none print:border-none w-full max-w-md mx-auto">
      {/* Visual Diagonal Ribbon Stamp for "PAID" */}
      <div className="absolute top-6 right-[-35px] bg-emerald-500 text-white font-black text-xs py-1.5 px-10 rotate-45 tracking-widest shadow-sm uppercase select-none">
        Paid
      </div>

      {/* Header Section */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <h3 className="text-xl font-black tracking-tight text-blue-600">KEJALINK</h3>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Digital Caretaker Receipt</p>
      </div>

      {/* Metadata Grid */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Receipt No:</span>
          <span className="font-mono font-bold text-gray-800">{receipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ref Code:</span>
          <span className="font-mono font-semibold text-gray-700">{receipt.referenceCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date/Time:</span>
          <span className="text-gray-700">{receipt.date} at {receipt.time}</span>
        </div>
        
        <hr className="border-gray-100" />

        <div className="flex justify-between">
          <span className="text-gray-400">Tenant Name:</span>
          <span className="font-medium text-gray-800">{receipt.tenantName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">House Unit:</span>
          <span className="font-medium text-gray-800">{receipt.houseNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Description:</span>
          <span className="text-gray-700">{receipt.type} — {receipt.month}</span>
        </div>
      </div>

      {/* Total Amount Box */}
      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 flex justify-between items-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Total Cleared</span>
        <span className="text-2xl font-black text-blue-900">
          KES {receipt.amount.toLocaleString()}
        </span>
      </div>

      {/* Action Footer for interactive preview */}
      <div className="print:hidden">
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-950 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print/Save PDF
        </button>
      </div>
    </div>
  );
}

export default ReceiptView;