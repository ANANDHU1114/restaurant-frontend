import React from 'react'

export default function OrderList({ orders = [], onEdit, onDelete }) {
  return (
    <div className="order-list">
      <h2>Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Table</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.customerName}</td>
              <td>{o.tableNumber || '-'}</td>
              <td>
                {o.items.map((it, i) => (
                  <div key={i}>{it.name} x{it.qty}</div>
                ))}
              </td>
              <td>₹{Number(o.total).toFixed(2)}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => onEdit(o)}>Edit</button>
                <button onClick={() => onDelete(o._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
