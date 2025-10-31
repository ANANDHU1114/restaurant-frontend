import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')
  return (
    <div className="search-bar">
      <input placeholder="Search by customer, item or status" value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={()=>onSearch(q)}>Search</button>
      <button onClick={()=>{ setQ(''); onSearch('') }}>Clear</button>
    </div>
  )
}
