import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCustomer,
  createProduct,
  getCustomers,
  getOrders,
  getProducts,
  removeCustomer,
  removeProduct,
  updateCustomer,
  updateProduct,
} from './client'

export const queryKeys = {
  products: ['products'],
  orders: ['orders'],
  customers: ['customers'],
}

export const useProducts = () => useQuery({ queryKey: queryKeys.products, queryFn: getProducts })
export const useOrders = () => useQuery({ queryKey: queryKeys.orders, queryFn: getOrders })
export const useCustomers = () => useQuery({ queryKey: queryKeys.customers, queryFn: getCustomers })

export function useProductMutations() {
  const client = useQueryClient()
  const refresh = () => client.invalidateQueries({ queryKey: queryKeys.products })
  return {
    add: useMutation({ mutationFn: createProduct, onSuccess: refresh }),
    edit: useMutation({ mutationFn: updateProduct, onSuccess: refresh }),
    remove: useMutation({ mutationFn: removeProduct, onSuccess: refresh }),
  }
}

export function useCustomerMutations() {
  const client = useQueryClient()
  const refresh = () => client.invalidateQueries({ queryKey: queryKeys.customers })
  return {
    add: useMutation({ mutationFn: createCustomer, onSuccess: refresh }),
    edit: useMutation({ mutationFn: updateCustomer, onSuccess: refresh }),
    remove: useMutation({ mutationFn: removeCustomer, onSuccess: refresh }),
  }
}
