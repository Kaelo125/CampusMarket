import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore, fmt, list } from '../store.jsx'
export default function Product() {
  const { id } = useParams(), nav = useNavigate()
  const { products, loading, add } = useStore()
  const p = products.find(x => String(x.id) === id)
  const [size, setSize] = useState(''), [color, setColor] = useState(''), [qty, setQty] = useState(1), [added, setAdded] = useState(false)
  if (loading) return <p>Loading…</p>
  if (!p) return <p className="py-20 text-center">Product not found. <Link className="underline" to="/shop">Back to shop</Link></p>
  const sizes = list(p.sizes), colors = list(p.color_options), out = Number(p.stock) <= 0
  const ready = (!sizes.length || size) && (!colors.length || color)
  const addIt = () => { add(p, size, color, qty); setAdded(true); setTimeout(() => setAdded(false), 1500) }
  const pill = on => 'rounded-md border px-4 py-2 text-sm ' + (on ? 'border-forest bg-forest text-white' : 'border-navy/20 bg-white')
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-navy/5">
        {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}</div>
      <div className="space-y-4">
        {p.badge && <span className="rounded bg-forest px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white">{String(p.badge).toUpperCase()}</span>}
        <h1 className="font-serif text-3xl">{p.name}</h1>
        <div className="text-xl font-semibold">{fmt(p.price)}
          {Number(p.original_price) > Number(p.price) && <span className="ml-2 text-sm font-normal text-navy/50 line-through">{fmt(p.original_price)}</span>}</div>
        {p.description && <p className="whitespace-pre-line text-sm leading-relaxed text-navy/80">{p.description}</p>}
        {colors.length > 0 && <div><div className="label">Colour{color && `: ${color}`}</div>
          <div className="flex flex-wrap gap-2">{colors.map(c => <button key={c} onClick={() => setColor(c)} className={pill(color === c)}>{c}</button>)}</div></div>}
        {sizes.length > 0 && <div><div className="label">Size</div>
          <div className="flex flex-wrap gap-2">{sizes.map(s => <button key={s} onClick={() => setSize(s)} className={pill(size === s)}>{s}</button>)}</div></div>}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border border-navy/20 bg-white">
            <button className="px-3 py-2" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button className="px-3 py-2" onClick={() => setQty(q => q + 1)}>+</button></div>
          <button disabled={out || !ready} onClick={addIt} className="btn-green flex-1">{out ? 'Sold out' : added ? 'Added ✓' : 'Add to Cart'}</button>
        </div>
        {!ready && !out && <p className="text-xs text-navy/60">Please choose {[sizes.length && !size && 'a size', colors.length && !color && 'a colour'].filter(Boolean).join(' and ')}.</p>}
        <button disabled={out || !ready} onClick={() => { add(p, size, color, qty); nav('/checkout') }} className="btn-line w-full">Buy Now</button>
      </div>
    </div>
  )
}
