import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'
import { BiRestaurant, BiCartAlt, BiTask, BiUserCircle } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'
import { HiOutlineLogin, HiOutlineUserAdd } from 'react-icons/hi'

export default function Sidebar(){
  const { user, logout, isAdmin } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <BiRestaurant size={24} />
          <span className="brand-text">Restaurant</span>
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={20} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {user ? (
          <>
            <NavLink to="/" end className={({isActive})=> isActive ? 'side-link active' : 'side-link'}>
              <BiRestaurant size={20} />
              <span>Menu</span>
            </NavLink>
            <NavLink to="/cart" className={({isActive})=> isActive ? 'side-link active' : 'side-link'}>
              <BiCartAlt size={20} />
              <span>Cart</span>
            </NavLink>
            <NavLink to="/orders" className={({isActive})=> isActive ? 'side-link active' : 'side-link'}>
              <BiTask size={20} />
              <span>Orders</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({isActive})=> isActive ? 'side-link active' : 'side-link'}>
                <BiUserCircle size={20} />
                <span>Admin</span>
              </NavLink>
            )}
            <button className="side-logout" onClick={logout}>
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({isActive})=> isActive ? 'side-link active' : 'side-link'}>
              <HiOutlineLogin size={20} />
              <span>Login</span>
            </NavLink>
            <NavLink to="/register" className={({isActive})=> isActive ? 'side-link active' : 'side-link'}>
              <HiOutlineUserAdd size={20} />
              <span>Register</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
