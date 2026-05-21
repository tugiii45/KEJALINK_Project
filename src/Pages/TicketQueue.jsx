/**
 * Ticket Queue Page (for Landlords)
 * 
 * Centralized view of ALL maintenance tickets across the property.
 * Allows filtering by status and priority to focus on important issues.
 * 
 * Features:
 * - Status filter: All / Pending / In Progress / Resolved
 * - Priority filter: All / High / Medium / Low
 * - Table shows: ID, Unit, Description, Priority, Status
 * - Real-time count of matching tickets
 * 
 * Uses:
 * - Redux maintenance.tickets for data source
 * - useMemo to efficiently filter without re-rendering unnecessarily
 * 
 * To update status, landlord goes to LandlordDashboard and clicks status buttons
 */

import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

function TicketQueue() {
  const { tickets } = useSelector((state) => state.maintenance)

  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === 'All' || ticket.status === statusFilter

      const matchesPriority =
        priorityFilter === 'All' || ticket.priority === priorityFilter

      return matchesStatus && matchesPriority
    })
  }, [tickets, statusFilter, priorityFilter])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Central Ticket Queue
          </h1>
          <p className="text-slate-600 mt-1">
            Review, filter and monitor all property maintenance tasks in real
            time.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Filter Controls
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="statusFilterSelect"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="statusFilterSelect"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priorityFilterSelect"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Filter by Priority
              </label>
              <select
                id="priorityFilterSelect"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">
              Active Backlog ({filteredTickets.length} tickets found)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    ID
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Unit
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Description
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Priority
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-600 p-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-slate-600"
                    >
                      No tickets match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-t border-slate-200 hover:bg-slate-50"
                    >
                      <td className="p-3 text-sm text-slate-700">
                        #{String(ticket.id).slice(-4)}
                      </td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketQueue

