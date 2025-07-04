'use client'

import { useState, useEffect } from 'react'

type Theme = 'light'

export function useTheme() {
  const [theme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.remove('dark')
  }, [])

  return { theme, mounted }
} 