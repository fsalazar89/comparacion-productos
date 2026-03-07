import { ModelProductos } from '../model.productos';
import pool from '../../config/db/db.challenge';

jest.mock('../../config/db/db.challenge', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    query: jest.fn(),
  },
}));

describe('ModelProductos', () => {
  const mockedPool = pool as unknown as { connect: jest.Mock; query: jest.Mock };
  let model: ModelProductos;
  let releaseMock: jest.Mock;

  beforeEach(() => {
    model = new ModelProductos();
    releaseMock = jest.fn();
    mockedPool.connect.mockResolvedValue({ release: releaseMock });
    mockedPool.query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('modelListarProductos construye SELECT con campos permitidos', async () => {
    mockedPool.query.mockResolvedValue({ rows: [{ nombre: 'x', precio: 1 }] });

    const result = await model.modelListarProductos('nombre,precio,no_permitido');

    expect(mockedPool.query).toHaveBeenCalledWith('SELECT nombre, precio FROM productos');
    expect(result.estado).toBe(true);
    expect(releaseMock).toHaveBeenCalled();
  });

  it('modelListarProductos retorna error controlado si falla query', async () => {
    mockedPool.query.mockRejectedValue(new Error('db error'));

    const result = await model.modelListarProductos();

    expect(result.estado).toBe(false);
    expect(result.mensaje).toBe('Error al listar productos');
    expect(releaseMock).toHaveBeenCalled();
  });

  it('modelDetalleProductoPorId retorna 400 para id no numerico', async () => {
    const result = await model.modelDetalleProductoPorId('abc');

    expect(result).toEqual({ estado: false, mensaje: 'ID no válido', status: 400 });
  });

  it('modelDetalleProductoPorId retorna 404 cuando no encuentra registros', async () => {
    mockedPool.query.mockResolvedValue({ rows: [] });

    const result = await model.modelDetalleProductoPorId('99');

    expect(result).toEqual({ estado: false, mensaje: 'Producto no encontrado', status: 404 });
    expect(releaseMock).toHaveBeenCalled();
  });

  it('modelDetalleProductoPorId retorna registro cuando existe', async () => {
    mockedPool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'iPhone' }] });

    const result = await model.modelDetalleProductoPorId('1', 'id,nombre');

    expect(mockedPool.query).toHaveBeenCalledWith('SELECT id, nombre FROM productos WHERE id = $1', ['1']);
    expect(result).toEqual({ estado: true, datos: { id: 1, nombre: 'iPhone' } });
  });

  it('modelCompararProductos filtra ids invalidos y retorna mensaje parcial', async () => {
    mockedPool.query.mockResolvedValue({ rows: [{ id: 1 }, { id: 3 }] });

    const result = await model.modelCompararProductos('1,abc,3', 'id,nombre');

    expect(mockedPool.query).toHaveBeenCalledWith('SELECT id, nombre FROM productos WHERE id IN ($1, $2)', ['1', '3']);
    expect(result).toEqual({
      estado: true,
      mensaje: 'Algunos IDs eran invalidos',
      datos: [{ id: 1 }, { id: 3 }],
    });
  });

  it('modelCompararProductos retorna error cuando no hay ids validos', async () => {
    const result = await model.modelCompararProductos('abc,xyz');

    expect(result.estado).toBe(false);
    expect(result.mensaje).toBe('No se enviaron lista IDs validos');
    expect(releaseMock).toHaveBeenCalled();
  });
});
