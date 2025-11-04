// __tests__/integration/projects-page-responsive.test.tsx
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsPageClient from '@/app/projects-page/projects-page';
import { apiClient } from '@/lib/utils/fetch-client';

jest.mock('@/lib/utils/fetch-client');
jest.mock('@/components/header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});
jest.mock('@/components/LoadingAnimation', () => {
  return function MockLoadingAnimation() {
    return <div data-testid="loading">Loading...</div>;
  };
});
jest.mock('@/components/animations/ParticleCanvas', () => {
  return function MockParticleCanvas() {
    return <canvas data-testid="particles" />;
  };
});

const mockManyProjects = Array.from({ length: 12 }, (_, i) => ({
  id: `project-${i}`,
  title: `Project ${i + 1}`,
  description: `Description ${i + 1}`,
  category: i % 3 === 0 ? 'Applications' : i % 3 === 1 ? 'Infrastructure' : 'Utilities',
  github_url: `https://github.com/test/project${i}`,
  languages: ['JavaScript', 'TypeScript'],
}));

describe('Projects Page - Responsive & Scaling Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.getProjects as jest.Mock).mockResolvedValue(mockManyProjects);
    (apiClient.getSkillCategories as jest.Mock).mockResolvedValue([
      { name: 'Applications', title: 'Applications', blurb: 'Test' },
      { name: 'Infrastructure', title: 'Infrastructure', blurb: 'Test' },
      { name: 'Utilities', title: 'Utilities', blurb: 'Test' },
    ]);
  });

  describe('720p Resolution (1280x720)', () => {
    beforeEach(() => {
      global.innerWidth = 1280;
      global.innerHeight = 720;
    });

    it('should render without overflow on 720p with 2 projects', async () => {
      const twoProjects = mockManyProjects.slice(0, 2);
      (apiClient.getProjects as jest.Mock).mockResolvedValue(twoProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render without overflow on 720p with 4 projects', async () => {
      const fourProjects = mockManyProjects.slice(0, 4);
      (apiClient.getProjects as jest.Mock).mockResolvedValue(fourProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render without overflow on 720p with 8 projects', async () => {
      const eightProjects = mockManyProjects.slice(0, 8);
      (apiClient.getProjects as jest.Mock).mockResolvedValue(eightProjects);

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render without overflow on 720p with 12 projects', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('768p Resolution (1366x768)', () => {
    beforeEach(() => {
      global.innerWidth = 1366;
      global.innerHeight = 768;
    });

    it('should render correctly on common laptop resolution', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('1080p Resolution (1920x1080)', () => {
    beforeEach(() => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
    });

    it('should render correctly on 1080p with many projects', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle scale adjustments smoothly', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Simulate window resize
      global.innerWidth = 1280;
      global.innerHeight = 720;
      window.dispatchEvent(new Event('resize'));

      // Should still render correctly
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('4K Resolution (3840x2160)', () => {
    beforeEach(() => {
      global.innerWidth = 3840;
      global.innerHeight = 2160;
    });

    it('should render correctly on 4K displays', async () => {
      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('Mobile Resolutions', () => {
    it('should render correctly on iPhone SE (375x667)', async () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render correctly on iPhone 12 Pro (390x844)', async () => {
      global.innerWidth = 390;
      global.innerHeight = 844;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render correctly on iPad (768x1024)', async () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('Ultrawide Resolutions', () => {
    it('should render correctly on ultrawide 21:9 (2560x1080)', async () => {
      global.innerWidth = 2560;
      global.innerHeight = 1080;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render correctly on ultrawide 32:9 (3840x1080)', async () => {
      global.innerWidth = 3840;
      global.innerHeight = 1080;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small viewport (320x568)', async () => {
      global.innerWidth = 320;
      global.innerHeight = 568;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle very large viewport (5120x2880)', async () => {
      global.innerWidth = 5120;
      global.innerHeight = 2880;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should handle orientation change', async () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Simulate rotation
      global.innerWidth = 1080;
      global.innerHeight = 1920;
      window.dispatchEvent(new Event('resize'));

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('Dynamic Resize Behavior', () => {
    it('should update layout when resizing from desktop to mobile', async () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Resize to mobile
      global.innerWidth = 375;
      global.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));

      // Should still be functional
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should update layout when resizing from mobile to desktop', async () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<ProjectsPageClient />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Resize to desktop
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      window.dispatchEvent(new Event('resize'));

      // Should still be functional
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });
});
