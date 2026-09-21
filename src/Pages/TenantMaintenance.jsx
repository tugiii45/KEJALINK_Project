/**
 * Tenant Maintenance Page
 *
 * Dedicated page for tenants to:
 * - Submit a maintenance request (saved to Firestore 'maintenance' collection)
 * - View their own maintenance ticket history (live, via onSnapshot)
 *
 * Firestore rules require every ticket to carry tenantUid, and tenants may
 * only query tickets where tenantUid == their own uid.
 */

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../firebase'
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'

function TenantMaintenance() {
  const { user } = useSelector((state) => state.auth)

  // Tickets come straight from Firestore (only this tenant's tickets)
  const [tickets, setTickets] = useState([])

  // Local form state for submitting maintenance requests
  const [unit, setUnit] = useState(user?.houseNumber ?? '')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [submitting, setSubmitting] = useState(false)

  // Inline message state for form feedback
  const [message, setMessage] = useState(null) // { type: 'error'|'success', text: string }

  // Live listener: only this tenant's tickets (required by the security rules)
  useEffect(() => {
    if (!user?.uid) return

    const q = query(collection(db, 'maintenance'), where('tenantUid', '==', user.uid))

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        // Newest first. createdAt is null briefly while the server timestamp resolves.
        list.sort((a, b) => (b.createdAt?.toMillis?.() ?? Infinity) - (a.createdAt?.toMillis?.() ?? Infinity))
        setTickets(list)
      },
      (err) => {
        console.error('[TenantMaintenance] snapshot error:', err)
        setMessage({ type: 'error', text: 'Could not load your maintenance requests.' })
      }
    )

    return () => unsub()
  }, [user?.uid])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!unit.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Please fill out all required fields' })
      return
    }

    if (!user?.uid) {
      setMessage({ type: 'error', text: 'You are not signed in. Please log in again.' })
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'maintenance'), {
        tenantUid: user.uid,
        tenantName: user.fullName ?? '',
        unit: unit.trim(),
        description: description.trim(),
        priority,
        status: 'Pending',
        createdAt: serverTimestamp(),
      })

      setUnit(user?.houseNumber ?? '')
      setDescription('')
      setPriority('Medium')
      setMessage({ type: 'success', text: 'Maintenance request submitted successfully!' })
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to submit request. Please try again.' })
    } finally {
      setSubmitting(false)
      // Auto-clear the message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Maintenance Requests</h1>
        <p className="text-slate-600 mt-2">Submit issues and track your ticket status</p>
      </div>

      {/* Inline message display for form feedback */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-green-50 border-green-200 text-green-800'
          }`}
        >
          {message.type === 'error' ? '❌' : '✅'} {message.text}
        </div>
      )}

      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Submit a Maintenance request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Unit</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., A-1, Seer Green Milimani Hse no:4B"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={5}
              placeholder="Describe exactly what needs to be fixed or inspected."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Maintenance Request'}
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 mt-10">Your Maintenance History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 p-2 text-left">Unit</th>
              <th className="border border-slate-200 p-2 text-left">Description</th>
              <th className="border border-slate-200 p-2 text-left">Priority</th>
              <th className="border border-slate-200 p-2 text-left">Current Status</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td className="border border-slate-200 p-2" colSpan={4}>
                  You haven't submitted any requests yet
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="border border-slate-200 p-2">{ticket.unit}</td>
                  <td className="border border-slate-200 p-2">
                    {ticket.title && <div className="font-semibold">{ticket.title}</div>}
                    {ticket.description}
                  </td>
                  <td className="border border-slate-200 p-2">{ticket.priority}</td>
                  <td className="border border-slate-200 p-2">
                    <strong>{ticket.status}</strong>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TenantMaintenance