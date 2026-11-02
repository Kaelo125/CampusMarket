import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sb } from '../supabase'
import { useStore, fmt } from '../store.jsx'

const LOCATIONS = {
  'Kampala Region': ['Kampala CBD', 'Kampala City', 'Kira', 'Nansana', 'Wakiso', 'Makindye-Ssabagabo', 'Banda', 'Kabalagala', 'Muyenga', 'Kawempe', 'Mutungo', 'Bukoto', 'Namugongo'],
  'Rest of Central Region': ['Entebbe', 'Mukono', 'Masaka', 'Lugazi', 'Mityana', 'Mubende', 'Luwero', 'Kayunga'],
  'Eastern Region': ['Jinja', 'Mbale', 'Iganga', 'Tororo', 'Busia', 'Soroti', 'Kamuli', 'Bugiri'],
  'Western Region': ['Mbarara', 'Fort Portal', 'Hoima', 'Kasese', 'Kabale', 'Bushenyi-Ishaka', 'Rukungiri', 'Kisoro', 'Masindi'],
}
const PAY = {
  'MTN MoMo': { number: '0782 628 624', name: 'Tayomba Miria' },
  'Airtel MoMo': { number: '0743 457 759', name: 'Malirire Christine' },
}
const Steps = ({ n }) => (
  <div className="mb-6 flex items-center justify-center gap-2 text-sm">
    {['Shipping', 'Payment', 'Confirmation'].map((s, i) => (
      <div key={s} className="flex items-center gap-2">
        <span className={'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ' + (n >= i + 1 ? 'bg-forest text-white' : 'bg-navy/10')}>{i + 1}</span>
        <span className={n === i + 1 ? 'font-semibold' : 'text-navy/60'}>{s}</span>{i < 2 && <span className="text-navy/30">—</span>}
      </div>))}
  </div>
)
const F = ({ label, children }) => <div><label className="label">{label}</label>{children}</div>

