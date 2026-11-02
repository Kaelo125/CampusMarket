import { Link } from 'react-router-dom'
import { fmt } from '../store.jsx'
export default function Card({ p }) {
  const sale = Number(p.original_price) > Number(p.price)
  return (
    <Link to={`/product/${p.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-navy/5">
        {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
      </div>
      <div className="mt-2 text-sm">{p.name}</div>
      <div className="text-sm font-semibold">{fmt(p.price)}
        {sale && <span className="ml-2 text-xs font-normal text-navy/50 line-through">{fmt(p.original_price)}</span>}</div>
    </Link>
  )
}
