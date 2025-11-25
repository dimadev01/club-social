import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { TraceService } from './trace.service';

const X_REQUEST_ID = 'x-request-id';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  public constructor(private readonly traceService: TraceService) {}

  public use(req: Request, res: Response, next: NextFunction) {
    let traceId = req.headers[X_REQUEST_ID]?.toString();

    traceId ??= this.traceService.create();

    res.setHeader(X_REQUEST_ID, traceId);

    this.traceService.run(traceId, () => {
      next();
    });
  }
}
