import { format } from 'winston';

import { TraceService } from '@/infrastructure/trace/trace.service';

export const traceIdFormat = (traceService: TraceService) =>
  format((info) => {
    const traceId = traceService.get();

    if (traceId) {
      info.traceId = traceId;
    }

    return info;
  })();
