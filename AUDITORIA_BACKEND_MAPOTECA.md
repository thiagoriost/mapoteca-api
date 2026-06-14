# Auditoria Backend - API Mapoteca

## 1. Objetivo

Este documento define todo lo que se debe auditar para conocer el estado actual del backend y establece un plan de pruebas paso a paso para validar su calidad tecnica, funcional y operativa.

## 2. Estado actual observado (baseline)

Resultado obtenido sobre el estado actual del workspace:

1. Compilacion
- `npm run build`: exitoso.

2. Pruebas e2e
- `npm run test:e2e`: falla.
- Falla actual: el test espera `GET /` con 200 y `Hello World!`, pero la API responde 404.

3. Hallazgos tecnicos inmediatos
- Diagnostico TypeScript en `src/main.ts`: llamada a `bootstrap()` sin manejo explicito de promesa (regla de lint/no-floating-promises).
- Diagnostico TypeScript en `tsconfig.json`: aviso deprecacion de `baseUrl` para TS 7.
- En logica de negocio, existe variable de entorno `DIRECTUS_ROOT_FOLDER` en configuracion, pero el servicio de Mapoteca usa constante fija `Mapoteca` (`MAPOTECA_CONSTANTS.ROOT_FOLDER`). Se debe auditar si esto es intencional o inconsistencia de configuracion.

## 3. Alcance de auditoria

La auditoria debe cubrir:

1. Arquitectura y diseno
2. Configuracion y despliegue
3. Seguridad
4. Calidad de codigo
5. Pruebas automatizadas
6. Integracion con Directus
7. Observabilidad (logs, trazabilidad)
8. Rendimiento y escalabilidad
9. Confiabilidad y manejo de errores
10. Documentacion tecnica y operativa

## 4. Checklist de auditoria (que se debe auditar)

## 4.1 Arquitectura y estructura

- Verificar separacion de capas `Controller -> Service -> DirectusService`.
- Confirmar que no haya logica de negocio en controladores.
- Revisar responsabilidades por modulo y dependencia entre clases.
- Verificar consistencia de DTOs de request/response.
- Revisar duplicidad de logica (filtros, mapeos, transformaciones).

## 4.2 Configuracion y entorno

- Validar presencia de archivo `.env` por ambiente.
- Validar que todas las variables requeridas existan:
  - `PORT`
  - `DIRECTUS_URL`
  - `DIRECTUS_ROOT_FOLDER`
  - `DIRECTUS_USER`
  - `DIRECTUS_PASSWORD`
- Revisar si `DIRECTUS_ROOT_FOLDER` realmente se usa en runtime.
- Verificar defaults y comportamiento sin variables.
- Confirmar configuracion para desarrollo, QA y produccion.

## 4.3 Seguridad

- Verificar si los endpoints requieren autenticacion real (actualmente Swagger declara bearer, pero debe validarse enforcement en runtime).
- Evaluar politica CORS (actualmente habilitado globalmente sin restricciones explicitas).
- Revisar exposicion de errores internos y stack traces.
- Revisar sanitizacion y validacion de entrada (DTO + `ValidationPipe`).
- Validar control de acceso a descargas de documentos.
- Verificar riesgo de enumeracion por IDs de documentos.

## 4.4 Calidad de codigo y estandares

- Ejecutar lint y revisar advertencias/errores.
- Revisar reglas de estilo y consistencia de formato.
- Revisar complejidad ciclomatica de servicios principales.
- Revisar manejo de errores en integracion HTTP.
- Verificar ausencia de codigo muerto.
- Revisar uso de tipos estrictos y nulos.

## 4.5 Pruebas automatizadas

- Revisar cobertura de pruebas unitarias.
- Revisar cobertura de pruebas de integracion.
- Corregir y actualizar pruebas e2e desalineadas con endpoints reales.
- Medir cobertura por modulo y por endpoint critico.
- Validar casos felices, casos limite y casos de error.

## 4.6 Integracion Directus

- Verificar disponibilidad del servicio Directus.
- Validar estructura de carpetas esperada.
- Verificar comportamiento cuando no existe carpeta raiz.
- Validar tiempos de respuesta y errores de red.
- Validar tratamiento de respuestas vacias o incompletas.
- Verificar mapeo de campos Directus -> DTO interno.

## 4.7 Rendimiento

- Medir latencia de endpoints principales.
- Revisar impacto de consultas en paralelo por tematica.
- Revisar paginacion para grandes volumenes de datos.
- Validar consumo de memoria en consultas amplias.
- Definir umbrales maximos aceptables por endpoint.

## 4.8 Observabilidad y operacion

- Verificar estructura y nivel de logs.
- Validar trazabilidad por solicitud.
- Verificar registro de errores de infraestructura.
- Confirmar readiness para monitoreo (health checks y metricas pendientes).
- Definir tablero minimo de operacion (errores, latencia, disponibilidad).

## 4.9 Documentacion y gobierno tecnico

- Validar que Swagger corresponda a comportamiento real.
- Revisar README contra implementacion actual.
- Verificar versionado y estrategia de releases.
- Documentar decisiones tecnicas pendientes y deuda tecnica.

