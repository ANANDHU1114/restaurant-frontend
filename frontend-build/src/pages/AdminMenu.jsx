import React, { useEffect, useState } from 'react'
import { fetchMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../api'

const empty = { name:'', description:'', price:0, category:'General', available:true }

export default function AdminMenu(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  const load = async ()=> setItems(await fetchMenu())
  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (editingId) await updateMenuItem(editingId, form)
    else await createMenuItem(form)
    setForm(empty); setEditingId(null); await load()
  }

  const edit = (it) => { setForm({ name: it.name, description: it.description, price: it.price, category: it.category, available: it.available }); setEditingId(it._id) }

  const del = async (id) => { if (!confirm('Delete item?')) return; await deleteMenuItem(id); await load() }

  return (
    <div>
      <h2>Admin - Menu Items</h2>
      <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,maxWidth:700}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
        <input placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
  {/* Image support removed - images are not used in this version */}
        <input type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f,price:Number(e.target.value)}))} />
        <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={form.available} onChange={e=>setForm(f=>({...f,available:e.target.checked}))} /> Available</label>
        <div>
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm(empty) }}>Cancel</button>}
        </div>
      </form>

      <h3 style={{marginTop:20}}>All items</h3>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(it => (
            <tr key={it._id}>
              <td>{it.name}</td>
              <td>{it.category}</td>
              <td>₹{Number(it.price).toFixed(2)}</td>
              <td>{it.available ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={()=>edit(it)}>Edit</button>
                <button onClick={()=>del(it._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
