import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useLocalStorage } from 'react-use';

import { AntProvider } from './AntProvider';
import { AppContext, AppTheme, AppThemeMode } from './AppContext';
import { AppRoutes } from './AppRoutes';
import 'dayjs/locale/es';

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
  const [themeMode = AppThemeMode.AUTO, setThemeMode] =
    useLocalStorage<AppThemeMode>('theme-mode', AppThemeMode.AUTO);

  const [theme = AppTheme.LIGHT, setTheme] = useLocalStorage<AppTheme>(
    'theme',
    AppTheme.LIGHT,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          appThemeMode: themeMode,
          setAppThemeMode: setThemeMode,
          setThemeMode: setTheme,
          themeMode: theme,
        }}
      >
        <AntProvider>
          <AppRoutes />
        </AntProvider>
      </AppContext.Provider>
      {/* <ReactQueryDevtools buttonPosition="top-right" initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
