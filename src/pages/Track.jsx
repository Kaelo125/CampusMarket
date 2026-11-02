import { useState } from 'react'
import { sb } from '../supabase'
import { fmt } from '../store.jsx'
export default function Track() {
  const [num, setNum] = useState(''), [tok, setTok] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [o, setO] = useState(null)
  async function go(e) {
    e.preventDefault(); setBusy(true); setErr(''); setO(null)
    const { data, error } = await sb.functions.invoke('track-guest-order', { body: { order_number: num.trim(), tracking_token: tok.trim() } })
    setBusy(false)
    let msg = data?.error || error?.message
    if (!msg && error?.context?.json) { try { msg = (await error.context.json())?.error } catch {} }
    if (msg || !data?.order) return setErr(msg || 'Could not find that order.')
    setO(data.order)
  }
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 font-serif text-3xl">Track Your Order</h1>
      <p className="mb-4 text-sm text-navy/70">Enter your order number and the tracking code shown when you ordered.</p>
      <form onSubmit={go} className="space-y-3 rounded-xl bg-white p-5">
        <div><label className="label">Order number</label><input className="field uppercase" value={num} onChange={e => setNum(e.target.value)} placeholder="KAELO-000001" /></div>
        <div><label className="label">Tracking code</label><input className="field" value={tok} onChange={e => setTok(e.target.value)} /></div>
        {err && <p className="rounded bg-red-50 p-3 text-sm text-red-800">{err}</p>}
        <button disabled={busy || !num || !tok} className="btn-green w-full">{busy ? 'Checking…' : 'Track Order'}</button>
      </form>
      {o && <div className="mt-4 rounded-xl bg-white p-5 text-sm">
        <div className="text-xs uppercase tracking-wider text-navy/60">Current status</div>
        <div className="text-lg font-semibold capitalize">{String(o.status || 'unknown').replace(/_/g, ' ')}</div>
        {o.total != null && <div className="mt-1">Total {fmt(o.total)}</div>}
        <ul className="mt-3 space-y-1">{(o.items || []).map((it, i) => <li key={i} className="flex justify-between"><span>{it.product_name || 'Item'} × {it.qty}</span><span className="text-navy/60">{[it.size && `Size ${it.size}`, it.color].filter(Boolean).join(' · ')}</span></li>)}</ul>
        {(o.status_history || []).length > 0 && <ul className="mt-3 space-y-1 border-t border-navy/10 pt-3 text-xs text-navy/70">{o.status_history.map((h, i) => <li key={i}><b className="capitalize">{String(h.status).replace(/_/g, ' ')}</b>{h.at || h.created_at ? ` · ${new Date(h.at || h.created_at).toLocaleString()}` : ''}</li>)}</ul>}
      </div>}
    </div>
  )
}
