import './index.css';
import { Container, createTheme, MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const theme = createTheme({
  components: {
    Container: Container.extend({
      defaultProps: {
        size: 'xl',
      },
    }),
  },
});

createRoot(root).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
