import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';

const POSTHOG_LOGS_ENDPOINT = 'https://us.i.posthog.com/i/v1/logs';

export function createPosthogTransport(
  posthogApiKey: string,
  environment: string,
): OpenTelemetryTransportV3 {
  const loggerProvider = new LoggerProvider({
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          headers: { Authorization: `Bearer ${posthogApiKey}` },
          url: POSTHOG_LOGS_ENDPOINT,
        }),
      ),
    ],
    resource: resourceFromAttributes({
      'deployment.environment.name': environment,
      'service.name': 'club-social-api',
    }),
  });

  logs.setGlobalLoggerProvider(loggerProvider);

  return new OpenTelemetryTransportV3();
}
