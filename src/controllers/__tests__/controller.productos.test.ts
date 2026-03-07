import { NextFunction, Request, Response } from 'express';
import { ControllerProductos } from '../controller.productos';

const crearRes = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    locals: {},
  } as unknown as Response;
  return res;
};

describe('ControllerProductos', () => {
  let controller: ControllerProductos;
  let serviceMock: any;
  let next: NextFunction;

  beforeEach(() => {
    controller = new ControllerProductos();
    serviceMock = {
      serviceListarProductos: jest.fn(),
      serviceDetalleProductoPorId: jest.fn(),
      serviceCompararProductos: jest.fn(),
    };
    (controller as any).servicioProductos = serviceMock;
    next = jest.fn();
  });

  it('controllerListarProductos usa campos normalizados de locals', async () => {
    const req = { query: { campos: 'nombre' } } as unknown as Request;
    const res = crearRes();
    (res.locals as any).queryValidada = { campos: 'id,nombre' };
    serviceMock.serviceListarProductos.mockResolvedValue({ estado: true, datos: [] });

    await controller.controllerListarProductos(req, res, next);

    expect(serviceMock.serviceListarProductos).toHaveBeenCalledWith('id,nombre');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('controllerDetalleProductoPorId envia id y campos al servicio', async () => {
    const req = { params: { id: '3' }, query: { campos: 'precio' } } as unknown as Request;
    const res = crearRes();
    serviceMock.serviceDetalleProductoPorId.mockResolvedValue({ estado: true, datos: { id: 3 } });

    await controller.controllerDetalleProductoPorId(req, res, next);

    expect(serviceMock.serviceDetalleProductoPorId).toHaveBeenCalledWith('3', 'precio');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('controllerCompararProductos usa ids/campos normalizados de locals', async () => {
    const req = { query: { ids: '1, 2', campos: 'nombre,precio' } } as unknown as Request;
    const res = crearRes();
    (res.locals as any).queryValidada = { ids: '1,2', campos: 'nombre,precio' };
    serviceMock.serviceCompararProductos.mockResolvedValue({ estado: true, datos: [{ id: 1 }, { id: 2 }] });

    await controller.controllerCompararProductos(req, res, next);

    expect(serviceMock.serviceCompararProductos).toHaveBeenCalledWith({ ids: '1,2', campos: 'nombre,precio' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('controllerCompararProductos delega errores al next', async () => {
    const req = { query: { ids: '1,2' } } as unknown as Request;
    const res = crearRes();
    const error = new Error('boom');
    serviceMock.serviceCompararProductos.mockRejectedValue(error);

    await controller.controllerCompararProductos(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
