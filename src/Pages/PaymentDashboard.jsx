import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { processPayment, clearCurrentReceipt } from '../Features/PaymentSlice'
import ReceiptView from './ReceiptView'

function PaymentDashboard() {
  const dispatch = useDispatch()

  const { loading, error, currentReceipt } = useSelector(
    (state) => state.payments
  )

  // Form local state
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Rent',
    month: 'May 2026',
    referenceCode: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // basic validation
    if (!formData.amount || !formData.referenceCode) {
      return
    }

    dispatch(
      processPayment({
        tenantName: 'Conrad',
        houseNumber: 'A4',
        amount: parseFloat(formData.amount),
        type: formData.type,
        month: formData.month,
        referenceCode: formData.referenceCode.toUpperCase(),
      })
    )

    // Reset after submission
    setFormData((prev) => ({
      ...prev,
      amount: '',
      referenceCode: '',
    }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Portal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Log New Payment</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Payment Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Rent">Rent</option>
                <option value="Water">Water</option>
                <option value="Service Charge">Service Charge</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount (KES)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g 25000"
                required
                className="w-full p-2.5 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Billing Month
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="May 2026">May 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="July 2026">July 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                MPESA / Reference Code
              </label>
              <input
                type="text"
                name="referenceCode"
                value={formData.referenceCode}
                onChange={handleChange}
                placeholder="e.g TFX94KLD2"
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing Transaction...' : 'Submit Payment Log'}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center">
          {currentReceipt ? (
            <div className="w-full space-y-4">
              <ReceiptView receipt={currentReceipt} />
              <button
                onClick={() => dispatch(clearCurrentReceipt())}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Clear Receipt Window
              </button>
            </div>
          ) : (
            <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400 bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
              <svg
                className="w-12 h-12 mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>No active transaction.</p>
              <p className="text-xs mt-1">
                Submit a payment log on the left to generate an official digital receipt.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentDashboard
