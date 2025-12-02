import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
//Context
import { CartProvider } from './context/CartContext'
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
import Verify from './pages/verify-code'
import About from './pages/about'
import ProductsPage from './pages/products-page'
import DiImage from './pages/di-image'
import PopularCategories from './pages/popular-categories'
import UserReview from './pages/userreview'
import ProductsView from './pages/products-view'
import Order from './pages/order'
import CheckOut from './pages/checkout'
import Admin from './pages/admin'
import Profile from './pages/profile'

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  
  //scroll to top when change page
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Check if current route is admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            fontFamily: 'JetBrains Mono, sans-serif',
            clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
          },
          success: {
            style: {
              background: '#4BB543',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#4BB543',
            }
          },
          error: {
            style: {
              background: '#FF3333',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#FF3333',
            }
          }
        }}
      />
      <StartupLoader duration={2000}/> 
      {!isAdminPage && <Commercre/>}
      {!isAdminPage && <Header cartOpen={cartOpen} setCartOpen={setCartOpen}/>}
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
        <Route path="/verify-code" element={<Verify/>}/>
        <Route path="/order" element={<Order/>}/>
        <Route path="/checkout" element={<CheckOut/>}/>
        <Route path="/product/:id" element={<ProductsView openCart={() => setCartOpen(true)}/>}/>
        <Route path="/admin/*" element={<Admin/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      {!isAdminPage && <Footer/>}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App