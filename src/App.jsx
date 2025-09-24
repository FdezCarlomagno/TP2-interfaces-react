import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header/Header'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Header/>
     <Dashboard />
     <div className='appBody'>
        <h1>GAMEHUB.COM</h1>
        <p className='subtitleMain'>Todos tus juegos favoritos están acá</p>
      </div>
    </>
  )
}

export default App
