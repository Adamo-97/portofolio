// __tests__/lib/fetch-client.test.ts
import { fetchWithRetry, apiClient, FetchError } from '@/lib/utils/fetch-client';

// Mock global fetch
global.fetch = jest.fn();

describe('fetch-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('fetchWithRetry', () => {
    it('should successfully fetch data on first attempt', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchWithRetry('/api/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on network failure', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      // Fail twice, succeed on third
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

      const promise = fetchWithRetry('/api/test', { retries: 2, retryDelay: 100 });

      // Fast-forward timers for retries
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);

      const result = await promise;

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on 4xx errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchWithRetry('/api/test', { retries: 2 })).rejects.toThrow(FetchError);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on 5xx errors', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

      const promise = fetchWithRetry('/api/test', { retries: 1, retryDelay: 100 });
      
      await jest.advanceTimersByTimeAsync(100);
      const result = await promise;

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should timeout after specified duration', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 20000))
      );

      const promise = fetchWithRetry('/api/test', { timeout: 1000, retries: 0 });

      await jest.advanceTimersByTimeAsync(1000);

      await expect(promise).rejects.toThrow();
    });

    it('should throw error after max retries', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const promise = fetchWithRetry('/api/test', { retries: 2, retryDelay: 100 });

      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);

      await expect(promise).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

      const promise = fetchWithRetry('/api/test', { retries: 2, retryDelay: 100 });

      // First retry: 100ms
      await jest.advanceTimersByTimeAsync(100);
      
      // Second retry: 200ms (exponential)
      await jest.advanceTimersByTimeAsync(200);

      const result = await promise;
      expect(result).toEqual(mockData);
    });
  });

  describe('apiClient', () => {
    beforeEach(() => {
      jest.useRealTimers(); // Use real timers for apiClient tests
    });

    describe('getSkills', () => {
      it('should fetch skills successfully', async () => {
        const mockSkills = [{ id: '1', name: 'React', category: 'Frontend' }];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockSkills,
        });

        const result = await apiClient.getSkills();

        expect(result).toEqual(mockSkills);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/skills',
          expect.objectContaining({ next: { revalidate: 3600 } })
        );
      });

      it('should handle fetch errors', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        });

        await expect(apiClient.getSkills()).rejects.toThrow(FetchError);
      });
    });

    describe('getSkillCategories', () => {
      it('should fetch skill categories successfully', async () => {
        const mockCategories = [
          { key: 'frontend', title: 'Frontend', blurb: 'UI technologies' },
        ];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCategories,
        });

        const result = await apiClient.getSkillCategories();

        expect(result).toEqual(mockCategories);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/skill-categories',
          expect.objectContaining({ next: { revalidate: 3600 } })
        );
      });
    });

    describe('getProjects', () => {
      it('should fetch projects without category filter', async () => {
        const mockProjects = [
          { id: '1', title: 'Project 1', category: 'Build' },
        ];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockProjects,
        });

        const result = await apiClient.getProjects();

        expect(result).toEqual(mockProjects);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/project',
          expect.objectContaining({ next: { revalidate: 3600 } })
        );
      });

      it('should fetch projects with category filter', async () => {
        const mockProjects = [
          { id: '1', title: 'Project 1', category: 'Build' },
        ];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockProjects,
        });

        const result = await apiClient.getProjects('Build');

        expect(result).toEqual(mockProjects);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/project?category=Build',
          expect.objectContaining({ next: { revalidate: 3600 } })
        );
      });

      it('should encode category parameter', async () => {
        const mockProjects: any[] = [];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockProjects,
        });

        await apiClient.getProjects('Category & Special');

        expect(global.fetch).toHaveBeenCalledWith(
          '/api/project?category=Category%20%26%20Special',
          expect.any(Object)
        );
      });
    });

    describe('getRoadmap', () => {
      it('should fetch roadmap successfully', async () => {
        const mockRoadmap = [
          { id: '1', title: 'Milestone 1', from: '2024-01-01' },
        ];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockRoadmap,
        });

        const result = await apiClient.getRoadmap();

        expect(result).toEqual(mockRoadmap);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/roadmap',
          expect.objectContaining({ next: { revalidate: 3600 } })
        );
      });
    });

    describe('getContactSocials', () => {
      it('should fetch contact socials successfully', async () => {
        const mockSocials = [
          { id: '1', title: 'GitHub', href: 'https://github.com' },
        ];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockSocials,
        });

        const result = await apiClient.getContactSocials();

        expect(result).toEqual(mockSocials);
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/contact',
          expect.objectContaining({ next: { revalidate: 3600 } })
        );
      });
    });
  });

  describe('FetchError', () => {
    it('should create error with message and status', () => {
      const error = new FetchError('Not found', 404);

      expect(error.message).toBe('Not found');
      expect(error.status).toBe(404);
      expect(error.name).toBe('FetchError');
    });

    it('should create error with code', () => {
      const error = new FetchError('Database error', 500, 'DB_ERROR');

      expect(error.message).toBe('Database error');
      expect(error.status).toBe(500);
      expect(error.code).toBe('DB_ERROR');
    });
  });
});
