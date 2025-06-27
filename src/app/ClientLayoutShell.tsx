"use client"

import { useState } from 'react'
import SidebarNav from './SidebarNav'
import Navbar from './Navbar'
import { useThemeContext } from './ThemeContext'

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const { theme, mounted } = useThemeContext()

  if (!mounted) return null

  // Proveri da li je auth ruta
  let isAuthRoute = false
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    isAuthRoute = path === '/prijava' || path === '/registracija'
  }

  if (isAuthRoute) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[var(--main-bg)]">{children}</div>
  }

  // Sidebar je otvoren ako je kliknuto ili ako je hoverovan dok je zatvoren
  const isSidebarOpen = sidebarOpen || hovering

  return (
    <div key={theme} className="h-screen w-full flex flex-col bg-[var(--main-bg)] overflow-x-hidden transition-all duration-300">
      {/* Navbar skroz gore */}
      <Navbar />
      {/* Flex kontejner za sidebar i main content */}
      <div className="flex flex-1 min-h-0 overflow-x-hidden">
        {/* Sidebar */}
        <aside
          className={`group sticky top-0 h-[calc(100vh-64px)] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 z-20 ${isSidebarOpen ? 'w-64' : 'w-12'} px-2 py-4 overflow-y-auto custom-scrollbar pr-3 overflow-x-hidden`}
          style={{ transitionProperty: 'width,background-color,border-color' }}
          onMouseEnter={() => { if (!sidebarOpen) setHovering(true) }}
          onMouseLeave={() => { if (!sidebarOpen) setHovering(false) }}
        >
          {/* Dugme za zatvaranje - prikazuje se samo kada je sidebar otvoren klikom */}
          {sidebarOpen && (
            <button
              className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[var(--border-color)] text-[var(--text-secondary)] rounded-full shadow border border-[var(--border-color)] transition-colors duration-200 z-30 hover:bg-[#3A3CA6] hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Zatvori meni"
              style={{ boxShadow: '0 2px 8px 0 rgba(58,60,166,0.10)' }}
            >
              <span className="text-xl">«</span>
            </button>
          )}
          {/* Sidebar sadržaj */}
          <div className="flex-1 flex flex-col items-center">
            <SidebarNav sidebarOpen={isSidebarOpen} />
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 bg-[var(--main-bg)] min-h-0 transition-all duration-300">{children}</main>
      </div>
    </div>
  )
} 