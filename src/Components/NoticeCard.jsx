import React from 'react'

function NoticeCard({ title, message, date, category, importance }) {
  const isUrgent = importance === 'high'

  return (
    <>
    <div className={`p-5 rounded-xl border border-slate-200 shadow-sm bg-white mb-4 transition-all duration-200 hover:shadow-md ${
      isUrgent ? 'border-l-4 border-l-red-500 bg-red-50/50' : 'border-l-4 border-l-blue-500'
    }`}>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
          {category}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {date}
        </span>
      </div>

       <h3 className={`text-lg font-bold mb-1.5 ${isUrgent ? 'text-red-700' : 'text-slate-800'}`}>
        {title}
        
      </h3>
      
      <p className="text-sm leading-relaxed text-slate-600">
        {message}
      </p>
    </div>
    </>
  )
}

export default NoticeCard