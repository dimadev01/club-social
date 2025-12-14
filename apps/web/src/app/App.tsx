import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useLocalStorage } from 'react-use';

import { AntProvider } from './AntProvider';
import { APP_THEME_MODE, AppContext, type AppThemeMode } from './AppContext';
import { AppRoutes } from './AppRoutes';
import 'dayjs/locale/es';

dayjs.locale('es');
dayjs.extend(utc);

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function App() {
  const [themeMode = APP_THEME_MODE.AUTO, setThemeMode] =
    useLocalStorage<AppThemeMode>('theme', APP_THEME_MODE.AUTO);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ setThemeMode, themeMode }}>
        <AntProvider>
          <AppRoutes />
        </AntProvider>
      </AppContext.Provider>
      <ReactQueryDevtools buttonPosition="top-right" initialIsOpen={false} />
    </QueryClientProvider>
  );
}
