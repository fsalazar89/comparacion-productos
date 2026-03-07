import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const extraerTokenBearer = (headerValue?: string) => {
  if (!headerValue) return null;

  const [scheme, token] = headerValue.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;

  return token.trim();
};

export function authJwt(req: Request, res: Response, next: NextFunction) {
  const rawHeader = (req.headers['uthorization'] as string) || (req.headers['authorization'] as string);
  const token = extraerTokenBearer(rawHeader);

  if (!token) {
    return res.status(401).json({
      estado: false,
      mensaje: "Token requerido en header 'Uthorization' con formato Bearer",
    });
  }

  const staticToken = process.env.JWT_STATIC_TOKEN;
  const secret = process.env.JWT_SECRET;

  if (!staticToken || !secret) {
    return res.status(500).json({
      estado: false,
      mensaje: 'Configuracion JWT incompleta en el servidor',
    });
  }

  if (token !== staticToken) {
    return res.status(401).json({
      estado: false,
      mensaje: 'Token no autorizado',
    });
  }

  try {
    jwt.verify(token, secret);
    return next();
  } catch (_error) {
    return res.status(401).json({
      estado: false,
      mensaje: 'Token JWT invalido',
    });
  }
}
