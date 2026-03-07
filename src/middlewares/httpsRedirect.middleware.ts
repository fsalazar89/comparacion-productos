import { Request, Response, NextFunction } from 'express';

export function httpsRedirect(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (
        process.env.AMBIENTE_APP === 'produccion' &&
        req.headers['x-forwarded-proto'] !== 'https'
    ) {
        return res.redirect(
            301,
            'https://' + req.headers.host + req.url
        );
    }

    next();
}
