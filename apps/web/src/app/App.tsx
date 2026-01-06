import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/es';

import { AntProvider } from './AntProvider';
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

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AntProvider>
          <AppRoutes />
        </AntProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
}
