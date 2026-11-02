import axios from 'axios'
import { customers as seedCustomers, orders as seedOrders, products as seedProducts } from '../data/mockData'

const useBrowserDemoStore = import.meta.env.PROD && !import.meta.env.VITE_API_URL
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 5000 })
const seedData = { products: seedProducts, orders: seedOrders, customers: seedCustomers }

function readCollection(collection) {
  const key = `shoppanel-${collection}`
  const stored = localStorage.getItem(key)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(key, JSON.stringify(seedData[collection]))
  return seedData[collection]
}

function updateCollection(collection, updater) {
  const current = readCollection(collection)
  const { items, result } = updater(current)
  localStorage.setItem(`shoppanel-${collection}`, JSON.stringify(items))
  return result
}

export const getProducts = async () => useBrowserDemoStore ? readCollection('products') : (await api.get('/products')).data
export const createProduct = async (product) => useBrowserDemoStore
  ? updateCollection('products', (items) => { const item = { id: crypto.randomUUID(), ...product }; return { items: [...items, item], result: item } })
  : (await api.post('/products', product)).data
export const updateProduct = async ({ id, ...changes }) => useBrowserDemoStore
  ? updateCollection('products', (items) => { const next = items.map((item) => item.id === id ? { ...item, ...changes } : item); return { items: next, result: next.find((item) => item.id === id) } })
  : (await api.patch(`/products/${id}`, changes)).data
export const removeProduct = async (id) => useBrowserDemoStore
  ? updateCollection('products', (items) => ({ items: items.filter((item) => item.id !== id), result: { id } }))
  : api.delete(`/products/${id}`)
export const getOrders = async () => useBrowserDemoStore ? readCollection('orders') : (await api.get('/orders')).data
export const getCustomers = async () => useBrowserDemoStore ? readCollection('customers') : (await api.get('/customers')).data
export const createCustomer = async (customer) => useBrowserDemoStore
  ? updateCollection('customers', (items) => { const item = { id: crypto.randomUUID(), ...customer }; return { items: [...items, item], result: item } })
  : (await api.post('/customers', customer)).data
export const updateCustomer = async ({ id, ...changes }) => useBrowserDemoStore
  ? updateCollection('customers', (items) => { const next = items.map((item) => item.id === id ? { ...item, ...changes } : item); return { items: next, result: next.find((item) => item.id === id) } })
  : (await api.patch(`/customers/${id}`, changes)).data
export const removeCustomer = async (id) => useBrowserDemoStore
  ? updateCollection('customers', (items) => ({ items: items.filter((item) => item.id !== id), result: { id } }))
  : api.delete(`/customers/${id}`)
