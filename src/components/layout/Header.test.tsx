import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'
import { AuthProvider } from '@/contexts/AuthContext'
import { vi } from 'vitest'

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      name: 'John Doe',
      role: 'ADMIN',
      schoolName: 'Test School'
    },
    logout: vi.fn()
  })
}))

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('renders user information correctly', () => {
    renderHeader()
    
    expect(screen.getByText('Test School')).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/ADMIN/)).toBeInTheDocument()
  })

  it('opens dropdown menu when user icon is clicked', () => {
    renderHeader()
    
    const userButton = screen.getByRole('button')
    fireEvent.click(userButton)
    
    expect(screen.getByText('My Account')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })
})
