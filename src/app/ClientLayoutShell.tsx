"use client"

import { useState, useEffect } from 'react'
import SidebarNav from './SidebarNav'
import Navbar from './Navbar'
import { useThemeContext } from './ThemeContext'

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { mounted } = useThemeContext()

  useEffect(() => {
    const checkAuth = () => {
      const path = window.location.pathname
      const isAuthRoute = path === '/prijava' || path === '/registracija'
      const isPublicRoot = path === '/'
      
      if (isAuthRoute || isPublicRoot) {
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
  let isPublicRoot = false
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    isAuthRoute = path === '/prijava' || path === '/registracija'
    isPublicRoot = path === '/'
  }

  if (isAuthRoute || isPublicRoot) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[var(--main-bg)]">{children}</div>
  }

  if (!isAuthenticated) {
    return null
  }

  // Sidebar je otvoren ako je kliknuto ili ako je hoverovan dok je zatvoren
  const isSidebarOpen = sidebarOpen || hovering

  return (
    <div className="flex min-h-screen w-full bg-[var(--main-bg)]">
      <SidebarNav sidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full max-w-full mx-auto px-2 sm:px-6 md:px-8 py-4">
          {children}
        </main>
      </div>
    </div>
  )
} 