import { useState, useEffect } from 'react'
import {Router, Routes, Route, Link, useLocation} from "react-router-dom"

//Components
import Header from './components/navbar'
import Infbar from './components/infbar'
import Commercre from './components/commercre'
import Footer from './components/footer'

//Pages
import StartupLoader from './pages/start-intro'
import Slogan from './pages/slogan'
import Home from './pages/home'
import HomeProduct from './pages/home-product'
import Review from './pages/review'
import Flex from './pages/product-flex'
import Login from './pages/login'
import Signup from './pages/signup'
import About from './pages/about'

function AppContent() {
  //scroll to top when change page
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <StartupLoader duration={2000}/> 
      <Commercre/>
      <Header/>
      <Routes>
        <Route
         path="/" 
         element={ 
          <>
            <Home/>
            <Flex/>
            <Review/>
            <Infbar/>
            <HomeProduct/>
            <div className="slogan-page-container">
              <Slogan />
            </div>
          </>
          }/>
        <Route path="/products" element={<HomeProduct/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

function App() {
  return <AppContent />
}

export default App