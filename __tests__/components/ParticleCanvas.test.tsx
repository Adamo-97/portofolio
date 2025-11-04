// __tests__/components/ParticleCanvas.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticleCanvas from '@/components/animations/ParticleCanvas';

// Mock canvas context
const mockContext = {
  scale: jest.fn(),
  clearRect: jest.fn(),
  fillStyle: '',
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
};

const mockCanvas = {
  getContext: jest.fn(() => mockContext),
  width: 0,
  height: 0,
  style: {},
  parentElement: {
    clientWidth: 1920,
    clientHeight: 1080,
  },
};

describe('ParticleCanvas', () => {
  let rafSpy: jest.SpyInstance;
  let cancelAnimationFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock requestAnimationFrame
    rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(performance.now()), 0);
      return 1;
    });
    
    cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    
    // Mock HTMLCanvasElement
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return document.createElement(tagName);
    });

    // Mock window.matchMedia for prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });

  it('should render canvas element', () => {
    render(<ParticleCanvas />);
    const canvas = screen.getByRole('img', { hidden: true }); // Canvas has implicit img role
    expect(canvas).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-particle-class';
    render(<ParticleCanvas className={customClass} />);
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toHaveClass(customClass);
  });

  it('should start animation on mount', async () => {
    render(<ParticleCanvas />);
    
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
    });
  });

  it('should cancel animation on unmount', async () => {
    const { unmount } = render(<ParticleCanvas />);
    
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
    });
    
    unmount();
    
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should handle window resize', async () => {
    const { container } = render(<ParticleCanvas />);
    
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
    });
    
    // Trigger resize
    window.dispatchEvent(new Event('resize'));
    
    // Should still be rendering
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('should handle visibility change', async () => {
    render(<ParticleCanvas />);
    
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
    });
    
    // Hide page
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    
    // Show page again
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    expect(rafSpy).toHaveBeenCalled();
  });

  it('should respect prefers-reduced-motion', () => {
    // Mock prefers-reduced-motion: reduce
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ParticleCanvas />);
    
    // Animation should not start
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('should use custom particle count', async () => {
    render(<ParticleCanvas particlesDesktop={500} particlesMobile={100} />);
    
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
    });
    
    // Particles should be initialized (can't easily test count, but ensures no crash)
  });

  it('should use custom color', () => {
    const customColor = '255,0,0'; // Red
    render(<ParticleCanvas color={customColor} />);
    
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it('should use custom speed multiplier', () => {
    render(<ParticleCanvas speedMultiplier={2.5} />);
    
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it('should use custom twinkle rate', () => {
    render(<ParticleCanvas twinkleRate={3.0} />);
    
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it('should respect maxFps setting', async () => {
    render(<ParticleCanvas maxFps={30} />);
    
    await waitFor(() => {
      expect(rafSpy).toHaveBeenCalled();
    });
    
    // Animation should throttle to 30fps (can't easily test exact timing in jest)
  });

  it('should handle mobile viewport', () => {
    global.innerWidth = 375;
    
    render(<ParticleCanvas particlesDesktop={220} particlesMobile={120} />);
    
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it('should handle desktop viewport', () => {
    global.innerWidth = 1920;
    
    render(<ParticleCanvas particlesDesktop={220} particlesMobile={120} />);
    
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it('should not re-render unnecessarily (memoization)', () => {
    const { rerender } = render(<ParticleCanvas particlesDesktop={220} />);
    const initialRafCalls = rafSpy.mock.calls.length;
    
    // Re-render with same props
    rerender(<ParticleCanvas particlesDesktop={220} />);
    
    // Should not create new animation
    expect(rafSpy.mock.calls.length).toBe(initialRafCalls);
  });

  it('should re-initialize when props change', () => {
    const { rerender } = render(<ParticleCanvas particlesDesktop={220} />);
    
    // Change props
    rerender(<ParticleCanvas particlesDesktop={300} />);
    
    // Should clean up old animation and start new one
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalled();
  });
});
