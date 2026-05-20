/**
 * Landlord Dashboard
 * 
 * Home page for landlord/property owner users. Shows:
 * - Quick link to verify tenant payments
 * - Statistics: Active issues, Pending tickets, Resolved tickets
 * - Maintenance ticket queue with status transition buttons
 * - Notice broadcast form (for posting community announcements)
 * 
 * Key Features:
 * 1. Status transitions: Pending → In Progress → Resolved (one-way flow)
 * 2. Post notices to all tenants
 * 3. View all maintenance tickets from all units
 * 4. Quick access to payment verification dashboard
 * 
 * Data sources:
 * - Redux maintenance state: all tenant tickets
 * - Redux notices state: all posted notices
 */

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateTicketStatus } from '../Features/MaintenanceSlice'
import { addNotice } from '../Features/NoticeSlice'

function LandlordDashboard() {
  const dispatch = useDispatch()

  // Fetch maintenance tickets from Redux state
  const { tickets } = useSelector((state) => state.maintenance)

  // Calculate key statistics for the dashboard header
  // Count total active (unresolved) tickets
  const totalActive = tickets.filter((t) => t.status !== 'Resolved').length
  // Count tickets still in Pending status
  const pendingCount = tickets.filter((t) => t.status === 'Pending').length
  // Count tickets already resolved
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length

  // Form state for posting new notices to tenants
  const [title, setTitle] = useState('')          // Notice headline
  const [message, setMessage] = useState('')      // Full notice content
  const [category, setCategory] = useState('')    // Type of notice (Utility, Maintenance, etc)
  const [importance, setImportance] = useState('') // Priority level
  const [isPinned, setIsPinned] = useState(false) // Pin to top flag

  const handlePostNotice = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!title.trim() || !message.trim()) {
      alert('Please fill out all required fields')
      return
    }

    // Create new notice object with metadata
    const newNotice = {
      id: Date.now(),                     // Unique timestamp ID
      title: title.trim(),                // Notice title text
      message: message.trim(),            // Full notice content
      category: category.trim(),          // Category type
      importance,                         // Priority level
      isPinned,                           // Whether pinned to top
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),                                 // Formatted date stamp
    }

    // Add notice to Redux store to broadcast to all tenants
    dispatch(addNotice(newNotice))

    setTitle('')
    setMessage('')
    setCategory('')
    setImportance('')
    setIsPinned(false)

    alert('Notice posted successfully')
  }

  const handleStatusTransition = (ticketId, currentStatus) => {
    let nextStatus = 'Pending'
    if (currentStatus === 'Pending') nextStatus = 'In Progress'
    else if (currentStatus === 'In Progress') nextStatus = 'Resolved'
    else return

    dispatch(updateTicketStatus({ id: ticketId, status: nextStatus }))
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Quick navigation for landlord to verify payments */}
        <div className="mb-4">
          <a
            href="/payment-dashboard"
            className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            Verify Payments
          </a>
        </div>
        {/* Overview */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            KejaLink Landlord Hub
          </h1>
          <p className="text-slate-600 mt-1">
            Manage maintenance requests and broadcast community notices.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Issues
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {totalActive}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Review
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {pendingCount}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resolved This Month
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {resolvedCount}
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">
              Incoming Maintenance Tickets
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Update ticket status to keep tenants informed.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Unit / Property
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Issue Description
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Priority
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-slate-600"
                    >
                      No maintenance tickets submitted yet
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-t border-slate-200 hover:bg-slate-50"
                    >
                      <td className="p-3 text-sm text-slate-700">
                        {ticket.unit}
                      </td>
                      <td className="p-3 text-sm text-slate-700 max-w-md">
                        {ticket.description}
                      </td>
                      <td className="p-3 text-sm font-semibold text-slate-800">
                        {ticket.priority}
                      </td>
                      <td className="p-3 text-sm">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        {ticket.status !== 'Resolved' ? (
                          <button
                            onClick={() =>
                              handleStatusTransition(ticket.id, ticket.status)
                            }
                            className="rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1.5 transition-colors disabled:opacity-60"
                          >
                            {ticket.status === 'Pending'
                              ? 'Accept Request'
                              : 'Mark as fixed'}
                          </button>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice form */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div />

          <div className="p-6 max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Broadcast Community Notice
            </h2>
            <form onSubmit={handlePostNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Elevator Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Write details here..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Electricity"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Importance
                </label>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">
                    Pin Notice to Top
                  </span>
                  <span className="text-xs text-slate-400">
                    This will place this notice at the very top of the tenant
                    feed.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-5 h-5 accent-green-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
              >
                Publish Notice
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandlordDashboard

