import './index.css';
import { Container, createTheme, MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const theme = createTheme({
  colors: {
    green: [
      '#effbf2',
      '#ddf4e4',
      '#b6e9c4',
      '#8ddea2',
      '#6bd585',
      '#56cf73',
      '#4acc69',
      '#3bb458',
      '#32a04d',
      '#22883e',
    ],
  },
  components: {
    Container: Container.extend({
      defaultProps: {
        size: 'xl',
      },
    }),
  },
  primaryColor: 'green',
  primaryShade: 9,
});

createRoot(root).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
