# API MAPOTECA

## 1. Información General

### Nombre

API Mapoteca

### Versión

1.0.0

### Tecnología Base

NestJS 11

### Lenguaje

TypeScript

### Objetivo

Exponer servicios REST para la consulta de documentos almacenados en Directus CMS, garantizando que únicamente sean accesibles los recursos pertenecientes a la estructura oficial de la Mapoteca Institucional.

---

# 2. Alcance Funcional

La API permite:

* Consultar temáticas documentales.
* Obtener cantidad de documentos por temática.
* Consultar documentos.
* Filtrar documentos.
* Ordenar resultados.
* Paginar resultados.
* Consultar detalle documental.
* Obtener URL de visualización.
* Descargar documentos.
* Validar pertenencia a la estructura oficial de Mapoteca.

---

# 3. Arquitectura de Solución

```text
Usuario
   │
   ▼
Portal SIG
   │
   ▼
API Mapoteca
(NestJS)
   │
   ▼
Directus CMS
   │
   ▼
Repositorio Documental
```

---

# 4. Arquitectura Interna

```text
Controller
   │
   ▼
Service
   │
   ▼
Directus Service
   │
   ▼
Directus CMS
```

### Capas

#### Controller

Responsable de:

* Exponer endpoints.
* Recibir parámetros.
* Documentar Swagger.

#### Service

Responsable de:

* Aplicar reglas de negocio.
* Filtrar documentos.
* Ordenar resultados.
* Construir DTOs.

#### Directus Service

Responsable de:

* Consumir Directus.
* Gestionar llamadas HTTP.
* Propagar errores de infraestructura.

---

# 5. Tecnologías

| Tecnología        | Versión   |
| ----------------- | --------- |
| Node.js           | 20+       |
| NestJS            | 11        |
| TypeScript        | 5         |
| Axios             | Última    |
| Swagger           | OpenAPI 3 |
| RxJS              | Última    |
| Class Validator   | Última    |
| Class Transformer | Última    |
| Directus CMS      | Externo   |

---

# 6. Requisitos Previos

## Software

* Node.js 20+
* npm 10+
* Git

Validar:

```bash
node -v
npm -v
git --version
```

---

# 7. Instalación

## Clonar repositorio

```bash
git clone <repositorio>
```

```bash
cd mapoteca-api
```

## Instalar dependencias

```bash
npm install
```

---

# 8. Configuración

## Archivo .env

Crear:

```env
PORT=3000

DIRECTUS_URL=http://localhost:8055

DIRECTUS_ROOT_FOLDER=Mapoteca

DIRECTUS_USER=

DIRECTUS_PASSWORD=
```

### Variables

| Variable             | Descripción          |
| -------------------- | -------------------- |
| PORT                 | Puerto HTTP          |
| DIRECTUS_URL         | URL base de Directus |
| DIRECTUS_ROOT_FOLDER | Carpeta raíz         |
| DIRECTUS_USER        | Usuario técnico      |
| DIRECTUS_PASSWORD    | Contraseña técnica   |

---

# 9. Estructura Esperada en Directus

```text
Mapoteca
│
├── Agropecuario
│
├── Ambiental
│
├── Riesgo
│
└── Planeación
```

La API únicamente consulta documentos ubicados dentro de las subcarpetas de la carpeta configurada como raíz.

Documentos ubicados fuera de esta estructura serán ignorados.

---

# 10. Compilación

```bash
npm run build
```

---

# 11. Ejecución

## Desarrollo

```bash
npm run start:dev
```

## Producción

```bash
npm run start:prod
```

---

# 12. Swagger

Disponible en:

```text
http://localhost:3000/swagger
```

---

# 13. Endpoints

## Temáticas

### Consultar Temáticas

```http
GET /api/v1/mapoteca/tematicas
```

---

## Documentos

### Consultar Documentos

```http
GET /api/v1/mapoteca/documentos
```

### Filtros Disponibles

| Parámetro | Tipo       |
| --------- | ---------- |
| tematica  | string     |
| nombre    | string     |
| tipo      | string     |
| anio      | number     |
| page      | number     |
| size      | number     |
| sort      | string     |
| direction | asc / desc |

---

### Ejemplo

```http
GET /api/v1/mapoteca/documentos?tematica=Ambiental&anio=2026
```

---

### Respuesta

```json
{
  "page": 1,
  "size": 10,
  "total": 50,
  "totalPages": 5,
  "data": []
}
```

---

### Consultar Documento

```http
GET /api/v1/mapoteca/documentos/{id}
```

---

### Descargar Documento

```http
GET /api/v1/mapoteca/documentos/{id}/descargar
```

---

# 14. DTOs

## DocumentoFilterDto

Permite:

* Filtrar por temática.
* Filtrar por nombre.
* Filtrar por tipo MIME.
* Filtrar por año.
* Definir ordenamiento.
* Configurar paginación.

---

## DocumentoResponseDto

Representa la información básica de un documento.

---

## DocumentoDetalleResponseDto

Extiende DocumentoResponseDto.

Incluye:

```text
urlConsulta
```

---

# 15. Validaciones

La aplicación utiliza:

```typescript
ValidationPipe
```

Configuración:

```typescript
whitelist: true
transform: true
```

Beneficios:

* Elimina propiedades desconocidas.
* Convierte tipos automáticamente.
* Garantiza consistencia.

---

# 16. Excepciones

## DocumentNotFoundException

Código:

```http
404 Not Found
```

Ejemplo:

```json
{
  "statusCode": 404,
  "message": "Documento abc123 no encontrado"
}
```

---

# 17. Flujo de Consulta

```text
Cliente
  │
  ▼
Controller
  │
  ▼
MapotecaService
  │
  ▼
DirectusService
  │
  ▼
Directus
  │
  ▼
Respuesta
```

---

# 18. Seguridad

La API valida:

* Existencia de carpeta raíz.
* Existencia de temáticas.
* Existencia de documentos.
* Pertenencia del documento a la Mapoteca.

---

# 19. Logging

La integración con Directus registra:

* Consultas de carpetas.
* Consultas de documentos.
* Errores de infraestructura.

Utilizando:

```typescript
Logger
```

de NestJS.

---

# 20. Mantenimiento

Antes de desplegar nuevas versiones:

```bash
npm install
npm run build
npm run test
```

Verificar:

* Conectividad con Directus.
* Disponibilidad de Swagger.
* Consulta de temáticas.
* Consulta documental.
* Descarga documental.

---

# 21. Solución de Problemas

## No aparecen documentos

Verificar:

* DIRECTUS_URL
* DIRECTUS_ROOT_FOLDER
* Permisos de Directus

---

## Error 404

Verificar:

* Identificador del documento.
* Existencia en Directus.
* Ubicación dentro de Mapoteca.

---

## Swagger no abre

Verificar:

```text
http://localhost:3000/swagger
```

y que la aplicación esté iniciada.

---

# 22. Versionamiento

## v1.0.0

Características:

* Consulta de temáticas.
* Conteo real de documentos.
* Consulta documental.
* Filtros dinámicos.
* Filtro por año.
* Ordenamiento.
* Paginación.
* Consulta detallada.
* URL de visualización.
* Descarga documental.
* Swagger.
* DTOs tipados.
* ValidationPipe.
* Excepciones personalizadas.

---

# 23. Roadmap

Posibles mejoras futuras:

* Caché de consultas.
* Health Check.
* Auditoría.
* Métricas.
* Rate Limiting.
* Autenticación JWT.
* Integración OpenTelemetry.

---
