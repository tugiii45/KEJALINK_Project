/**
 * Payment Dashboard
 * 
 * Handles rent/utility payments for tenants and payment verification for landlords.
 * 
 * TENANT VIEW:
 * - Form to submit payment with M-PESA reference code
 * - Shows their own payment history with status
 * 
 * LANDLORD VIEW:
 * - Table of all tenant payments
 * - Verify button to approve payment (changes status to 'Verified')
 * - Decline button to reject payment (changes status to 'Declined')
 * - Link to payment verification from LandlordDashboard
 * 
 * 
 * CRITICAL: Payments are synced in real-time from Firestore via onSnapshot listener.
 * When a tenant submits a payment, it's saved to Firestore AND synced back to Redux.
 * This ensures both users see the payment immediately.
 */

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ReceiptView from './ReceiptView'
import { addPayment, updatePaymentStatus } from '../Features/PaymentSlice'
import { db } from '../../firebase'
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore'
import { upsertPaymentFromServer } from '../Features/PaymentLedgerSlice'





function PaymentDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Redux role may come as 'Landlord'/'Tenant' (from Firestore) or lowercase.
  const normalizedRole = user?.role?.toString().toLowerCase();
  const currentRole = normalizedRole === 'landlord' ? 'Landlord' : 'Tenant'


  const landlordPayments = useSelector((state) => state.paymentLedger.payments)

  // Ledger should be driven by Firestore-synced paymentLedger.
  // Tenant previously relied on `state.payments.payments` which is not kept in sync from Firestore.
  const paymentHistory = landlordPayments.filter((p) => {
    if (currentRole === 'Landlord') return true
    // Tenant: only show their own payments (prefer tenantUid).
    if (user?.uid) return p.tenantUid === user.uid
    // Fallback to houseNumber if uid is missing.
    if (user?.houseNumber) return p.houseNumber === user.houseNumber
    return false
  })







  const [loading, setLoading] = useState(false)
  const [currentReceipt, setCurrentReceipt] = useState(null)
  
  // Inline message state for form feedback
  const [feedbackMessage, setFeedbackMessage] = useState(null) // { type: 'error'|'success', text: string }

  const [formData, setFormData] = useState({
    amount: '',
    type: 'Rent',
    month: 'May 2026',
    referenceCode: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    // Update specific form field while keeping other fields unchanged
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Tenant submits a payment for landlord verification
  // Accept activeUser prop object containing the authenticated session profile
  const handleTenantSubmit = async (e, activeUser) => {
    e.preventDefault()
    // Validate required fields before proceeding
    if (!formData.amount || !formData.referenceCode) return

    // Verify user profile has all required information
    if (!activeUser?.fullName || !activeUser?.houseNumber || !activeUser?.uid) {
      setFeedbackMessage({ type: 'error', text: 'Missing tenant profile details. Please log in again.' })
      setLoading(false)
      return
    }

    setLoading(true)

    // Generate unique payment ID in format "KL-XXXXXX"
    const generatedId = `KL-${Math.floor(100000 + Math.random() * 900000)}`

    // Create payment record with all transaction details
    const newPayment = {
      id: generatedId,
      tenantName: activeUser.fullName,
      houseNumber: activeUser.houseNumber,
      tenantUid: activeUser.uid,  // Link payment to tenant account
      amount: parseFloat(formData.amount),
      type: formData.type,
      month: formData.month,
      referenceCode: formData.referenceCode.toUpperCase(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Verification',  // Landlord will change to 'Verified' or 'Declined'
      createdAt: serverTimestamp(),
    }

    // Keep local UI responsive by updating Redux immediately
    dispatch(addPayment(newPayment))

    // Persist to Firestore so landlord sees it in real-time
    try {
      await addDoc(collection(db, 'payments'), newPayment)
    } catch (err) {
      console.error(err)
      setFeedbackMessage({ type: 'error', text: 'Failed to submit payment. Please try again.' })
    } finally {
      // Clear form fields after submission
      setFormData((prev) => ({ ...prev, amount: '', referenceCode: '' }))
      setLoading(false)
    }
  }



  // Landlord verifies or declines a payment (update Firestore + sync Redux)
  const handleVerifyStatus = async (id, newStatus) => {
    // Optimistic UI: Update Redux state immediately for responsive UI
    dispatch(updatePaymentStatus({ id, status: newStatus }))

    try {
      // Find the Firestore document that matches this payment ID
      const q = query(collection(db, 'payments'))
      const snap = await getDocs(q)
      // Search for document where the 'id' field matches our payment ID
      const match = snap.docs.find((d) => d.data()?.id === id)
      if (!match) {
        console.warn('[PaymentDashboard] Could not find payment doc for id:', id)
        return
      }

      // Update the payment status in Firestore
      await updateDoc(doc(db, 'payments', match.id), { status: newStatus })
    } catch (err) {
      console.error(err)
      setFeedbackMessage({ type: 'error', text: 'Failed to update verification status in database.' })
    }
  }


  // Sync all payments from Firestore into Redux state in real-time
  useEffect(() => {
    // Query all payments from Firestore collection
    const q = query(collection(db, 'payments'))

    // Set up real-time listener that fires whenever payments change
    const unsub = onSnapshot(q, (snap) => {
      console.log('[PaymentDashboard] payments snapshot size:', snap.size)
      // Process each payment document
      snap.forEach((d) => {
        const data = d.data()
        // Upsert (insert or update) payment into Redux ledger
        dispatch(upsertPaymentFromServer({
          id: data.id ?? d.id,  // Use custom id field or Firestore doc ID
          ...data,
        }))
      })
    })

    // Cleanup: unsubscribe from listener when component unmounts
    return () => unsub()
  }, [dispatch])

  // Keep receipt preview in sync with latest payment data from ledger
  useEffect(() => {
    if (!currentReceipt) return
    // Find updated payment data in ledger
    const updated = paymentHistory.find((p) => p.id === currentReceipt.id)
    if (!updated) return
    // Update receipt view with latest data (especially status changes)
    setCurrentReceipt(updated)
  }, [paymentHistory, currentReceipt])


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="bg-gray-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg" style={{ backgroundColor: 'var(--panel)', color: 'var(--text)' }}>
        <div>
          <h2 className="text-xl font-bold tracking-tight">KejaLink Payments</h2>
          <p className="text-xs text-gray-400">
            Role:{' '}
            <span className="text-amber-400 font-bold uppercase">{currentRole}</span>
          </p>
        </div>
        <div className="text-xs text-gray-300">
          {currentRole === 'Landlord'
            ? 'Verify tenant payments'
            : 'Log payments for verification'}
        </div>
      </div>

      {/* Inline message display for form feedback */}
      {feedbackMessage && (
        <div className={`p-4 rounded-lg border ${
          feedbackMessage.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          {feedbackMessage.type === 'error' ? '❌' : '✅'} {feedbackMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left panel */}
        <div>
          {currentRole === 'Tenant' ? (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Log Rent / Utilities</h3>
              <p className="text-xs text-gray-400 mb-4">
                Provide your transaction code after paying via M-PESA Till/Paybill.
              </p>

              <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-xs font-semibold text-blue-800">Logging Payment For</div>
                <div className="text-sm font-bold text-blue-900">
                  {user?.fullName ? user.fullName : '—'} - Unit {user?.houseNumber ? user.houseNumber : '—'}
                </div>
              </div>

              <form
                onSubmit={(e) => handleTenantSubmit(e, user)}
                className="space-y-4"
              >


                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Payment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Water">Water Bill</option>
                    <option value="Service Charge">Service Charge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    M-PESA Code
                  </label>
                  <input
                    type="text"
                    name="referenceCode"
                    value={formData.referenceCode}
                    onChange={handleChange}
                    placeholder="QRE789WUYX"
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all disabled:bg-blue-400"
                >
                  {loading ? 'Submitting...' : 'Send Payment for Verification'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between h-full min-h-[320px]">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Landlord Approvals Ledger
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Review transaction logs submitted by tenants below.
                </p>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-800">
                  <strong>Verification Guardrail:</strong> Approving a transaction locks the ledger item.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col items-center justify-start">
          {currentReceipt ? (
            <div className="w-full space-y-4">
              <ReceiptView receipt={currentReceipt} />
              <button
                onClick={() => setCurrentReceipt(null)}
                className="w-full py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Close Focus Window
              </button>
            </div>
          ) : (
            <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400 bg-gray-50 flex flex-col items-center justify-center min-h-[340px]">
              <p className="text-sm font-medium text-gray-500">No statement record highlighted</p>
              <p className="text-xs mt-0.5">Click “View” in the ledger to preview.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/70">
          <h3 className="font-bold text-gray-700 text-sm">
            Property Transaction Ledger Overview
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-100/50 text-gray-500 font-semibold text-xs border-b border-gray-100">
                <th className="p-3">Tenant / House</th>
                <th className="p-3">Details</th>
                <th className="p-3">M-PESA Reference</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3 text-center">Context Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {paymentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-gray-800">{item.tenantName}</div>
                    <div className="text-gray-400 text-[10px] font-mono">
                      Unit {item.houseNumber}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium text-gray-700">{item.type}</div>
                    <div className="text-gray-400 text-[10px]">{item.month}</div>
                  </td>

                  <td className="p-3 font-mono font-bold tracking-wider text-gray-600 uppercase">
                    {item.referenceCode}
                  </td>

                  <td className="p-3 font-bold text-gray-900">
                    KES {Number(item.amount || 0).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        item.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Declined'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentReceipt(item)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded border font-medium"
                      >
                        View
                      </button>

                      {currentRole === 'Landlord' &&
                        item.status === 'Pending Verification' && (
                          <>
                            <button
                              onClick={() => handleVerifyStatus(item.id, 'Verified')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition-colors shadow-sm"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerifyStatus(item.id, 'Declined')}
                              className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 rounded border border-red-200 font-bold transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {paymentHistory.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No payments in ledger yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaymentDashboard

