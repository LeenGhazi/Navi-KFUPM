import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import BusRoutesPage from "./Pages/BusRoutesPage";

function App() {
 const [count, setCount] = useState(0)

  return ( 
    <div>
      <BusRoutesPage />
    </div>
  )
}

export default App

