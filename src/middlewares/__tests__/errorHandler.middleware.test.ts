import { Request, Response } from 'express';
import { errorHandler } from '../errorHandler.middleware';

const crearRes = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  return res;
};

describe('errorHandler middleware', () => {
  const req = {} as Request;
  const next = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.AMBIENTE_APP;
  });

  it('retorna 503 para timeout', () => {
    process.env.AMBIENTE_APP = 'local';
    const err = { timeout: true, stack: 'trace' };
    const res = crearRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      estado: false,
      mensaje: 'Tiempo de espera agotado',
      datos: 'trace',
    });
  });

  it('usa status/message del error y no expone stack en produccion', () => {
    process.env.AMBIENTE_APP = 'produccion';
    const err = { status: 404, message: 'No encontrado', stack: 'trace' };
    const res = crearRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      estado: false,
      mensaje: 'No encontrado',
    });
  });
});
