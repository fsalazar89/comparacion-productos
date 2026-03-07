import timeout from 'connect-timeout';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de timeout global
 * Corta requests que excedan el tiempo configurado
 */
export const timeoutMiddleware = [
    timeout(process.env.REQUEST_TIMEOUT || '10s'),
    (req: Request, res: Response, next: NextFunction) => {
        if ((req as any).timedout) {
            return res.status(503).json({
                message: 'Tiempo de espera agotado',
            });
        }
        next();
    },
];
