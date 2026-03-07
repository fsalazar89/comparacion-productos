import { ServicioProductos } from '../service.productos';

describe('ServicioProductos', () => {
  let servicio: ServicioProductos;
  let mockModel: any;

  beforeEach(() => {
    servicio = new ServicioProductos();
    mockModel = {
      modelListarProductos: jest.fn(),
      modelDetalleProductoPorId: jest.fn(),
      modelCompararProductos: jest.fn(),
    };
    (servicio as any).modelProductos = mockModel;
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('serviceListarProductos retorna estructura de exito', async () => {
    mockModel.modelListarProductos.mockResolvedValue({ estado: true, datos: [{ id: 1 }] });

    const result = await servicio.serviceListarProductos('id,nombre');

    expect(mockModel.modelListarProductos).toHaveBeenCalledWith('id,nombre');
    expect(result).toEqual({ estado: true, mensaje: 'Consulta Exitosa', datos: [{ id: 1 }] });
  });

  it('serviceListarProductos propaga error controlado del modelo', async () => {
    mockModel.modelListarProductos.mockResolvedValue({ estado: false, mensaje: 'fallo', status: 404 });

    await expect(servicio.serviceListarProductos()).rejects.toMatchObject({ message: 'fallo', status: 404 });
  });

  it('serviceDetalleProductoPorId retorna data cuando modelo responde exito', async () => {
    mockModel.modelDetalleProductoPorId.mockResolvedValue({ estado: true, datos: { id: 1 } });

    const result = await servicio.serviceDetalleProductoPorId('1', 'nombre,precio');

    expect(mockModel.modelDetalleProductoPorId).toHaveBeenCalledWith('1', 'nombre,precio');
    expect(result).toEqual({ estado: true, mensaje: 'Consulta Exitosa', datos: { id: 1 } });
  });

  it('serviceCompararProductos transforma errores inesperados en 500', async () => {
    mockModel.modelCompararProductos.mockRejectedValue(new Error('db down'));

    await expect(servicio.serviceCompararProductos({ ids: '1,2', campos: 'nombre' })).rejects.toMatchObject({
      message: 'Error interno al obtener los productos',
      status: 500,
    });
  });

  it('serviceCompararProductos propaga status del modelo', async () => {
    mockModel.modelCompararProductos.mockResolvedValue({ estado: false, mensaje: 'ids invalidos', status: 422 });

    await expect(servicio.serviceCompararProductos({ ids: 'x,y' })).rejects.toMatchObject({
      message: 'ids invalidos',
      status: 422,
    });
  });
});
