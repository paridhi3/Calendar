'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const isDark = saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const newVal = !dark
    setDark(newVal)
    document.documentElement.classList.toggle('dark', newVal)
    localStorage.setItem('theme', newVal ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} className="px-3 py-1 rounded-md border">
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
