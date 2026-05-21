/**
 * Service Card Component
 * 
 * Reusable card component for displaying features/services.
 * Used on TenantDashboard to show quick action cards.
 * 
 * Props:
 
 * - title: Feature name (e.g., "Pay Rent")
 * - description: Brief explanation of what this does
 * - badgeText: Small label (e.g., "Payments")
 * - onCardClick: Callback function when card is clicked
 * 
 * Styling:
 * - Hover effect with shadow and smooth animation
 * - Green action button area at bottom
 * - Badge positioned top-right
 */

import React from 'react'

function ServiceCard({icon, title, description, badgeText, onCardClick}) {
  return (
    <>
    {/* Main card container with hover effects */}
    <div onClick={onCardClick}
    className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full"
    style={{
      backgroundColor: 'var(--panel)',
      borderColor: 'var(--border)',
      color: 'var(--text)'
    }}>

      {/* Badge positioned top-right corner */}
      {badgeText && (
        <span className='absolute top-4 right-4 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full'
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--muted)'
        }}>{badgeText}</span>
      )}

      <div>
        {/* Icon area - green background circle */}
        <div className='inline-flex items-center w-12 h-12 rounded-xl bg-green-50 text-green-600 text-2xl'>{icon}</div>

        {/* Card title */}
        <h3 className='text-xl font-bold text-slate-500 mb-4 ' style={{ color: 'var(--text)' }}>{title}</h3>
        {/* Card description */}
        <p className='text-sm leading-relaxed text-slate-500 mb-4' style={{ color: 'var(--muted)' }}>{description}</p>

      </div>

      {/* Action text at bottom with hover animation */}
      <div className='flex items-centre text-sm font-semibold text-green-600 mt-auto'>
        <span>Explore feature</span>
        {/* Arrow that moves right on hover */}
        <span className='ml-1.5 transform group-hover:translate-x-1 transition-all duration-200'></span>
      </div>

    </div>
    </>
  )
}

export default ServiceCard