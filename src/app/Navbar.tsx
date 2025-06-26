import React from 'react'
import { useTheme } from './useTheme'
import Image from 'next/image'

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Emituje custom event za otvaranje sidebar-a na mobilnom
  function handleSidebarToggle() {
    const event = new CustomEvent('openSidebar', { bubbles: true })
    window.dispatchEvent(event)
  }

  return (
    <header className="sticky top-0 z-30 h-12 bg-[var(--navbar-bg)] border-b border-[var(--border-color)] flex items-center px-2 sm:px-4 justify-between w-full shadow-sm transition-all duration-300">
      {/* Leva strana: logo i naziv */}
      <div className="flex items-center gap-2 select-none">
        <Image src="/ikonice/human-resources.svg" alt="HR Platforma" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" priority />
        <span className="hidden sm:inline font-extrabold text-base sm:text-lg tracking-wide text-white" style={{fontFamily: 'InterVariable, sans-serif', letterSpacing: '0.04em'}}>HR Platforma</span>
      </div>
      {/* Sredina: search input, samo na lg+ */}
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Pretraži sve..."
            className="w-full px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-gray-600/50 text-[#3A3CA6] dark:text-white placeholder:text-[#3A3CA6]/60 dark:placeholder:text-gray-400 font-medium shadow-sm text-sm transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-[#3A3CA6]/60 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Desna strana: ikone i profil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button - prelepo dugme */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none focus:ring-2 focus:ring-white/20 text-white relative overflow-hidden group"
            aria-label={theme === 'light' ? 'Prebaci na tamnu temu' : 'Prebaci na svetlu temu'}
          >
            {/* Pozadinska animacija */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            {/* Sun ikonica za svetlu temu */}
            <svg 
              className={`w-5 h-5 transition-all duration-500 ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            
            {/* Moon ikonica za tamnu temu */}
            <svg 
              className={`absolute w-5 h-5 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            
            {/* Glow efekat */}
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${theme === 'light' ? 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'shadow-[0_0_20px_rgba(99,102,241,0.3)]'}`}></div>
          </button>
        )}
        
        {/* Hamburger dugme za mobilne */}
        <button
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none lg:hidden text-white transition-colors duration-200"
          aria-label="Otvori meni"
          onClick={handleSidebarToggle}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Notifikacije, samo na md+ */}
        <button className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--navbar-hover)] focus:outline-none transition-colors duration-200">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        {/* Profil ikonica uvek vidljiva */}
        <span className="w-9 h-9 bg-white/70 dark:bg-gray-700/70 rounded-full flex items-center justify-center font-bold text-[#3A3CA6] dark:text-white text-sm shadow-sm select-none ml-1 transition-all duration-300">AA</span>
      </div>
    </header>
  )
} 