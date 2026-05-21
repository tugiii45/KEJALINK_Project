/**
 * Notice Card Component
 * 
 * Displays a single community notice/announcement from landlord.
 * Used on TenantDashboard in the "Active Notices" section.
 * 
 * Props:
 * - title: Notice headline
 * - message: Full notice content
 * - date: When notice was posted
 * - category: Type of notice (Utility, Maintenance, Policy, etc.)
 * - importance: 'high' or other (determines color scheme)
 * 
 
 */

import React from 'react'

function NoticeCard({ title, message, date, category, importance }) {
  // Determine if this is an urgent notice (high importance = urgent)
  const isUrgent = importance === 'high'

  return (
    <>
    <div className={`p-5 rounded-xl border border-slate-200 shadow-sm bg-white mb-4 transition-all duration-200 hover:shadow-md ${
      // Apply red styling for urgent notices, blue for normal ones
      isUrgent ? 'border-l-4 border-l-red-500 bg-red-50/50' : 'border-l-4 border-l-blue-500'
    }`}
    style={{
      // Use CSS variables for theme support, but keep red tint for urgent
      backgroundColor: isUrgent ? 'rgba(220, 38, 38, 0.1)' : 'var(--panel)',
      borderColor: 'var(--border)',
      color: 'var(--text)'
    }}>
      <div className="flex justify-between items-center mb-2.5">
        {/* Category badge in top left */}
        <span className="text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--muted)'
        }}>
          {category}
        </span>
        {/* Post date in top right */}
        <span className="text-xs text-slate-400 font-medium" style={{ color: 'var(--muted)' }}>
          {date}
        </span>
      </div>

       {/* Notice title - red for urgent, normal text color otherwise */}
       <h3 className={`text-lg font-bold mb-1.5 ${isUrgent ? 'text-red-700' : 'text-slate-800'}`}
       style={{ color: isUrgent ? '#fca5a5' : 'var(--text)' }}>
        {title}
      </h3>
      
      {/* Notice message content */}
      <p className="text-sm leading-relaxed text-slate-600" style={{ color: 'var(--muted)' }}>
        {message}
      </p>
    </div>
    </>
  )
}

export default NoticeCard