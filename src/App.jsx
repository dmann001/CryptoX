import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import Footer from './components/Footer/Footer'
import { AnalyticsProvider } from './providers/AnalyticsProvider'
import { SpeedInsights } from "@vercel/speed-insights/react"
import CoinContextProvider from './context/CoinContext'

const App = () => {
  return (
    <AnalyticsProvider>
      <div className='app'>
        <CoinContextProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/coin/:coinId' element={<Coin/>}/>
          </Routes>
          <Footer />
          <SpeedInsights />
        </CoinContextProvider>
      </div>
    </AnalyticsProvider>
  )
}

export default App