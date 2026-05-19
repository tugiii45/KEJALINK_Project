import React from 'react'

function ServiceCard({icon, title, description, badgeText, onCardClick}) {

  
  


  return (
    <>
    <div onClick={onCardClick}
    className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full">

      {badgeText && (
        <span className='absolute top-4 right-4 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full'>{badgeText}</span>
      )}

      <div>
        <div className='inline-flex items-center w-12 h-12 rounded-xl bg-green-50 text-green-600 text-2xl'>{icon}</div>

        <h3 className='text-xl font-bold text-slate-500 mb-4 '>{title}</h3>
        <p className='text-sm leading-relaxed text-slate-500 mb-4'>{description}</p>

      </div>

      <div className='flex items-centre text-sm font-semibold text-green-600 mt-auto'>
        <span>Explore feature</span>
        <span className='ml-1.5 transform group-hover:translate-x-1 transition-all duration-200'></span>
      </div>

    </div>
    </>
  )
}

export default ServiceCard