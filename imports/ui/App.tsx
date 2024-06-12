import React from 'react';
import GoogleFontLoader from 'react-google-font';

import { AntProvider } from '@ui/AntProvider';
import { AppLayout } from '@ui/AppLayout';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { UserProvider } from '@ui/providers/UserProvider';
import { QueryClientApp } from '@ui/QueryClientApp';
import { Routes } from '@ui/routes/Routes';

export const App = () => (
  <>
    <GoogleFontLoader
      fonts={[{ font: 'Rubik', weights: [300, 400, 500, 600] }]}
    />

    <ThemeProvider>
      <AppLayout>
        <UserProvider>
          <AntProvider>
            <QueryClientApp>
              <Routes />
            </QueryClientApp>
          </AntProvider>
        </UserProvider>
      </AppLayout>
    </ThemeProvider>
  </>
);
