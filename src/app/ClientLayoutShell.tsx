'use client'

import { useState, useEffect } from 'react'
import SidebarNav from './SidebarNav'
import Navbar from './Navbar'

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Slušaj custom event za otvaranje sidebar-a iz SidebarNav
  useEffect(() => {
    function handleOpenSidebar() {
      setSidebarOpen(true)
    }
    window.addEventListener('openSidebar', handleOpenSidebar)
    return () => window.removeEventListener('openSidebar', handleOpenSidebar)
  }, [])

  return (
    <div className="h-screen w-full flex flex-col bg-[#f4f6fb] overflow-x-hidden">
      {/* Navbar skroz gore */}
      <Navbar />
      {/* Flex kontejner za sidebar i main content */}
      <div className="flex flex-1 min-h-0 overflow-x-hidden">
        {/* Sidebar */}
        <aside
          className={`group sticky top-0 h-[calc(100vh-64px)] bg-[#F3F4F6] border-r flex flex-col transition-all duration-300 z-20 ${sidebarOpen ? 'w-64' : 'w-12'} px-2 py-4 overflow-y-auto custom-scrollbar pr-3 overflow-x-hidden`}
          style={{ transitionProperty: 'width,background-color' }}
        >
          {/* Dugme za zatvaranje - prikazuje se samo na hover sidebar-a, sticky uz desnu ivicu, centrirano po visini */}
          {sidebarOpen && (
            <button
              className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[#e5e7eb] text-[#bfc4d6] rounded-full shadow border transition-colors duration-200 z-30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-[#3A3CA6] hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Zatvori meni"
              style={{ boxShadow: '0 2px 8px 0 rgba(58,60,166,0.10)' }}
            >
              <span className="text-xl">«</span>
            </button>
          )}
          {/* Sidebar sadržaj */}
          <div className="flex-1 flex flex-col items-center">
            <SidebarNav sidebarOpen={sidebarOpen} />
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 bg-[#f4f6fb] min-h-0">{children}</main>
      </div>
    </div>
  )
} 