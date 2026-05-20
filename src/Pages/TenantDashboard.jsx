/**
 * Tenant Dashboard
 * 
 * Home page for tenant users. Shows:
 * - Quick action cards (Pay Rent, Report Issue)
 * - Community notices from landlord
 * - Maintenance request form
 * - History of submitted maintenance tickets
 * 
 * Key Features:
 * 1. Service cards link to PaymentDashboard and ReportIssue page
 * 2. Notices display any announcements from the landlord
 * 3. Maintenance form allows tenants to report issues with priority levels
 * 4. Ticket table shows current and past maintenance requests
 * 
 * Data sources:
 * - Redux notices state: community announcements
 * - Redux maintenance state: user's maintenance tickets
 */

import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addTicket } from '../Features/MaintenanceSlice'
import ServiceCard from '../Components/ServiceCard'
import NoticeCard from '../Components/Noticecard'

function TenantDashboard() {
  const dispatch = useDispatch()

  // Redux: Fetch maintenance tickets and notices from global state
  const { tickets } = useSelector((state) => state.maintenance)
  const { notices } = useSelector((state) => state.notices)

  // Feature cards data - memoized to prevent re-rendering on every render
  // These are static items that describe available tenant features
  const features = useMemo(
    () => [
      {
        icon: '',
        title: 'Pay Rent',
        description:
          'Make safe, instant rent payments via M-pesa and generate your digital receipt automatically.',
        badgeText: 'Payments',
      },
      {
        icon: '',
        title: 'Report an Issue',
        description:
          'Is something broken? Snap a picture and open a maintenance ticket for the caretaker immediately.',
        badgeText: 'Maintenance',
      },
    ],
    []
  )

  // Local form state for submitting maintenance requests
  const [unit, setUnit] = useState('')           // Which unit has the issue
  const [description, setDescription] = useState('') // Detailed description of problem
  const [priority, setPriority] = useState('Medium') // How urgent is this issue

  // Handle form submission when tenant submits a maintenance request
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate that all required fields are filled
    if (!unit.trim() || !description.trim()) {
      alert('Please fill out all required fields')
      return
    }

    // Create a new maintenance ticket object
    const newTicket = {
      id: Date.now().toString(),        // Unique ID based on current timestamp
      unit: unit.trim(),
      description: description.trim(),
      priority,
      status: 'Pending',                // Landlord will update this to 'In Progress' or 'Resolved'
    }

    // Add to Redux state so it appears immediately in the table below
    dispatch(addTicket(newTicket))

    // Clear form fields for next submission
    setUnit('')
    setDescription('')
    setPriority('Medium')
  }

  return (
    <>
      {/* Page header section */}
      <div>
        <h1>KejaLink Tenant Portal</h1>
        <p>File new maintenance requests and track your current status</p>
      </div>

      {/* Quick action cards - allows tenant to navigate to main features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {/* Render ServiceCard component for each feature (Pay Rent, Report Issue) */}
        {features.map((item, index) => (
          <ServiceCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            badgeText={item.badgeText}
            onCardClick={() => console.log(`Opening ${item.title}...`)}
          />
        ))}
      </div>

      {/* Community notices section - displays all landlord announcements */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Active Notices</h2>
      <div className="max-w-2xl mb-10">
        {/* Show notices if any exist, otherwise show "no notices" message */}
        {notices?.length ? (
          notices.map((notice, index) => (
            <NoticeCard
              key={notice.id ?? index}
              title={notice.title}
              message={notice.message}
              date={notice.date}
              category={notice.category}
              importance={notice.importance}
            />
          ))
        ) : (
          <div className="text-slate-600">No active notices.</div>
        )}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Submit a Maintenance request</h2>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="unitInput" className="block text-sm font-medium text-slate-700">
              Unit / Apartment Number:
            </label>
            <input
              id="unitInput"
              type="text"
              placeholder="e.g Hse 4B, 2G 4D - Seer Green Milimani"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 p-2"
            />
          </div>

          <div>
            <label htmlFor="descInput" className="block text-sm font-medium text-slate-700">
              Issue Description
            </label>
            <textarea
              id="descInput"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 p-2"
            />
          </div>

          <div>
            <label htmlFor="prioritySelect" className="block text-sm font-medium text-slate-700">
              Priority Level:
            </label>
            <select
              id="prioritySelect"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 p-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
            Submit Request
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

export default TenantDashboard

