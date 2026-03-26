import { useState } from 'react'
import './App.css'
import TopNav from '@/market/TopNav'
import IconNav from '@/market/IconNav'
import FilterSidebar from '@/market/FilterSidebar'
import MarketTable from '@/market/MarketTable'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <IconNav />
        <FilterSidebar />
        <MarketTable />
      </div>
    </div>
    <Toaster />
    </>
  )
}

export default App
