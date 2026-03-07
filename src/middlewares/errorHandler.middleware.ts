import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    const isTimeoutError =
        err?.timeout === true ||
        err?.code === 'ETIMEDOUT' ||
        err?.message === 'Response timeout';
    const status = isTimeoutError ? 503 : err?.status || 500;
    const message = isTimeoutError
        ? 'Tiempo de espera agotado'
        : err?.message || 'Error interno';

    res.status(status).json({
        estado: false,
        mensaje: message,
        ...(process.env.AMBIENTE_APP !== 'local' && {
            datos: err.stack,
        }),
    });
}
