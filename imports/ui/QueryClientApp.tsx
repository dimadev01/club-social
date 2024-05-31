import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/lib/devtools';
import { Typography } from 'antd';
import React, { PropsWithChildren, useState } from 'react';
import ReactJson from 'react-json-view';

import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { AppThemeEnum } from '@ui/app.enum';
import { useThemeContext } from '@ui/AppContext';
import { useModalError } from '@ui/hooks/useModalError';
import { useNotificationError } from '@ui/hooks/useNotification';

export const QueryClientApp: React.FC<PropsWithChildren> = ({ children }) => {
  const notificationError = useNotificationError();

  const modalError = useModalError();

  const { theme } = useThemeContext();

  const onError = (error: unknown) => {
    if (error instanceof Meteor.Error && error.reason) {
      if (error.error === MeteorErrorCodeEnum.INTERNAL_SERVER_ERROR) {
        modalError({
          content: (
            <>
              <Typography.Paragraph>{error.message}</Typography.Paragraph>
              {error.details && (
                <ReactJson
                  theme={theme === AppThemeEnum.DARK ? 'monokai' : undefined}
                  src={JSON.parse(error.details)}
                />
              )}
            </>
          ),
          title: 'Internal Server Error',
        });
      } else {
        notificationError({ message: error.reason });
      }
    } else {
      notificationError({ message: 'An unknown error occurred.' });
    }
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
        mutationCache: new MutationCache({ onError }),
        queryCache: new QueryCache({ onError }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {!Meteor.isProduction && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
