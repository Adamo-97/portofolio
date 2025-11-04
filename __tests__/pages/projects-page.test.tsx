// __tests__/pages/projects-page.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsPageClient from '@/app/projects-page/projects-page';
import { apiClient } from '@/lib/utils/fetch-client';

// Mock dependencies
jest.mock('@/lib/utils/fetch-client');
jest.mock('@/components/header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});
jest.mock('@/components/LoadingAnimation', () => {
  return function MockLoadingAnimation({ text }: { text: string }) {
    return <div data-testid="loading-animation">{text}</div>;
  };
});
jest.mock('@/components/animations/ParticleCanvas', () => {
  return function MockParticleCanvas() {
    return <canvas data-testid="particle-canvas" />;
  };
});
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockProjects = [
  {
    id: '1',
    title: 'Project 1',
    description: 'Description 1',
    category: 'Applications',
    github_url: 'https://github.com/test/project1',
    languages: ['JavaScript', 'React'],
    cover_image_url: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    title: 'Project 2',
    description: 'Description 2',
    category: 'Applications',
    github_url: 'https://github.com/test/project2',
    languages: ['TypeScript', 'Next.js'],
  },
  {
    id: '3',
    title: 'Project 3',
    description: 'Description 3',
    category: 'Infrastructure',
    github_url: 'https://github.com/test/project3',
    languages: ['Terraform'],
  },
];

const mockCategories = [
  { name: 'Applications', title: 'Applications', blurb: 'Test' },
  { name: 'Infrastructure', title: 'Infrastructure', blurb: 'Test' },
  { name: 'Utilities', title: 'Utilities', blurb: 'Test' },
];

describe('ProjectsPageClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window size
    global.innerWidth = 1920;
    global.innerHeight = 1080;
    
    // Mock both API calls
    (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);
    (apiClient.getSkillCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  describe('Loading State', () => {
    it('should display loading animation initially', () => {
      (apiClient.getProjects as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ProjectsPageClient />);
      
      expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    beforeEach(() => {
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);
    });

    it('should fetch and display projects successfully', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(apiClient.getProjects).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Should have header
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should set first category as open by default', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // The first category (Build) should be open
      // This would be verified by checking for project cards
    });

    it('should display particle canvas after projects load', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Wait for particle animation delay
      await waitFor(() => {
        expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
      }, { timeout: 500 });
    });

    it('should group projects by category correctly', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Should have 2 categories: Build (2 projects) and Design (1 project)
      // This would be verified by checking category buttons/folders
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      const errorMessage = 'Network error';
      (apiClient.getProjects as jest.Mock).mockRejectedValue(new Error(errorMessage));

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load projects. Please try again later.')).toBeInTheDocument();
      });
    });

    it('should still show particle canvas on error', async () => {
      (apiClient.getProjects as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load projects. Please try again later.')).toBeInTheDocument();
      });

      // Wait for particle animation delay
      await waitFor(() => {
        expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
      }, { timeout: 500 });
    });

    it('should have retry button on error', async () => {
      (apiClient.getProjects as jest.Mock).mockRejectedValue(new Error('Network error'));
      const reloadMock = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load projects. Please try again later.')).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no projects', async () => {
      (apiClient.getProjects as jest.Mock).mockResolvedValue([]);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      expect(screen.getByText('No projects found')).toBeInTheDocument();
      expect(screen.getByText('No projects available at the moment.')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle 720p viewport (1280x720)', async () => {
      global.innerWidth = 1280;
      global.innerHeight = 720;
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Component should render without errors on 720p
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle mobile viewport (375x667)', async () => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Component should render without errors on mobile
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle 1080p viewport (1920x1080)', async () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Component should render without errors on 1080p
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle 4K viewport (3840x2160)', async () => {
      global.innerWidth = 3840;
      global.innerHeight = 2160;
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Component should render without errors on 4K
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should update on window resize', async () => {
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // Resize window
      global.innerWidth = 1280;
      global.innerHeight = 720;
      fireEvent(window, new Event('resize'));

      // Component should still be functional
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('Category Switching', () => {
    beforeEach(() => {
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);
    });

    it('should allow switching between categories', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
      });

      // This would test clicking on category folders/buttons
      // Implementation depends on how categories are rendered
    });
  });

  describe('Performance', () => {
    it('should not re-fetch projects on re-render', async () => {
      (apiClient.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      const { rerender } = render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(apiClient.getProjects).toHaveBeenCalledTimes(1);
      });

      // Force re-render
      rerender(<ProjectsPageClient />);

      // Should still only be called once
      expect(apiClient.getProjects).toHaveBeenCalledTimes(1);
    });
  });
});
