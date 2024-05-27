import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { App } from 'antd';
import React, { PropsWithChildren, useState } from 'react';

import { UiNotificationUtils } from './utils/messages.utils';

export const QueryClientApp: React.FC<PropsWithChildren> = ({ children }) => {
  const { notification } = App.useApp();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
        queryCache: new QueryCache({
          onError: (error: unknown) => {
            if (error instanceof Meteor.Error && error.reason) {
              UiNotificationUtils.error(notification, error.reason);
            } else {
              UiNotificationUtils.error(
                notification,
                'An unknown error occurred.',
              );
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {!Meteor.isProduction && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
