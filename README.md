# Comparacion de Productos API

API REST para listar productos, consultar detalle y comparar articulos por atributos seleccionados.

## Arquitectura

- `routes`: define endpoints (`/`, `/productos`, `/productos/:id`, `/productos/comparar`).
- `controllers`: recibe request, delega al servicio y retorna respuesta HTTP.
- `services`: aplica reglas de negocio y orquesta modelo/errores.
- `models`: ejecuta consultas SQL contra `productos`.
- `middlewares`: timeout, manejo centralizado de errores, CORS y seguridad.
- `config/swagger.config.ts`: documentacion OpenAPI + UI Swagger.
- `config/db/db.challenge.ts`: conexion a PostgreSQL.

## Decisiones clave

- Contrato de respuesta consistente: `estado`, `mensaje`, `datos`.
- Seleccion de campos con `campos=nombre,precio,color` para enfocar comparaciones.
- Documentacion activa en Swagger para facilitar pruebas tecnicas.
- El endpoint de comparacion actualmente devuelve mensajes de IDs invalidos en `mensaje`, y en algunos casos puede responder `500` si faltan parametros.

## Setup rapido

1. Instala dependencias:
```bash
npm install
```

2. Configura variables de entorno (archivo `environments/.env.local`).

3. Ejecuta en local:
```bash
npm run local
```

Servidor esperado: `http://<DOMINIO>:<APP_PORT><APP_VERSION>`

## Documentacion API

- Swagger UI: `GET <APP_VERSION>/docs`
- OpenAPI JSON: `GET <APP_VERSION>/openapi.json`

Ejemplo comun en local:
- `http://localhost:3000/api/v1/docs`
- `http://localhost:3000/api/v1/openapi.json`

## Ejemplos curl

Listar productos:
```bash
curl "http://localhost:3000/api/v1/productos"
```

Listar productos solo con campos:
```bash
curl "http://localhost:3000/api/v1/productos?campos=id,nombre,precio,color"
```

Detalle por ID:
```bash
curl "http://localhost:3000/api/v1/productos/1"
```

Detalle por ID con campos:
```bash
curl "http://localhost:3000/api/v1/productos/1?campos=nombre,precio,bateria"
```

Comparar productos:
```bash
curl "http://localhost:3000/api/v1/productos/comparar?ids=1,2,3"
```

Comparar productos con campos:
```bash
curl "http://localhost:3000/api/v1/productos/comparar?ids=1,2,3&campos=nombre,precio,valoracion,bateria,camara"
```

## Respuestas de error actuales

- Formato: `estado`, `mensaje` y opcionalmente `datos` (stack en ambientes distintos de `produccion`).
- `GET /productos/:id`:
  - `400` si `id` no es numerico.
  - `404` si el producto no existe.
- `GET /productos/comparar`:
  - Si `ids` es invalido puede retornar `500` con mensaje de validacion de modelo.
