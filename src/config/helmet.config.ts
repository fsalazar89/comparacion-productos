import { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

export const configuracionesHelmet = (app: Application): void => {

  // Headers manuales adicionales
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    next();
  });

  // Content Security Policy
  const connectSrc = (process.env.HELMET_CONNECT_SRC || '')
  .split(',')
  .map(d => d.trim())
  .filter(Boolean);
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", ...connectSrc],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  // Referrer Policy
  app.use(
    helmet.referrerPolicy({
      policy: 'strict-origin-when-cross-origin',
    })
  );

  // Permissions-Policy (NO usar helmet.permissionsPolicy en v8)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Permissions-Policy',
      [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'fullscreen=(self)',
      ].join(', ')
    );
    next();
  });

  // Cross-Origin policies
  app.use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }));
  app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
  app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }));

  // Headers simples
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());

  // Eliminar headers sensibles
  app.disable('x-powered-by');
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('Server');
    next();
  });
};
