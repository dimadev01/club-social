import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import GoogleFontLoader from 'react-google-font';

import { AntProvider } from '@ui/AntProvider';
import { AppLayout } from '@ui/AppLayout';
import { LoadingScreen } from '@ui/components/LoadingScreen';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { UserProvider } from '@ui/providers/UserProvider';
import { QueryClientApp } from '@ui/QueryClientApp';
import { Routes } from '@ui/routes/Routes';

export const App = () => {
  const { isLoggingIn } = useTracker(() => ({
    isLoggingIn: Meteor.loggingIn(),
  }));

  if (isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <>
      <GoogleFontLoader fonts={[{ font: 'Rubik', weights: [300, 400, 500] }]} />

      <UserProvider>
        <ThemeProvider>
          <AntProvider>
            <AppLayout>
              <QueryClientApp>
                <Routes />
              </QueryClientApp>
            </AppLayout>
          </AntProvider>
        </ThemeProvider>
      </UserProvider>
    </>
  );
};
