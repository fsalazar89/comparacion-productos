import timeout from 'connect-timeout';
import { Request, Response, NextFunction } from 'express';

export const timeoutMiddleware = timeout(process.env.REQUEST_TIMEOUT || '10s');

export function haltOnTimedout(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!((req as any).timedout)) {
        next();
    }
}
