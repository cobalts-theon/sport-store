import { useState } from 'react'
import { BrowserRouter as Router, Routes, Link } from 'react-router-dom'
import reactLogo from '/src/assets/icon/react.svg'
import pslogo from '/src/assets/image/white-logo.png'
import StartupLoader from './components/StartupLoader'
import Header from './components/navbar'

//CSS
import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <StartupLoader duration={2000}/>
      <Header/>
      <div className="pt-20">
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={pslogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </Router>
  )
}

export default App
