import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Track from './pages/Track.jsx'

function Header() {
  const { count } = useStore()
  const link = ({ isActive }) => 'px-2 py-1 text-sm ' + (isActive ? 'text-gold' : 'text-white/90 hover:text-white')
  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-mark.png" alt="" className="h-9 w-9 rounded-full" />
          <span className="leading-none"><span className="block font-serif text-xl">Kaelo</span>
            <span className="text-[9px] tracking-[.25em] text-white/70">FASHION ATELIER</span></span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/shop" className={link}>Shop</NavLink>
          <NavLink to="/track" className={link}>Track</NavLink>
          <Link to="/cart" className="relative ml-1 rounded-full border border-white/30 px-3 py-1 text-sm">
            Cart{count > 0 && <span className="ml-1.5 rounded-full bg-forest px-1.5 text-xs">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 bg-navy text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div><div className="font-serif text-lg text-white">Kaelo Fashion Atelier</div>
          <div>Based in Uganda · Nationwide delivery</div></div>
        <div className="text-gold">Style / Quality / Confidence</div>
        <div className="text-xs">© {new Date().getFullYear()} Kaelo Fashion Atelier. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<Track />} />
          <Route path="*" element={<p className="py-20 text-center">Page not found. <Link className="underline" to="/">Go home</Link></p>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
