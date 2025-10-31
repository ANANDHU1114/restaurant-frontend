import React, { useEffect, useState, useRef } from 'react'
import { fetchOrders, updateOrder, setAuthToken } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function OrdersPage(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  // Toasts
  const [toasts, setToasts] = useState([])
  const toastId = useRef(1)
  const addToast = (message, variant = 'info', ttl = 4000) => {
    const id = toastId.current++
    setToasts(s => [...s, { id, message, variant }])
    setTimeout(() => setToasts(s => s.filter(t => t.id !== id)), ttl)
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      console.error('Fetch orders error', err)
      addToast('Failed to fetch orders', 'error')
    } finally { setLoading(false) }
  }

  useEffect(()=>{ (async()=>{ await refresh() })() }, [])

  // Poll for new orders every 10s
  useEffect(()=>{
    const id = setInterval(()=>{ refresh() }, 10000)
    return () => clearInterval(id)
  }, [])

  if (loading) return <p>Loading orders...</p>

  return (
    <div>
      <h2>Orders</h2>

      <div>
        {orders.map(o => (
          <div key={o._id} className="card" style={{padding:12, marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
              <div style={{flex:1}}>
                <div><strong>Order ID:</strong> {o._id}</div>
                <div style={{marginTop:6}}><strong>{o.customerName}</strong> {o.email ? `- ${o.email}` : ''} {o.tableNumber ? `- Table ${o.tableNumber}` : ''}</div>
                <div style={{marginTop:6}}>Placed: {new Date(o.createdAt).toLocaleString()}</div>
              </div>

              <div style={{textAlign:'right'}}>
                <div><strong>Status:</strong> {o.status}</div>
                <div style={{marginTop:6}}><strong>Total:</strong> ₹{Number(o.total).toFixed(2)}</div>
              </div>

              <div style={{minWidth:240}}>
                {isAdmin && (
                  <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                    {o.status !== 'cancelled' && o.status !== 'served' && (
                      <button onClick={async () => {
                        try {
                          setAuthToken(localStorage.getItem('token'))
                          await updateOrder(o._id, { status: 'preparing' })
                          await refresh()
                          addToast('Order accepted', 'success')
                        } catch (err) {
                          console.error('Accept error', err, err?.response)
                          const msg = err?.response?.data?.error || err.message || String(err)
                          addToast('Failed to accept order: ' + msg, 'error')
                        }
                      }}>Accept</button>
                    )}

                    {o.status !== 'cancelled' && (
                      <button className="danger" onClick={async () => {
                        if (!confirm('Cancel this order?')) return
                        try {
                          setAuthToken(localStorage.getItem('token'))
                          await updateOrder(o._id, { status: 'cancelled' })
                          await refresh()
                          addToast('Order cancelled', 'warning')
                        } catch (err) {
                          console.error('Cancel error', err, err?.response)
                          const msg = err?.response?.data?.error || err.message || String(err)
                          addToast('Failed to cancel order: ' + msg, 'error')
                        }
                      }}>Cancel</button>
                    )}

                    {o.status === 'preparing' && (
                      <button style={{background:'#0ea5a4', color:'#fff'}} onClick={async () => {
                        try {
                          setAuthToken(localStorage.getItem('token'))
                          await updateOrder(o._id, { status: 'served' })
                          await refresh()
                          addToast('Order marked as served', 'success')
                        } catch (err) {
                          console.error('Serve error', err, err?.response)
                          const msg = err?.response?.data?.error || err.message || String(err)
                          addToast('Failed to mark served: ' + msg, 'error')
                        }
                      }}>Mark as served</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{marginTop:10}}>
              <details>
                <summary>Items ({o.items.length})</summary>
                <ul>
                  {o.items.map((it, i) => <li key={i}>{it.name} x{it.qty} — ₹{Number(it.price).toFixed(2)}</li>)}
                </ul>
              </details>
            </div>
          </div>
        ))}
      </div>

      {/* Toast container */}
      <div style={{position:'fixed', right:20, top:20, zIndex:9999, display:'flex', flexDirection:'column', gap:8}}>
        {toasts.map(t => (
          <div key={t.id} style={{minWidth:220, padding:10, borderRadius:8, color:'#fff', boxShadow:'0 6px 18px rgba(15,23,42,0.06)', background: t.variant === 'error' ? '#ef4444' : t.variant === 'warning' ? '#f59e0b' : t.variant === 'success' ? '#10b981' : '#334155'}}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
