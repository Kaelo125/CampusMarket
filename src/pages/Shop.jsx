import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../store.jsx'
import Card from './Card.jsx'
export default function Shop() {
  const { products, loading } = useStore()
  const [sp, setSp] = useSearchParams()
  const [sort, setSort] = useState('new')
  const cat = sp.get('cat') || 'All', q = (sp.get('q') || '').toLowerCase()
  const cats = ['All', ...new Set(products.map(p => p.main_category).filter(Boolean))]
  let items = products.filter(p => (cat === 'All' || p.main_category === cat) && (!q || p.name.toLowerCase().includes(q)))
  if (sort === 'low') items = [...items].sort((a, b) => a.price - b.price)
  if (sort === 'high') items = [...items].sort((a, b) => b.price - a.price)
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-serif text-3xl">All Products</h1>
          <p className="text-sm text-navy/60">Premium fashion for every occasion.</p></div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="field w-auto">
          <option value="new">Sort: Newest</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option>
        </select>
      </div>
      <input className="field mb-4" placeholder="Search products" defaultValue={sp.get('q') || ''}
        onChange={e => { const n = new URLSearchParams(sp); e.target.value ? n.set('q', e.target.value) : n.delete('q'); setSp(n, { replace: true }) }} />
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {cats.map(c => <button key={c} onClick={() => { const n = new URLSearchParams(sp); c === 'All' ? n.delete('cat') : n.set('cat', c); setSp(n) }}
          className={'whitespace-nowrap rounded-md border px-4 py-2 text-sm ' + (cat === c ? 'border-forest bg-forest text-white' : 'border-navy/15 bg-white')}>{c}</button>)}
      </div>
      {loading ? <p>Loading…</p> : items.length === 0 ? <p className="py-10 text-center text-navy/60">No products found.</p> :
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items.map(p => <Card key={p.id} p={p} />)}</div>}
    </div>
  )
}
