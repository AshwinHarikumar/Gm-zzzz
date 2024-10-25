import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ResponsiveAppBar from './AppBar'
import Sensor from './sensor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ResponsiveAppBar/>
      <Sensor/>
    </>
  )
}

export default App
