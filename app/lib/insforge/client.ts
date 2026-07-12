import { createBrowserClient } from '@insforge/sdk/ssr';

export const insforge = createBrowserClient({
  fetch: async (input, init) => {
    let url = typeof input === "string" ? input : input instanceof Request ? input.url : input.toString();

    // Intercept and resolve relative /api/auth/refresh URLs to prevent Node.js fetch from throwing on the server during SSR
    // and to ensure they go to the local Next.js server instead of the backend in the browser.
    if (url.includes('/api/auth/refresh')) {
      const origin = typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

      const localUrl = new URL('/api/auth/refresh', origin).toString();

      // Ensure credentials are included so session cookies are sent/received
      const newInit = {
        ...init,
        credentials: 'include' as const
      };

      return fetch(localUrl, newInit);
    }

    return fetch(input, init);
  }
});
