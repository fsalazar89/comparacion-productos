import { Request, Response } from 'express';
import { ControllerInicial } from '../controller.inicial';

const crearRes = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

describe('ControllerInicial', () => {
  let controller: ControllerInicial;
  let modelMock: any;

  beforeEach(() => {
    controller = new ControllerInicial();
    modelMock = { modelInicio: jest.fn() };
    (controller as any).modelInicial = modelMock;
  });

  it('retorna 200 cuando modelInicio responde estado true', async () => {
    const req = {} as Request;
    const res = crearRes();
    modelMock.modelInicio.mockResolvedValue({ estado: true, mensaje: 'ok', datos: null });

    await controller.controllerInicial(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ estado: true, mensaje: 'ok', datos: null });
  });

  it('retorna 400 cuando modelInicio responde estado false', async () => {
    const req = {} as Request;
    const res = crearRes();
    modelMock.modelInicio.mockResolvedValue({ estado: false, datos: { cause: 'x' } });

    await controller.controllerInicial(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      estado: false,
      mensaje: 'Error al consultar datos',
      datos: { cause: 'x' },
    });
  });

  it('retorna 500 cuando modelInicio lanza excepcion', async () => {
    const req = {} as Request;
    const res = crearRes();
    modelMock.modelInicio.mockRejectedValue(new Error('boom'));

    await controller.controllerInicial(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ estado: false, mensaje: 'Error inesperado' })
    );
  });
});
