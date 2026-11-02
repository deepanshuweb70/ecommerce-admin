import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import InventoryPage from './InventoryPage'

const mocks = vi.hoisted(() => ({
  add: { mutateAsync: vi.fn() },
  edit: { mutateAsync: vi.fn() },
  remove: { mutateAsync: vi.fn() },
}))

vi.mock('../api/hooks', () => ({
  useProducts: () => ({
    data: [
      { id: 'p1', name: 'Desk Lamp', category: 'Home', price: 25, stock: 12 },
      { id: 'p2', name: 'USB Hub', category: 'Electronics', price: 35, stock: 20 },
    ],
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useProductMutations: () => mocks,
}))

describe('InventoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('filters products by search text', async () => {
    render(<InventoryPage />)
    expect(screen.getByText('Desk Lamp')).toBeInTheDocument()
    await userEvent.type(screen.getByRole('searchbox', { name: /search inventory/i }), 'usb')
    expect(screen.queryByText('Desk Lamp')).not.toBeInTheDocument()
    expect(screen.getByText('USB Hub')).toBeInTheDocument()
  })

  it('submits the add product form to the API mutation', async () => {
    mocks.add.mutateAsync.mockResolvedValue({ id: 'p3' })
    render(<InventoryPage />)
    await userEvent.click(screen.getByRole('button', { name: /add product/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText(/product name/i), 'Phone Case')
    await userEvent.type(within(dialog).getByLabelText(/category/i), 'Accessories')
    fireEvent.change(within(dialog).getByLabelText(/price/i), { target: { value: '19.99' } })
    fireEvent.change(within(dialog).getByLabelText(/stock/i), { target: { value: '8' } })
    await userEvent.click(within(dialog).getByRole('button', { name: /add product/i }))
    await waitFor(() => expect(mocks.add.mutateAsync).toHaveBeenCalledWith({
      name: 'Phone Case', category: 'Accessories', price: 19.99, stock: 8,
    }))
  })
})
