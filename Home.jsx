import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Card from './Card.jsx'
export default function Home() {
  const { products, loading } = useStore()
  const withImg = products.filter(p => p.image_url)
  const hero = withImg[0]
  const cats = [...new Set(products.map(p => p.main_category).filter(Boolean))]
  const catImg = c => withImg.find(p => p.main_category === c)?.image_url
  return (
    <div className="space-y-12">
      <section className="grid overflow-hidden rounded-2xl bg-navy text-white md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
          <div className="text-xs tracking-[.3em] text-gold">ELEVATE YOUR EVERYDAY</div>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">Timeless Styles for Modern You</h1>
          <p className="max-w-md text-white/80">Premium fashion pieces designed for confidence, comfort and effortless elegance.</p>
          <Link to="/shop" className="btn-green w-fit">Shop Now →</Link>
        </div>
        <div className="aspect-[4/3] bg-white/5 md:aspect-auto">
          {hero && <img src={hero.image_url} alt={hero.name} className="h-full w-full object-cover" />}
        </div>
      </section>
      <section className="grid grid-cols-2 gap-4 text-center text-sm sm:grid-cols-4">
        {['Nationwide Delivery', 'Mobile Money Payment', 'Curated Pieces', 'Based in Uganda'].map(t =>
          <div key={t} className="rounded-lg border border-navy/10 bg-white px-3 py-4 font-medium">{t}</div>)}
      </section>
      {cats.length > 0 && <section>
        <h2 className="mb-4 font-serif text-2xl">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cats.slice(0, 4).map(c => (
            <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`} className="group">
              <div className="aspect-square overflow-hidden rounded-lg bg-navy/5">
                {catImg(c) && <img src={catImg(c)} alt={c} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}</div>
              <div className="mt-2 text-sm font-medium">{c}</div>
            </Link>))}
        </div>
      </section>}
      <section>
        <div className="mb-4 flex items-end justify-between"><h2 className="font-serif text-2xl">New In</h2>
          <Link to="/shop" className="text-sm text-forest">View all →</Link></div>
        {loading ? <p className="text-sm text-navy/60">Loading…</p> :
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.slice(0, 8).map(p => <Card key={p.id} p={p} />)}</div>}
      </section>
    </div>
  )
}
