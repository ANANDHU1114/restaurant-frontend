import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function useCart() { return useContext(CartContext) }

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')||'[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)) }, [items])

  const add = (menuItem, qty = 1) => {
    setItems(s => {
      // match by _id when available, otherwise match by name to support reordering
      const idx = s.findIndex(i => (menuItem._id && i._id === menuItem._id) || (!menuItem._id && i.name === menuItem.name))
      if (idx >= 0) {
        const copy = [...s]
        copy[idx].qty += qty
        return copy
      }
      return [...s, { ...menuItem, qty }]
    })
  }

  const updateQty = (id, qty) => {
    setItems(s => s.map(i => i._id === id ? { ...i, qty } : i))
  }

  const remove = (id) => setItems(s => s.filter(i => i._id !== id))

  const clear = () => setItems([])

  const total = items.reduce((sum, it) => sum + (it.qty * it.price), 0)

  return (
    <CartContext.Provider value={{ items, add, updateQty, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}
