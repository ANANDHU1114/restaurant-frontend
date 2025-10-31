import React, { useEffect, useState } from 'react'
import { fetchMenu } from '../api'
import { useCart } from '../contexts/CartContext'

export default function MenuPage(){
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const { add } = useCart()

  // create a small flying dot animation from click target to the cart icon
  const animateAddToCart = (e) => {
    try {
      const cart = document.getElementById('cart-icon')
      if (!cart) return
      const btnRect = e.currentTarget.getBoundingClientRect()
      const cartRect = cart.getBoundingClientRect()

      const dot = document.createElement('div')
      dot.className = 'fly-dot'
      const startX = btnRect.left + btnRect.width/2
      const startY = btnRect.top + btnRect.height/2
      dot.style.left = startX + 'px'
      dot.style.top = startY + 'px'
      document.body.appendChild(dot)

      // compute translation to cart center
      const endX = cartRect.left + cartRect.width/2
      const endY = cartRect.top + cartRect.height/2
      const deltaX = endX - startX
      const deltaY = endY - startY

      // trigger transform
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`
        dot.style.opacity = '0'
      })

      dot.addEventListener('transitionend', () => { dot.remove() })
    } catch (err) {
      // ignore animation errors
    }
  }

  useEffect(()=>{ (async()=>{ setLoading(true); setMenu(await fetchMenu()); setLoading(false) })() }, [])

  if (loading) return <p>Loading menu...</p>

  return (
    <div>
      <h2>Menu</h2>
      <div className="menu-grid">
        {menu.map(item => (
          <div key={item._id} className="card menu-card">
            <div className="title">{item.name}</div>
            <div className="muted small">{item.description}</div>
            <div className="meta" style={{marginTop:8}}>
              <strong>₹{Number(item.price).toFixed(2)}</strong>
              <div>
                <button onClick={(e)=>{ animateAddToCart(e); add(item,1) }} disabled={!item.available}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
