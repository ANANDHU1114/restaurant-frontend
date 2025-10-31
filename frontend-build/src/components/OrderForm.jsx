import React, { useEffect, useState } from 'react'

const emptyItem = () => ({ name: '', qty: 1, price: 0 })

export default function OrderForm({ onCreate, editing, onUpdate, onCancel }) {
  const [customerName, setCustomerName] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [items, setItems] = useState([emptyItem()])
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    if (editing) {
      setCustomerName(editing.customerName || '')
      setTableNumber(editing.tableNumber || '')
      setItems(editing.items.length ? editing.items : [emptyItem()])
      setStatus(editing.status || 'pending')
    }
  }, [editing])

  const addItem = () => setItems(s => [...s, emptyItem()])
  const updateItem = (idx, key, value) => setItems(s => s.map((it,i) => i===idx? {...it, [key]: value} : it))
  const removeItem = (idx) => setItems(s => s.filter((_,i) => i!==idx))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      customerName,
      tableNumber: tableNumber ? Number(tableNumber) : undefined,
      items: items.map(it => ({ name: it.name, qty: Number(it.qty), price: Number(it.price) })),
      status
    }
    if (editing) onUpdate(editing._id, payload)
    else onCreate(payload)
    // reset
    setCustomerName('')
    setTableNumber('')
    setItems([emptyItem()])
    setStatus('pending')
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit Order' : 'New Order'}</h2>
      <label>Customer</label>
      <input value={customerName} onChange={e=>setCustomerName(e.target.value)} required />
      <label>Table</label>
      <input value={tableNumber} onChange={e=>setTableNumber(e.target.value)} />
      <label>Items</label>
      {items.map((it, idx) => (
        <div key={idx} className="item-row">
          <input placeholder="name" value={it.name} onChange={e=>updateItem(idx,'name',e.target.value)} required />
          <input type="number" min="1" value={it.qty} onChange={e=>updateItem(idx,'qty',e.target.value)} />
          <input type="number" min="0" step="0.01" value={it.price} onChange={e=>updateItem(idx,'price',e.target.value)} />
          <button type="button" onClick={()=>removeItem(idx)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addItem}>Add item</button>
      <label>Status</label>
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="pending">pending</option>
        <option value="preparing">preparing</option>
        <option value="served">served</option>
        <option value="cancelled">cancelled</option>
      </select>
      <div className="form-actions">
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
