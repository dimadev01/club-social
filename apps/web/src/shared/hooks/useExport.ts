import { usePostHog } from '@posthog/react';
import { message } from 'antd';
import { useCallback, useState } from 'react';

import type { ExportQuery } from '@/ui';

import { appConfig } from '@/app/app.config';
import { PostHogEvent } from '@/shared/lib/posthog-events';

interface UseExportOptions {
  endpoint: string;
  filename: string;
}

interface UseExportResult {
  exportData: (query: ExportQuery) => Promise<void>;
  isExporting: boolean;
}

export function useExport({
  endpoint,
  filename,
}: UseExportOptions): UseExportResult {
  const posthog = usePostHog();
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(
    async (query: ExportQuery) => {
      setIsExporting(true);

      try {
        // Build query string from export query
        const params = new URLSearchParams();

        params.append('filename', filename);

        Object.entries(query).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, value);
          }
        });

        const url = `${appConfig.apiUrl}${endpoint}?${params.toString()}`;

        const response = await fetch(url, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Export failed');
        }

        // Get blob from response
        const blob = await response.blob();

        // Create download link
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        message.success('Exportación completada');
        posthog.capture(PostHogEvent.DATA_EXPORTED, {
          endpoint,
          filename,
        });
      } catch (error) {
        message.error('Error al exportar');
      } finally {
        setIsExporting(false);
      }
    },
    [endpoint, filename, posthog],
  );

  return { exportData, isExporting };
}
