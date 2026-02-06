import type { ReactNode } from 'react';

import 'dayjs/locale/es';
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import posthogJs from 'posthog-js';

import { AntProvider } from './AntProvider';
import { appConfig } from './app.config';
import { AppContextProvider } from './AppContextProvider';
import { AppRoutes } from './AppRoutes';

dayjs.locale('es');
dayjs.extend(utc);
dayjs.extend(relativeTime);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

if (appConfig.isProduction) {
  if (!appConfig.posthog.key) {
    throw new Error('VITE_PUBLIC_POSTHOG_KEY is not set');
  }

  posthogJs.init(appConfig.posthog.key, {
    api_host: appConfig.posthog.host,
    defaults: '2025-11-30',
    person_profiles: 'identified_only',
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
      maskTextSelector: '*',
    },
  });
}

export function App() {
  return (
    <PostHogWrapper>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <AntProvider>
            <AppRoutes />
          </AntProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </PostHogWrapper>
  );
}

function PostHogWrapper({ children }: { children: ReactNode }) {
  if (!appConfig.isProduction) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthogJs}>
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </PostHogProvider>
  );
}
