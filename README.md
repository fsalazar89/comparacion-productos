# Comparacion de Productos API

API REST para listar productos, consultar detalle y comparar articulos por atributos seleccionados.

## Arquitectura

![Diagrama de Arquitectura](https://chevi.co/admin/imags/arquitecuta-api.png)

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
- Validacion de entrada con Joi en middleware (`id`, `ids`, `campos`) antes de llegar al controlador.

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

Definir token (valor de `JWT_STATIC_TOKEN`):
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb21wYXJhY2lvbi1wcm9kdWN0b3MiLCJzY29wZSI6ImFwaTpyZWFkIiwiaWF0IjoxNzcyOTE2NjA5fQ.iyBiXIlW7N6agW-3j3Ut-pgxtktAhhDFyjCpUSVmdws"
```

Listar productos:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/v1/productos"
```

Listar productos solo con campos:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/v1/productos?campos=id,nombre,precio,color"
```

Detalle por ID:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/v1/productos/1"
```

Detalle por ID con campos:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/v1/productos/1?campos=nombre,precio,bateria"
```

Comparar productos:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/v1/productos/comparar?ids=1,2,3"
```

Comparar productos con campos:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/v1/productos/comparar?ids=1,2,3&campos=nombre,precio,valoracion,bateria,camara"
```

## Respuestas de error actuales

- Formato: `estado`, `mensaje` y opcionalmente `datos` (stack en ambientes distintos de `produccion`).
- `GET /productos/:id`:
  - `400` si `id` no es numerico.
  - `404` si el producto no existe.
- `GET /productos/comparar`:
  - `400` si `ids` no se envia.
  - `422` si `ids` tiene menos de 2 valores o contiene IDs invalidos.

## Pruebas automatizadas

Se implementaron pruebas unitarias y de integracion con `Jest`.

- Unitarias:
  - `middlewares`: validacion de campos (`Joi`) y `errorHandler`.
  - `services`: logica de negocio y propagacion de errores.
  - `controllers`: delegacion a servicios y respuestas HTTP.
  - `models`: construccion de SQL y manejo de respuestas/errores.
- Integracion:
  - Flujo HTTP completo de endpoints principales (`/`, `/productos`, `/productos/:id`, `/productos/comparar`, `/openapi.json`) con `supertest`.
  - Se mockea la capa de base de datos para no depender de PostgreSQL real en testing.

### Comandos de ejecucion

Todas las pruebas:
```bash
npm test
```

Solo unitarias:
```bash
npm run test:unit
```

Solo integracion:
```bash
npm run test:integration
```

Modo watch:
```bash
npm run test:watch
```

### Nota sobre salida en consola

Si usas `--silent` en Jest, se ocultan `console.log` y `console.error` durante los tests.
Esto no cambia el resultado (pass/fail), solo limpia la salida.
