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

import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import ServiceCard from '../Components/ServiceCard'
import NoticeCard from '../Components/NoticeCard'

function TenantDashboard() {
  const navigate = useNavigate()

  // Redux: Fetch notices from global state
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

  // Tenant requests are submitted from the dedicated maintenance page, not this overview.

  return (
    <>
      {/* Page header section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">KejaLink Tenant Portal</h1>
        <p className="text-slate-600 mt-2">File new maintenance requests and track your current status</p>
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
            onCardClick={() => {
              if (item.title === 'Pay Rent') {
                navigate('/payment-dashboard')
              } else if (item.title === 'Report an Issue') {
                navigate('/report-issue')
              }
            }}
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

      <h2 className="text-xl font-bold text-slate-800 mb-4">Maintenance</h2>
      <div>
        <p className="text-slate-600 mb-4">Submit new requests and view your ticket history in the dedicated page.</p>
        <button
          onClick={() => navigate('/maintenance')}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Go to Maintenance
        </button>
      </div>

    </>
  )
}

export default TenantDashboard

