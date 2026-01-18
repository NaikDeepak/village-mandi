import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { AppRoutes } from './AppRoutes';
import { AuthProvider } from './components/auth/AuthProvider';

export function render(url: string) {
  const queryClient = new QueryClient();
  const helmetContext = {};

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StaticRouter location={url}>
              <AppRoutes />
            </StaticRouter>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );

  return { html, helmet: (helmetContext as any).helmet };
}
