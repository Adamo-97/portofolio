// lib/utils/fetch-client.ts
/**
 * Client-side fetch utilities with built-in error handling and retry logic
 */

export class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "FetchError";
  }
}

interface FetchOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Fetch with automatic retry and timeout
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { retries = 2, retryDelay = 1000, timeout = 10000 } = options;
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        // Use default Next.js caching - respects revalidate tags
        next: { revalidate: 3600 }, // 1 hour default
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on 4xx errors (client errors)
      if (error instanceof FetchError && error.status && error.status < 500) {
        throw error;
      }

      // Wait before retry (except on last attempt)
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }
  }

  throw lastError || new Error("Fetch failed");
}

/**
 * Type-safe API client for portfolio endpoints
 */
export const apiClient = {
  async getSkills() {
    return fetchWithRetry<any[]>("/api/skills");
  },

  async getSkillCategories() {
    return fetchWithRetry<Array<{ key: string; title: string; blurb: string }>>(
      "/api/skill-categories"
    );
  },

  async getProjects(category?: string) {
    const url = category ? `/api/project?category=${encodeURIComponent(category)}` : "/api/project";
    return fetchWithRetry<any[]>(url);
  },

  async getRoadmap() {
    return fetchWithRetry<any[]>("/api/roadmap");
  },

  async getContactSocials() {
    return fetchWithRetry<any[]>("/api/contact");
  },
};
