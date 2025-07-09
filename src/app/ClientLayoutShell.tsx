"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import SidebarNav from './SidebarNav'
import Navbar from './Navbar'
import { useThemeContext } from './ThemeContext'

// SidebarMode context
export type SidebarMode = 'expanded' | 'collapsed' | 'hover';
const SidebarModeContext = createContext<{
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
}>({ mode: 'expanded', setMode: () => {} });

export function useSidebarMode() {
  return useContext(SidebarModeContext);
}

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, mounted } = useThemeContext()
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('expanded');

  useEffect(() => {
    const checkAuth = () => {
      const path = window.location.pathname
      const isAuthRoute = path === '/prijava' || path === '/registracija'
      
      if (isAuthRoute) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const prijavaUspesna = urlParams.get('prijava') === 'uspesna'
      if (prijavaUspesna) {
        setIsAuthenticated(true)
        setIsLoading(false)
        window.history.replaceState({}, '', '/')
        return
      }

      fetch('/api/profil', { credentials: 'include' })
        .then(res => {
          if (res.ok) {
            setIsAuthenticated(true)
          } else if (res.status === 401) {
            window.location.replace('/prijava')
          } else {
            setIsAuthenticated(true)
          }
        })
        .catch(() => {
          setIsAuthenticated(true)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    const timeoutId = setTimeout(checkAuth, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  // Event listener za hamburger dugme na mobilnim uređajima
  useEffect(() => {
    const handleOpenSidebar = () => {
      setSidebarOpen(true)
    }

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('aside')
      if (sidebar && !sidebar.contains(event.target as Node) && sidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
        setHovering(false)
      } else if (window.innerWidth < 640) {
        setSidebarOpen(false)
        setHovering(false)
      }
    }

    window.addEventListener('openSidebar', handleOpenSidebar)
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('openSidebar', handleOpenSidebar)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [sidebarOpen])

  if (!mounted || isLoading) {
    return null
  }

  let isAuthRoute = false
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    isAuthRoute = path === '/prijava' || path === '/registracija'
  }

  if (isAuthRoute) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[var(--main-bg)]">{children}</div>
  }

  if (!isAuthenticated) {
    return null
  }

  // Sidebar je otvoren ako je kliknuto ili ako je hoverovan dok je zatvoren
  let isSidebarOpen = false;
  if (sidebarMode === 'expanded') {
    isSidebarOpen = true;
  } else if (sidebarMode === 'collapsed') {
    isSidebarOpen = false;
  } else if (sidebarMode === 'hover') {
    isSidebarOpen = hovering || sidebarOpen;
  }

  return (
    <SidebarModeContext.Provider value={{ mode: sidebarMode, setMode: setSidebarMode }}>
      <div key={theme} className="h-screen w-full flex flex-col bg-[var(--main-bg)] overflow-x-hidden transition-all duration-300">
        {/* Navbar skroz gore */}
        <Navbar />
        {/* Flex kontejner za sidebar i main content */}
        <div className="flex flex-1 min-h-0 overflow-x-hidden">
          {/* Sidebar */}
          <aside
            className={`group sticky top-0 h-[calc(100vh-48px)] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 z-20 ${isSidebarOpen ? 'w-64' : 'w-12'} px-2 py-4 overflow-y-auto custom-scrollbar pr-3 overflow-x-hidden lg:block hidden sm:flex sm:relative ${sidebarOpen ? 'sm:fixed sm:left-0 sm:top-12' : ''}`}
            style={{ transitionProperty: 'width,background-color,border-color' }}
            onMouseEnter={() => { if (sidebarMode === 'hover' && !sidebarOpen && window.innerWidth >= 1024) setHovering(true) }}
            onMouseLeave={() => { if (sidebarMode === 'hover' && !sidebarOpen && window.innerWidth >= 1024) setHovering(false) }}
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
          {/* Overlay za mobilne uređaje */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 bg-[var(--main-bg)] min-h-0 transition-all duration-300 overflow-x-hidden w-full">{children}</main>
        </div>
      </div>
    </SidebarModeContext.Provider>
  )
} 