import axios from 'axios'

// central axios instance used by frontend api helpers. We export a setter so auth header
// is kept in sync when token changes in AuthContext.
// In development use the backend running on localhost:5001; in production use relative '/api'.
// In development the backend runs on port 5001 (backend/server.js). Use that port when testing locally.
const DEV_BACKEND = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api')
  : '/api'

export const API = axios.create({ baseURL: DEV_BACKEND })

export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete API.defaults.headers.common['Authorization']
  }
}

export async function fetchOrders(search) {
  const resp = await API.get('/orders', { params: search ? { search } : {} })
  return resp.data
}

export async function createOrder(payload) {
  const resp = await API.post('/orders', payload)
  return resp.data
}

export async function updateOrder(id, payload) {
  const resp = await API.put(`/orders/${id}`, payload)
  return resp.data
}

export async function deleteOrder(id) {
  const resp = await API.delete(`/orders/${id}`)
  return resp.data
}

// Menu endpoints
export async function fetchMenu(params) {
  const resp = await API.get('/menu', { params })
  return resp.data
}

export async function createMenuItem(payload) {
  const resp = await API.post('/menu', payload)
  return resp.data
}

export async function updateMenuItem(id, payload) {
  const resp = await API.put(`/menu/${id}`, payload)
  return resp.data
}

export async function deleteMenuItem(id) {
  const resp = await API.delete(`/menu/${id}`)
  return resp.data
}

// Checkout: reuse orders endpoint
export async function checkoutOrder(payload) {
  const resp = await API.post('/orders', payload)
  return resp.data
}
