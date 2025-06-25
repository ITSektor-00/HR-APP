import React from 'react'

export default function Navbar() {
  // Emituje custom event za otvaranje sidebar-a na mobilnom
  function handleSidebarToggle() {
    const event = new CustomEvent('openSidebar', { bubbles: true })
    window.dispatchEvent(event)
  }

  return (
    <header className="sticky top-0 z-30 h-12 bg-[#3A3CA6] border-b flex items-center px-2 sm:px-4 justify-between w-full shadow-sm">
      {/* Leva strana: logo i naziv */}
      <div className="flex items-center gap-2 select-none">
        <img src="/ikonice/human-resources.svg" alt="HR Platforma" className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="hidden sm:inline font-extrabold text-base sm:text-lg tracking-wide text-white" style={{fontFamily: 'InterVariable, sans-serif', letterSpacing: '0.04em'}}>HR Platforma</span>
      </div>
      {/* Sredina: search input, samo na lg+ */}
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Pretraži sve..."
            className="w-full px-3 py-2 rounded-lg bg-white/90 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-[#3A3CA6] placeholder:text-[#3A3CA6]/60 font-medium shadow-sm text-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-[#3A3CA6]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Desna strana: ikone i profil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger dugme za mobilne */}
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2e308c] focus:outline-none lg:hidden text-white"
          aria-label="Otvori meni"
          onClick={handleSidebarToggle}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Notifikacije, samo na md+ */}
        <button className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#2e308c] focus:outline-none">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        {/* Profil ikonica uvek vidljiva */}
        <span className="w-9 h-9 bg-white/70 rounded-full flex items-center justify-center font-bold text-[#3A3CA6] text-sm shadow-sm select-none ml-1">AA</span>
      </div>
    </header>
  )
} 