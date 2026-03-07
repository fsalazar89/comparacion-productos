import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.APP_VERSION = '/api/v1';
process.env.AMBIENTE_APP = 'local';
process.env.REQUEST_TIMEOUT = '10s';
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_STATIC_TOKEN = jwt.sign({ sub: 'comparacion-productos', scope: 'api:read' }, process.env.JWT_SECRET);

jest.mock('../../config/db/db.challenge', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    query: jest.fn(),
  },
}));

import { app } from '../../app';
import pool from '../../config/db/db.challenge';

describe('Integracion API productos', () => {
  const mockedPool = pool as unknown as { connect: jest.Mock; query: jest.Mock };
  const authHeader = `Bearer ${process.env.JWT_STATIC_TOKEN}`;
  let releaseMock: jest.Mock;

  beforeEach(() => {
    releaseMock = jest.fn();
    mockedPool.connect.mockResolvedValue({ release: releaseMock });
    mockedPool.query.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/ responde estado del servicio', async () => {
    const response = await request(app).get('/api/v1/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      estado: true,
      mensaje: 'Modelo Inicial Activo',
      datos: null,
    });
  });

  it('GET /api/v1/productos lista productos con campos filtrados', async () => {
    mockedPool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'iPhone 15 Pro' }] });

    const response = await request(app)
      .get('/api/v1/productos?campos=id,nombre')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(200);
    expect(response.body.estado).toBe(true);
    expect(response.body.datos).toEqual([{ id: 1, nombre: 'iPhone 15 Pro' }]);
    expect(mockedPool.query).toHaveBeenCalledWith('SELECT id, nombre FROM productos');
    expect(releaseMock).toHaveBeenCalled();
  });

  it('GET /api/v1/productos retorna 422 para campos invalidos', async () => {
    const response = await request(app)
      .get('/api/v1/productos?campos=id,no_existe')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(422);
    expect(response.body).toEqual(
      expect.objectContaining({
        estado: false,
        mensaje: "El parametro 'campos' contiene atributos no permitidos",
      })
    );
  });

  it('GET /api/v1/productos/:id retorna 400 para id invalido', async () => {
    const response = await request(app)
      .get('/api/v1/productos/abc')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      estado: false,
      mensaje: "El parametro 'id' debe ser un entero positivo",
    });
  });

  it('GET /api/v1/productos/:id retorna 404 si no existe', async () => {
    mockedPool.query.mockResolvedValue({ rows: [] });

    const response = await request(app)
      .get('/api/v1/productos/999')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(404);
    expect(response.body.estado).toBe(false);
    expect(response.body.mensaje).toBe('Producto no encontrado');
    expect(releaseMock).toHaveBeenCalled();
  });

  it('GET /api/v1/productos/comparar compara productos validos', async () => {
    mockedPool.query.mockResolvedValue({ rows: [{ id: 1, nombre: 'iPhone' }, { id: 2, nombre: 'Samsung' }] });

    const response = await request(app)
      .get('/api/v1/productos/comparar?ids=1,2&campos=id,nombre')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(200);
    expect(response.body.estado).toBe(true);
    expect(response.body.datos).toEqual([{ id: 1, nombre: 'iPhone' }, { id: 2, nombre: 'Samsung' }]);
    expect(mockedPool.query).toHaveBeenCalledWith(
      'SELECT id, nombre FROM productos WHERE id IN ($1, $2)',
      ['1', '2']
    );
  });

  it('GET /api/v1/productos/comparar retorna 400 cuando falta ids', async () => {
    const response = await request(app)
      .get('/api/v1/productos/comparar')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      estado: false,
      mensaje: "El parametro 'ids' es obligatorio",
    });
  });

  it('GET /api/v1/productos/comparar retorna 422 para ids invalidos', async () => {
    const response = await request(app)
      .get('/api/v1/productos/comparar?ids=1,abc')
      .set('Uthorization', authHeader);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      estado: false,
      mensaje: "El parametro 'ids' contiene valores invalidos",
      datos: { invalidIds: ['abc'] },
    });
  });

  it('GET /api/v1/openapi.json responde especificacion', async () => {
    const response = await request(app).get('/api/v1/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        openapi: '3.0.3',
        info: expect.objectContaining({ title: 'API Comparacion de Productos' }),
      })
    );
  });

  it('GET /api/v1/productos retorna 401 sin header Uthorization', async () => {
    const response = await request(app).get('/api/v1/productos');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      estado: false,
      mensaje: "Token requerido en header 'Uthorization' con formato Bearer",
    });
  });

  it('GET /api/v1/productos retorna 401 con token incorrecto', async () => {
    const response = await request(app)
      .get('/api/v1/productos')
      .set('Uthorization', 'Bearer token_invalido');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      estado: false,
      mensaje: 'Token no autorizado',
    });
  });
});
