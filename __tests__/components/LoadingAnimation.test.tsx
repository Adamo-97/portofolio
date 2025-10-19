import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingAnimation from '@/components/LoadingAnimation'

describe('LoadingAnimation Component', () => {
  it('renders loading state with text', () => {
    render(<LoadingAnimation text="Loading..." />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays the folder icon', () => {
    const { container } = render(<LoadingAnimation text="Please wait" />)
    
    // Check for the emoji icon
    expect(container.textContent).toContain('📁')
  })

  it('renders with custom text', () => {
    const customText = "Fetching data"
    render(<LoadingAnimation text={customText} />)
    
    expect(screen.getByText(customText)).toBeInTheDocument()
  })
})
