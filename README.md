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

Definir token (valor de `JWT_STATIC_TOKEN`) en las variables de entorno:
```bash
TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Listar productos:
```bash
curl -v -X GET "http://187.77.235.144:8080/api/v1/productos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Listar productos solo con campos:
```bash
curl -v -X GET "http://187.77.235.144:8080/api/v1/productos?campos=id,nombre,precio,color" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Detalle por ID:
```bash
curl -v -X GET "http://187.77.235.144:8080/api/v1/productos/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Detalle por ID con filtro de campos:
```bash
curl -v -X GET "http://187.77.235.144:8080/api/v1/productos/1?campos=nombre,precio,bateria" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Comparar productos:
```bash
curl -v -X GET "http://187.77.235.144:8080/api/v1/productos/comparar?ids=1,2,3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Comparar productos con campos:
```bash
curl -v -X GET "http://187.77.235.144:8080/api/v1/productos/comparar?ids=1,2,3&campos=nombre,precio,valoracion,bateria,camara" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
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

## Mejoras futuras

- Implementación de certificados TLS.
- Implementación de proxy inverso para mejorar la seguridad.
- Limitación de recursos de Docker para optimizar los recursos del servidor.
- Implementación de segmentación de permisos con middleware para autorización de acceso segmentado a los endpoints.
