import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { checkoutOrder } from '../api'

export default function CartPage(){
  const { items, updateQty, remove, clear, total } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!customerName) return alert('Enter customer name')
    if (!email) return alert('Enter customer email')
    const payload = {
      customerName,
      email,
      tableNumber: tableNumber ? Number(tableNumber) : undefined,
      items: items.map(it => ({
        name: it.name,
        qty: it.qty,
        price: Number(it.price) // ensure price is a number
      }))
    }
    setLoading(true)
    try {
      await checkoutOrder(payload)
      clear()
      setCustomerName('')
      setTableNumber('')
      alert('Order placed')
    } catch (err) {
      alert('Checkout failed: ' + (err.message || err))
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2>Cart</h2>
      {items.length===0 && <p>Cart is empty.</p>}
      {items.map(it => (
        <div key={it._id} className="card" style={{display:'flex',gap:12,alignItems:'center',borderBottom:'none',padding:10,marginBottom:8}}>
          <div style={{flex:1}}>{it.name}</div>
          <div>
            <input type="number" min="1" value={it.qty} onChange={e=>updateQty(it._id, Number(e.target.value))} style={{width:70}} />
          </div>
          <div>₹{(it.price*it.qty).toFixed(2)}</div>
          <div><button className="secondary" onClick={()=>remove(it._id)}>Remove</button></div>
        </div>
      ))}
      {items.length>0 && (
        <div style={{marginTop:12}}>
          <h3>Total: ₹{total.toFixed(2)}</h3>
          <div style={{display:'flex',gap:8,flexDirection:'column',maxWidth:400}}>
            <input placeholder="Customer name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
            <input placeholder="Customer email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input placeholder="Table number (optional)" value={tableNumber} onChange={e=>setTableNumber(e.target.value)} />
            <div style={{display:'flex',gap:8}}>
              <button onClick={handleCheckout} disabled={loading}>Checkout</button>
              <button className="secondary" onClick={clear}>Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
