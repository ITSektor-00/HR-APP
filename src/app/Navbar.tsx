import React from 'react'

export default function Navbar() {
  return (
    <header className="h-16 bg-[#3A3CA6] border-b flex items-center px-6 justify-between w-full">
      <div className="flex items-center gap-2 select-none">
        <img src="/ikonice/human-resources.svg" alt="HR Platforma" className="w-7 h-7" />
        <span className="font-extrabold text-lg tracking-wide text-white" style={{fontFamily: 'InterVariable, sans-serif', letterSpacing: '0.04em'}}>HR Platforma</span>
        <svg className="ml-2 w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Pretraži sve..."
            className="w-full px-4 py-2.5 rounded-lg bg-white/90 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-[#3A3CA6] placeholder:text-[#3A3CA6]/60 font-medium shadow-sm text-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-[#3A3CA6]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholderi za desni deo navbara */}
        <span className="w-6 h-6 bg-white/40 rounded" />
        <span className="w-6 h-6 bg-white/40 rounded" />
        <span className="w-6 h-6 bg-white/40 rounded" />
        <span className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center font-bold text-[#3A3CA6]">AA</span>
      </div>
    </header>
  )
} 