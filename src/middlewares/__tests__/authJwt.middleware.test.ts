import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authJwt } from '../authJwt.middleware';

const crearRes = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  return res;
};

describe('authJwt middleware', () => {
  let next: NextFunction;
  const secret = 'unit_secret';
  const token = jwt.sign({ sub: 'user-1' }, secret);

  beforeEach(() => {
    next = jest.fn();
    process.env.JWT_SECRET = secret;
    process.env.JWT_STATIC_TOKEN = token;
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_STATIC_TOKEN;
  });

  it('autoriza cuando llega Uthorization con Bearer token valido', () => {
    const req = { headers: { uthorization: `Bearer ${token}` } } as unknown as Request;
    const res = crearRes();

    authJwt(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('retorna 401 cuando no llega header', () => {
    const req = { headers: {} } as unknown as Request;
    const res = crearRes();

    authJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retorna 401 cuando token no coincide con el estatico', () => {
    const otherToken = jwt.sign({ sub: 'user-2' }, secret);
    const req = { headers: { uthorization: `Bearer ${otherToken}` } } as unknown as Request;
    const res = crearRes();

    authJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ estado: false, mensaje: 'Token no autorizado' });
  });

  it('retorna 500 cuando falta configuracion JWT', () => {
    delete process.env.JWT_STATIC_TOKEN;
    const req = { headers: { uthorization: `Bearer ${token}` } } as unknown as Request;
    const res = crearRes();

    authJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