## 5. Plan de pruebas paso a paso (que se debe probar)

## 5.1 Preparacion

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno en `.env`.

3. Verificar que Directus este disponible y con la estructura esperada.

4. Ejecutar API en modo desarrollo:

```bash
npm run start:dev
```

5. Verificar Swagger:

```text
http://localhost:3000/swagger
```

## 5.2 Pruebas tecnicas base

1. Compilacion:

```bash
npm run build
```

2. Lint:

```bash
npm run lint
```

3. Pruebas unitarias:

```bash
npm run test
```

4. Pruebas e2e:

```bash
npm run test:e2e
```

5. Cobertura:

```bash
npm run test:cov
```

Resultado esperado:
- Build en verde.
- Lint sin errores criticos.
- Test suite en verde.
- Cobertura minima definida por equipo (sugerido: 80% lineas y ramas en servicios criticos).

## 5.3 Pruebas funcionales de endpoints

## A. Consultar tematicas

1. Ejecutar:

```http
GET /api/v1/mapoteca/tematicas
```

2. Verificar:
- Codigo 200.
- Lista no vacia si hay datos.
- Campos esperados: `id`, `nombre`, `cantidadDocumentos`.

3. Caso negativo:
- Si no existe carpeta raiz, verificar 404 con mensaje funcional.

## B. Consultar documentos sin filtros

1. Ejecutar:

```http
GET /api/v1/mapoteca/documentos
```

2. Verificar:
- Codigo 200.
- Estructura paginada: `page`, `size`, `total`, `totalPages`, `data`.

## C. Consultar documentos con filtros

1. Probar filtro por tematica:

```http
GET /api/v1/mapoteca/documentos?tematica=Ambiental
```

2. Probar filtro por nombre:

```http
GET /api/v1/mapoteca/documentos?nombre=opiac
```

3. Probar filtro por tipo:

```http
GET /api/v1/mapoteca/documentos?tipo=application/pdf
```

4. Probar filtro por anio:

```http
GET /api/v1/mapoteca/documentos?anio=2026
```

5. Verificar en cada caso:
- Codigo 200.
- Coherencia entre filtros aplicados y resultados retornados.

## D. Paginacion y ordenamiento

1. Paginacion:

```http
GET /api/v1/mapoteca/documentos?page=1&size=10
```

2. Orden ascendente:

```http
GET /api/v1/mapoteca/documentos?sort=titulo&direction=asc
```

3. Orden descendente:

```http
GET /api/v1/mapoteca/documentos?sort=fechaCarga&direction=desc
```

4. Verificar:
- Orden correcto.
- `totalPages` consistente con `total` y `size`.

## E. Consulta por ID

1. Caso exitoso:

```http
GET /api/v1/mapoteca/documentos/{idValido}
```

2. Verificar:
- Codigo 200.
- Presencia de `urlConsulta`.

3. Caso no encontrado:

```http
GET /api/v1/mapoteca/documentos/{idInvalido}
```

4. Verificar:
- Codigo 404.
- Mensaje: `Documento {id} no encontrado`.

## F. Descarga documental

1. Ejecutar:

```http
GET /api/v1/mapoteca/documentos/{idValido}/descargar
```

2. Verificar:
- Redireccion HTTP (302).
- URL de destino valida en Directus.

3. Caso no encontrado:
- Debe retornar 404 funcional.

## 5.4 Pruebas de validacion de entrada

1. Enviar `page=0` y validar error de validacion.
2. Enviar `size=101` y validar error por maximo.
3. Enviar `anio=1990` y validar error por minimo.
4. Enviar parametros no permitidos y validar rechazo por `forbidNonWhitelisted`.

Resultado esperado:
- Respuestas 400 bien formadas para entradas invalidas.

## 5.5 Pruebas de resiliencia e integracion

1. Simular Directus caido (URL invalida).
2. Invocar endpoints principales.
3. Verificar:
- Manejo de error controlado.
- Logs de error con contexto de operacion.
- Ausencia de fuga de informacion sensible.

## 5.6 Pruebas de rendimiento inicial

1. Ejecutar carga basica (por ejemplo con k6 o autocannon) sobre:
- `GET /tematicas`
- `GET /documentos`
- `GET /documentos?tematica=...`

2. Medir:
- p50, p95, p99
- throughput
- tasa de error

3. Validar que no existan degradaciones severas con volumen moderado.

## 6. Criterios de cierre de auditoria

La auditoria se considera cerrada cuando:

1. Existe evidencia de ejecucion de todas las pruebas del plan.
2. Se documentan hallazgos con severidad (Alta/Media/Baja).
3. Se define plan de remediacion por hallazgo con responsable y fecha.
4. El backlog tecnico queda priorizado.

## 7. Hallazgos iniciales recomendados para priorizar

1. Corregir suite e2e para que pruebe endpoints reales de Mapoteca.
2. Resolver warning de promesa flotante en `bootstrap()`.
3. Revisar y alinear uso de `DIRECTUS_ROOT_FOLDER` vs constante fija.
4. Definir politica de CORS y autenticacion/autorizacion efectiva en runtime.
