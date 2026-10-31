import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 5000 })

export const getProducts = async () => (await api.get('/products')).data
export const createProduct = async (product) => (await api.post('/products', product)).data
export const updateProduct = async ({ id, ...changes }) => (await api.patch(`/products/${id}`, changes)).data
export const removeProduct = async (id) => api.delete(`/products/${id}`)
export const getOrders = async () => (await api.get('/orders')).data
export const getCustomers = async () => (await api.get('/customers')).data
export const createCustomer = async (customer) => (await api.post('/customers', customer)).data
export const updateCustomer = async ({ id, ...changes }) => (await api.patch(`/customers/${id}`, changes)).data
export const removeCustomer = async (id) => api.delete(`/customers/${id}`)
