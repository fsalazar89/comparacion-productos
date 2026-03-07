import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

const appVersion = process.env.APP_VERSION || '/api/v1';

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Comparacion de Productos',
    version: '1.0.0',
    description: 'API para listar, consultar detalle y comparar productos con seleccion de campos.',
  },
  servers: [
    {
      url: appVersion,
      description: 'Base path de la API',
    },
  ],
  tags: [
    { name: 'Inicial', description: 'Endpoint de verificacion de estado' },
    { name: 'Productos', description: 'Consulta y comparacion de productos' },
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'iPhone 15 Pro' },
          descripcion: { type: 'string', example: 'Diseno de titanio, chip A17 Pro' },
          precio: { type: 'number', format: 'float', example: 999.99 },
          valoracion: { type: 'number', format: 'float', example: 4.8 },
          tamano: { type: 'string', example: '6.1 pulgadas' },
          peso: { type: 'number', format: 'float', example: 0.187 },
          color: { type: 'string', example: 'Titanio Natural' },
          url_imagen: { type: 'string', format: 'uri', example: 'https://example.com/iphone15.jpg' },
          tipo: { type: 'string', example: 'smartphone' },
          marca: { type: 'string', example: 'Apple' },
          modelo_version: { type: 'string', example: '15 Pro' },
          sistema_operativo: { type: 'string', example: 'iOS 17' },
          bateria: { type: 'string', example: '3274 mAh' },
          camara: { type: 'string', example: '48MP Main' },
          memoria: { type: 'string', example: '8 GB' },
          almacenamiento: { type: 'string', example: '128 GB' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          estado: { type: 'boolean', example: true },
          mensaje: { type: 'string', example: 'Consulta Exitosa' },
          datos: {},
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          estado: { type: 'boolean', example: false },
          mensaje: { type: 'string', example: 'Error interno' },
          datos: {},
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Inicial'],
        summary: 'Verificar estado del servicio',
        responses: {
          '200': {
            description: 'Servicio activo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '400': {
            description: 'Error al consultar datos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Error inesperado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/productos': {
      get: {
        tags: ['Productos'],
        summary: 'Listar productos',
        parameters: [
          {
            in: 'query',
            name: 'campos',
            required: false,
            schema: { type: 'string' },
            description: 'Campos separados por coma. Ejemplo: nombre,precio,color',
          },
        ],
        responses: {
          '200': {
            description: 'Listado de productos',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        datos: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '422': {
            description: "Parametro 'campos' invalido",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Error interno',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/productos/{id}': {
      get: {
        tags: ['Productos'],
        summary: 'Obtener detalle de producto por ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'ID del producto',
          },
          {
            in: 'query',
            name: 'campos',
            required: false,
            schema: { type: 'string' },
            description: 'Campos separados por coma. Ejemplo: nombre,precio,color',
          },
        ],
        responses: {
          '200': {
            description: 'Detalle de producto',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        datos: { $ref: '#/components/schemas/Product' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: "Parametro 'id' invalido",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: "Parametro 'campos' invalido",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Producto no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Error interno',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/productos/comparar': {
      get: {
        tags: ['Productos'],
        summary: 'Comparar productos por IDs',
        parameters: [
          {
            in: 'query',
            name: 'ids',
            required: true,
            schema: { type: 'string' },
            description: 'IDs separados por coma. Ejemplo: 1,2,3',
          },
          {
            in: 'query',
            name: 'campos',
            required: false,
            schema: { type: 'string' },
            description: 'Campos separados por coma. Ejemplo: nombre,precio,bateria',
          },
        ],
        responses: {
          '200': {
            description: 'Productos para comparar',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        datos: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '500': {
            description: 'Error interno',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '400': {
            description: "Parametro 'ids' obligatorio",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: "Parametros 'ids' o 'campos' invalidos",
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerRouter = Router();

swaggerRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
swaggerRouter.get('/openapi.json', (_req: Request, res: Response) => {
  res.status(200).json(openApiSpec);
});
