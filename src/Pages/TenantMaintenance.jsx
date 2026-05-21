/**
 * Tenant Maintenance Page
 *
 * Dedicated page for tenants to:
 * - Submit a maintenance request
 * - View their maintenance ticket history
 */

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addTicket } from '../Features/MaintenanceSlice'

function TenantMaintenance() {
  const dispatch = useDispatch()

  // Redux: Fetch maintenance tickets from global state
  const { tickets } = useSelector((state) => state.maintenance)

  // Local form state for submitting maintenance requests
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  
  // Inline message state for form validation feedback
  const [message, setMessage] = useState(null)   // { type: 'error'|'success', text: string }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!unit.trim() || !description.trim()) {
      setMessage({ type: 'error', text: 'Please fill out all required fields' })
      return
    }

    const newTicket = {
      id: Date.now().toString(),
      unit: unit.trim(),
      description: description.trim(),
      priority,
      status: 'Pending',
    }

    dispatch(addTicket(newTicket))

    setUnit('')
    setDescription('')
    setPriority('Medium')
    // Show success message and auto-clear after 3 seconds
    setMessage({ type: 'success', text: 'Maintenance request submitted successfully!' })
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Maintenance Requests</h1>
        <p className="text-slate-600 mt-2">Submit issues and track your ticket status</p>
      </div>

      {/* Inline message display for form feedback */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
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
            className="rounded bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Submit Maintenance Request
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 mt-10">Your Maintenance History</h2>

      <div>
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
                  <td className="border border-slate-200 p-2">{ticket.description}</td>
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

