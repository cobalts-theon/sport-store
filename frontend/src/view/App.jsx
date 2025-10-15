import { useState } from 'react'
import {Router, Routes, Route, Link} from "react-router-dom"
// import reactLogo from '/src/assets/icon/react.svg'
// import pslogo from '/src/assets/image/white-logo.png'

//Components
import Header from './components/navbar'
import Infbar from './components/infbar'
import Commercre from './components/commercre'

//Pages
import StartupLoader from './pages/start-intro'
import Slogan from './pages/slogan'
import Home from './pages/home'

function App() {
  return (
    <>
      <StartupLoader duration={2000}/> {/* Thời gian hiển thị logo khởi động */}
      <Commercre/>
      <Header/>
      <Routes> {/* Dùng Routes để định nghĩa các tuyến đường trong ứng dụng mà không cần load lại trang */} 
        <Route
         path="/" 
         element={ 
          <>
            <Home/>
            <Infbar/>
            <div className="slogan-page-container">
                <Slogan />
            </div>
          </>
          }/>
        {/* <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/services" element={<Services/>}/> */}
      </Routes>
      {/* <div className="pt-20">
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
      </div> */}
    </>
  )
}

export default App