export default function Checkout() {
  const { cart, subtotal, clear } = useStore()
  const [step, setStep] = useState(1), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [order, setOrder] = useState(null)
  const [f, setF] = useState({ name: '', phone: '', email: '', address: '', region: '', city: '', other: '', method: 'MTN MoMo', senderNumber: '', senderName: '', coupon: '' })
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value, ...(k === 'region' ? { city: '' } : {}) }))

  if (step < 3 && !cart.length) return <div className="py-20 text-center"><p className="mb-4">Your cart is empty.</p><Link to="/shop" className="btn-green">Continue Shopping</Link></div>

  const shippingOk = f.name.trim() && f.phone.trim() && f.address.trim() && f.region && f.city && (f.city !== 'Other location' || f.other.trim())
  const payOk = f.senderNumber.trim() && f.senderName.trim()

  async function place() {
    setBusy(true); setErr('')
    const { data, error } = await sb.functions.invoke('create-order', { body: {
      user_id: null, customer_name: f.name.trim(), phone: f.phone.trim(), address: f.address.trim(), email: f.email.trim() || null,
      payment_method: f.method, payment_sender_number: f.senderNumber.trim(), payment_sender_name: f.senderName.trim(),
      coupon_code: f.coupon.trim() || null, delivery_region: f.region, delivery_city: f.city,
      delivery_other_location: f.city === 'Other location' ? f.other.trim() : null,
      items: cart.map(i => ({ product_id: i.id, qty: i.qty, size: i.size, color: i.color })),
    } })
    setBusy(false)
    let msg = data?.error || error?.message
    if (!msg && error?.context?.json) { try { msg = (await error.context.json())?.error } catch {} }
    if (msg || !data?.order) { setErr(msg || 'Something went wrong. Please try again.'); return }
    setOrder(data.order); clear(); setStep(3)
  }

  if (step === 3 && order) return (
    <div className="mx-auto max-w-md text-center">
      <Steps n={3} />
      <div className="rounded-xl bg-white p-8">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-white">✓</div>
        <h1 className="font-serif text-2xl">Order Received</h1>
        <p className="mt-1 text-sm text-navy/70">Thank you, {f.name.split(' ')[0]}. We will verify your Mobile Money payment manually and then confirm your order.</p>
        <div className="mt-4 rounded-lg bg-paper p-4 text-sm">
          <div>Order <b>{order.order_number}</b></div><div>Total {fmt(order.total)}</div>
          {order.guest_tracking_token && <div className="mt-2">Tracking code:<div className="mt-1 break-all rounded bg-white p-2 font-mono text-xs">{order.guest_tracking_token}</div>
            <p className="mt-1 text-xs text-red-700">Save this code. You need it to track your order.</p></div>}
        </div>
        <Link to="/track" className="btn-line mt-4 w-full">Track My Order</Link>
      </div>
    </div>)

  return (
    <div className="mx-auto max-w-4xl">
      <Steps n={step} />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-xl bg-white p-5">
          {step === 1 && <>
            <h2 className="font-serif text-xl">Shipping Information</h2>
            <F label="Full name *"><input className="field" value={f.name} onChange={set('name')} /></F>
            <F label="Phone number *"><input className="field" inputMode="tel" value={f.phone} onChange={set('phone')} /></F>
            <F label="Email (optional)"><input className="field" type="email" value={f.email} onChange={set('email')} /></F>
            <F label="Delivery address *"><input className="field" value={f.address} onChange={set('address')} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Region *"><select className="field" value={f.region} onChange={set('region')}><option value="">Select</option>{Object.keys(LOCATIONS).map(r => <option key={r}>{r}</option>)}</select></F>
              <F label="City / area *"><select className="field" disabled={!f.region} value={f.city} onChange={set('city')}><option value="">Select</option>{(LOCATIONS[f.region] || []).map(c => <option key={c}>{c}</option>)}<option>Other location</option></select></F>
            </div>
            {f.city === 'Other location' && <F label="Your location *"><input className="field" value={f.other} onChange={set('other')} /></F>}
            <button disabled={!shippingOk} onClick={() => setStep(2)} className="btn-green w-full">Continue to Payment →</button>
          </>}
          {step === 2 && <>
            <h2 className="font-serif text-xl">Payment</h2>
            <div className="grid grid-cols-2 gap-3">{Object.keys(PAY).map(m => <button key={m} onClick={() => setF(s => ({ ...s, method: m }))}
              className={'rounded-lg border p-3 text-sm font-semibold ' + (f.method === m ? 'border-forest bg-forest/5' : 'border-navy/15')}>{m}</button>)}</div>
            <div className="rounded-lg bg-paper p-4 text-sm">Send <b>{fmt(subtotal)}</b> or the total shown on your order to <b>{PAY[f.method].number}</b> ({PAY[f.method].name}), then fill in the details below.
              <p className="mt-2 text-xs text-navy/60">Mobile Money payments are sent directly and manually verified before your order is confirmed. The final total includes delivery and any coupon.</p></div>
            <F label="Number you paid from *"><input className="field" inputMode="tel" value={f.senderNumber} onChange={set('senderNumber')} /></F>
            <F label="Name on that Mobile Money account *"><input className="field" value={f.senderName} onChange={set('senderName')} /></F>
            <F label="Coupon code (optional)"><input className="field uppercase" value={f.coupon} onChange={set('coupon')} /></F>
            {err && <p className="rounded bg-red-50 p-3 text-sm text-red-800">{err}</p>}
            <div className="flex gap-3"><button onClick={() => setStep(1)} className="btn-line">Back</button>
              <button disabled={!payOk || busy} onClick={place} className="btn-green flex-1">{busy ? 'Placing order…' : 'I have paid — Confirm Order'}</button></div>
          </>}
        </div>
        <aside className="h-fit space-y-3 rounded-xl bg-white p-5 text-sm">
          <h2 className="font-serif text-lg">Order Summary</h2>
          {cart.map(i => <div key={[i.id, i.size, i.color].join()} className="flex justify-between gap-2"><span>{i.name} × {i.qty}<span className="block text-xs text-navy/60">{[i.color, i.size].filter(Boolean).join(' · ')}</span></span><span>{fmt(i.price * i.qty)}</span></div>)}
          <div className="flex justify-between border-t border-navy/10 pt-3 font-semibold"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
        </aside>
      </div>
    </div>
  )
}
