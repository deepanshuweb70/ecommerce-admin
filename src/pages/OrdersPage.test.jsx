import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import OrdersPage from './OrdersPage'

vi.mock('../api/hooks', () => ({
  useOrders: () => ({
    data: [
      { id: 'order-1', customerId: 'u1', total: 24, status: 'Pending', paymentStatus: 'Pending' },
      { id: 'order-2', customerId: 'u1', total: 50, status: 'Delivered', paymentStatus: 'Paid' },
    ],
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useCustomers: () => ({
    data: [{ id: 'u1', name: 'Aarav Sharma', email: 'aarav@example.com' }],
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}))

describe('OrdersPage', () => {
  it('renders order history and customer names', () => {
    render(<OrdersPage />)
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getAllByText('Aarav Sharma')).toHaveLength(2)
  })

  it('filters orders by fulfillment status', async () => {
    render(<OrdersPage />)
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /filter orders/i }), 'Delivered')
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.queryByText('#1')).not.toBeInTheDocument()
  })
})
