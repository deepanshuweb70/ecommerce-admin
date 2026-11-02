import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UsersPage from './UsersPage'

const mocks = vi.hoisted(() => ({
  add: { mutateAsync: vi.fn() },
  edit: { mutateAsync: vi.fn() },
  remove: { mutateAsync: vi.fn() },
}))

vi.mock('../api/hooks', () => ({
  useCustomers: () => ({
    data: [{ id: 'u1', name: 'Aarav Sharma', email: 'aarav@example.com' }],
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useCustomerMutations: () => mocks,
}))

describe('UsersPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows users loaded from the query', () => {
    render(<UsersPage />)
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument()
    expect(screen.getByText('aarav@example.com')).toBeInTheDocument()
  })

  it('validates and submits a new user', async () => {
    mocks.add.mutateAsync.mockResolvedValue({ id: 'u2' })
    render(<UsersPage />)
    await userEvent.click(screen.getByRole('button', { name: /add user/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText(/full name/i), 'Diya Patel')
    await userEvent.type(within(dialog).getByLabelText(/email address/i), 'diya@example.com')
    fireEvent.submit(within(dialog).getByRole('button', { name: /add user/i }).closest('form'))
    await waitFor(() => expect(mocks.add.mutateAsync).toHaveBeenCalledWith({ name: 'Diya Patel', email: 'diya@example.com' }))
  })

  it('shows a validation message for an invalid email', async () => {
    render(<UsersPage />)
    await userEvent.click(screen.getByRole('button', { name: /add user/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText(/full name/i), 'Diya Patel')
    await userEvent.type(within(dialog).getByLabelText(/email address/i), 'not-an-email')
    fireEvent.submit(within(dialog).getByRole('button', { name: /add user/i }).closest('form'))
    expect(await within(dialog).findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(mocks.add.mutateAsync).not.toHaveBeenCalled()
  })
})
