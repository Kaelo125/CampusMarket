import { createContext, useContext, useEffect, useState } from 'react'
import { sb } from './supabase'
const Ctx = createContext()
export const useStore = () => useContext(Ctx)
export const fmt = n => 'UGX ' + Number(n || 0).toLocaleString()
export const list = v => Array.isArray(v) ? v : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : []
const key = i => [i.id, i.size, i.color].join('|')

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('kaelo_cart_v2')) || [] } catch { return [] } })
  useEffect(() => {
    sb.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])
  useEffect(() => { try { localStorage.setItem('kaelo_cart_v2', JSON.stringify(cart)) } catch {} }, [cart])
  const add = (p, size, color, qty = 1) => setCart(c => {
    const it = { id: p.id, name: p.name, price: p.price, image_url: p.image_url, size: size || null, color: color || null, qty }
    return c.find(x => key(x) === key(it)) ? c.map(x => key(x) === key(it) ? { ...x, qty: x.qty + qty } : x) : [...c, it]
  })
  const setQty = (it, q) => setCart(c => c.map(x => key(x) === key(it) ? { ...x, qty: Math.max(1, q) } : x))
  const remove = it => setCart(c => c.filter(x => key(x) !== key(it)))
  const value = {
    products, loading, cart, add, setQty, remove, clear: () => setCart([]),
    count: cart.reduce((s, i) => s + i.qty, 0),
    subtotal: cart.reduce((s, i) => s + i.price * i.qty, 0),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
