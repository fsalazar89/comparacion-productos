import { Request, Response, NextFunction } from 'express';
import { ValidacionCampos } from '../validacion.campos';

type MockResponse = Response & {
  status: jest.Mock;
  json: jest.Mock;
  locals: Record<string, any>;
};

const crearReq = (query: Record<string, any> = {}, params: Record<string, any> = {}): Request => {
  return { query, params } as Request;
};

const crearRes = (): MockResponse => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    locals: {},
  } as unknown as MockResponse;

  return res;
};

describe('ValidacionCampos middleware', () => {
  const middleware = new ValidacionCampos();
  let next: NextFunction;

  beforeEach(() => {
    next = jest.fn();
  });

  describe('validarCamposOpcional', () => {
    it('normaliza campos validos y continua', () => {
      const req = crearReq({ campos: ' nombre,precio,precio,color ' });
      const res = crearRes();

      middleware.validarCamposOpcional(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.locals.queryValidada.campos).toBe('nombre,precio,color');
      expect(res.status).not.toHaveBeenCalled();
    });

    it('retorna 422 cuando campos contiene atributos no permitidos', () => {
      const req = crearReq({ campos: 'nombre,no_existe,precio' });
      const res = crearRes();

      middleware.validarCamposOpcional(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          estado: false,
          mensaje: "El parametro 'campos' contiene atributos no permitidos",
        })
      );
    });
  });

  describe('validarIdRuta', () => {
    it('continua cuando id es entero positivo', () => {
      const req = crearReq({}, { id: '15' });
      const res = crearRes();

      middleware.validarIdRuta(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('retorna 400 cuando id no es valido', () => {
      const req = crearReq({}, { id: 'abc' });
      const res = crearRes();

      middleware.validarIdRuta(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        estado: false,
        mensaje: "El parametro 'id' debe ser un entero positivo",
      });
    });
  });

  describe('validarComparacion', () => {
    it('normaliza ids y campos validos y continua', () => {
      const req = crearReq({ ids: '1, 2,3', campos: 'nombre,precio,precio' });
      const res = crearRes();

      middleware.validarComparacion(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.locals.queryValidada).toEqual({
        ids: '1,2,3',
        campos: 'nombre,precio',
      });
    });

    it('retorna 400 cuando ids es obligatorio', () => {
      const req = crearReq({ campos: 'nombre,precio' });
      const res = crearRes();

      middleware.validarComparacion(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        estado: false,
        mensaje: "El parametro 'ids' es obligatorio",
      });
    });

    it('retorna 422 cuando ids tiene menos de 2 elementos', () => {
      const req = crearReq({ ids: '1' });
      const res = crearRes();

      middleware.validarComparacion(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        estado: false,
        mensaje: "El parametro 'ids' debe incluir al menos 2 IDs",
      });
    });

    it('retorna 422 cuando ids contiene valores invalidos', () => {
      const req = crearReq({ ids: '1,abc,3' });
      const res = crearRes();

      middleware.validarComparacion(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        estado: false,
        mensaje: "El parametro 'ids' contiene valores invalidos",
        datos: { invalidIds: ['abc'] },
      });
    });
  });
});
