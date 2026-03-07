import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    const status = err.status || 500;

    res.status(status).json({
        message: 'Error interno',
        ...(process.env.AMBIENTE_APP !== 'produccion' && {
            stack: err.stack,
        }),
    });
}
