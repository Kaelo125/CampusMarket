import { Link } from 'react-router-dom'
import { useStore, fmt } from '../store.jsx'
export default function Cart() {
  const { cart, setQty, remove, subtotal, count } = useStore()
  if (!cart.length) return <div className="py-20 text-center"><p className="mb-4">Your cart is empty.</p><Link to="/shop" className="btn-green">Continue Shopping</Link></div>
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between"><h1 className="font-serif text-3xl">Your Cart ({count})</h1>
        <Link to="/shop" className="text-sm text-forest">Continue Shopping →</Link></div>
      <div className="divide-y divide-navy/10 rounded-xl bg-white p-4">
        {cart.map(it => (
          <div key={[it.id, it.size, it.color].join()} className="flex gap-4 py-4">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded bg-navy/5">{it.image_url && <img src={it.image_url} alt="" className="h-full w-full object-cover" />}</div>
            <div className="flex-1 text-sm">
              <div className="font-medium">{it.name}</div>
              <div className="text-navy/60">{[it.color, it.size].filter(Boolean).join(' · ')}</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded border border-navy/20">
                  <button className="px-2.5 py-1" onClick={() => setQty(it, it.qty - 1)}>−</button><span className="w-6 text-center">{it.qty}</span>
                  <button className="px-2.5 py-1" onClick={() => setQty(it, it.qty + 1)}>+</button></div>
                <button onClick={() => remove(it)} className="text-xs text-red-700 underline">Remove</button></div>
            </div>
            <div className="text-sm font-semibold">{fmt(it.price * it.qty)}</div>
          </div>))}
      </div>
      <div className="mt-4 rounded-xl bg-white p-4 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><b>{fmt(subtotal)}</b></div>
        <p className="mt-1 text-xs text-navy/60">Delivery fee and any coupon are confirmed when you place the order.</p>
        <Link to="/checkout" className="btn-green mt-4 w-full">Proceed to Checkout →</Link>
      </div>
    </div>
  )
}
