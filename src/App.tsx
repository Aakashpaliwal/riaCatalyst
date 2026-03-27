import { useState, useEffect } from 'react'
import './App.css'
import TopNav from '@/market/TopNav'
import IconNav from '@/market/IconNav'
import FilterSidebar from '@/market/FilterSidebar'
import MarketTable from '@/market/MarketTable'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  return (
    <>
  <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <IconNav isDark={isDark} onToggleTheme={toggleTheme} />
        <FilterSidebar />
        <MarketTable />
      </div>
    </div>
    <Toaster theme={isDark ? 'dark' : 'light'} />
    </>
  )
}

export default App
