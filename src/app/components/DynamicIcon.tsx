'use client'

import Image from 'next/image'
import { useThemeContext } from '../ThemeContext'
import { getIconPath } from '../utils/iconUtils'

interface DynamicIconProps {
  iconName: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function DynamicIcon({ 
  iconName, 
  alt, 
  width = 16, 
  height = 16, 
  className = "w-4 h-4",
  priority = false 
}: DynamicIconProps) {
  const { theme, mounted } = useThemeContext()

  if (!mounted) return null // Ne prikazuj ništa dok se tema ne učita

  const iconPath = `/ikonice/${iconName}.svg`;

  return (
    <Image 
      src={iconPath} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      priority={priority}
      key={iconName}
    />
  )
} 