import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableLogs: true,
  environment: process.env.ENVIRONMENT,
  integrations: [nodeProfilingIntegration()],
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
