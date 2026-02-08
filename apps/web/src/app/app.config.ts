const environment = import.meta.env.VITE_ENVIRONMENT;

export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
  environment,
  isDevelopment: environment === 'development',
  isLocal: environment === 'local',
  isProduction: environment === 'production',
  posthog: {
    host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    key: import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  },
} as const;
