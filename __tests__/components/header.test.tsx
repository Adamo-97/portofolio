import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/header'

describe('Header Component', () => {
  it('renders navigation links', () => {
    render(<Header />)
    
    // Check if navigation links are present (using getAllByText for multiple matches)
    expect(screen.getAllByText(/home/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/projects/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/skills/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/roadmap/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0)
  })

  it('renders without crashing', () => {
    const { container } = render(<Header />)
    expect(container).toBeInTheDocument()
  })

  it('renders logo image', () => {
    render(<Header />)
    const logos = screen.getAllByAltText('Logo')
    expect(logos.length).toBeGreaterThan(0)
  })
})
