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
import ForgotPassword from './pages/forgot-password'
import About from './pages/about'
import ProductsPage from './pages/products-page'
import DiImage from './pages/di-image'
import PopularCategories from './pages/popular-categories'
import UserReview from './pages/userreview'
import ProductsView from './pages/products-view'
import Order from './pages/order'

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  
  //scroll to top when change page
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <StartupLoader duration={2000}/> 
      <Commercre/>
      <Header cartOpen={cartOpen} setCartOpen={setCartOpen}/>
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
            <DiImage/>
            <PopularCategories/>
            <div className="slogan-page-container">
              <Slogan />
            </div>
            <UserReview/>
          </>
          }/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/order" element={<Order/>}/>
        <Route path="/product/:id" element={<ProductsView openCart={() => setCartOpen(true)}/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

function App() {
  return <AppContent />
}

export default App