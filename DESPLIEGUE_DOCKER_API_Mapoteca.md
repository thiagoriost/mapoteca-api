# Despliegue con Docker - API Mapoteca

## 1. Objetivo

Este documento describe las configuraciones necesarias para desplegar la API Mapoteca sobre un contenedor Docker, incluyendo la integración con Directus CMS dentro del mismo entorno de contenedores.

---

## 2. Requisitos previos

1. Docker Desktop (Windows) o Docker Engine (Linux) instalado y en ejecución.
2. Docker Compose disponible.
3. Acceso de red entre los contenedores.
4. Variables de entorno definidas para producción.
5. Imagen base de Node.js disponible (se descarga automáticamente).

Verificar instalación:

```powershell
docker --version
docker compose version
```

---

## 3. Estructura de archivos necesarios

Agregar a la raíz del proyecto:

```text
mapoteca-api/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .env
└── src/
```

---

## 4. Dockerfile

Crear el archivo `Dockerfile` en la raíz del proyecto con el siguiente contenido:

```dockerfile
# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### Explicación

| Etapa       | Propósito                                                    |
| ----------- | ------------------------------------------------------------ |
| `builder`   | Instala todas las dependencias y compila el proyecto         |
| `production`| Copia solo el `dist` e instala únicamente dependencias de producción |

La imagen resultante es liviana porque no incluye código fuente ni dependencias de desarrollo.

---

## 5. .dockerignore

Crear el archivo `.dockerignore` para excluir archivos innecesarios del contexto de construcción:

```text
node_modules
dist
.env
*.log
coverage
.git
README.md
*.md
```

---

## 6. Variables de entorno (.env)

Crear el archivo `.env` en la raíz del proyecto. Este archivo es usado por Docker Compose en tiempo de ejecución:

```env
PORT=3000

DIRECTUS_URL=http://directus:8055

DIRECTUS_ROOT_FOLDER=Mapoteca

DIRECTUS_USER=usuario_tecnico

DIRECTUS_PASSWORD=clave_tecnica

DIRECTUS_DB_USER=directus

DIRECTUS_DB_PASSWORD=directus_password

DIRECTUS_DB_NAME=mapoteca_db

DIRECTUS_SECRET=clave_secreta_directus

DIRECTUS_ADMIN_EMAIL=admin@mapoteca.local

DIRECTUS_ADMIN_PASSWORD=Admin1234!
```

> **Importante:** La variable `DIRECTUS_URL` debe usar el nombre del servicio Docker (`directus`) como hostname, no `localhost`. En la red interna de Docker, los contenedores se resuelven por nombre de servicio.

---

## 7. docker-compose.yml

Crear el archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
version: '3.9'

services:

  # Base de datos para Directus
  db:
    image: postgres:15-alpine
    container_name: mapoteca_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DIRECTUS_DB_USER}
      POSTGRES_PASSWORD: ${DIRECTUS_DB_PASSWORD}
      POSTGRES_DB: ${DIRECTUS_DB_NAME}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - mapoteca_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DIRECTUS_DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Directus CMS
  directus:
    image: directus/directus:latest
    container_name: mapoteca_directus
    restart: unless-stopped
    ports:
      - "8055:8055"
    depends_on:
      db:
        condition: service_healthy
    environment:
      SECRET: ${DIRECTUS_SECRET}
      ADMIN_EMAIL: ${DIRECTUS_ADMIN_EMAIL}
      ADMIN_PASSWORD: ${DIRECTUS_ADMIN_PASSWORD}
      DB_CLIENT: pg
      DB_HOST: db
      DB_PORT: 5432
      DB_DATABASE: ${DIRECTUS_DB_NAME}
      DB_USER: ${DIRECTUS_DB_USER}
      DB_PASSWORD: ${DIRECTUS_DB_PASSWORD}
      WEBSOCKETS_ENABLED: "false"
    volumes:
      - directus_uploads:/directus/uploads
      - directus_extensions:/directus/extensions
    networks:
      - mapoteca_net
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8055/server/health || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 5

  # API Mapoteca
  mapoteca_api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: mapoteca_api
    restart: unless-stopped
    ports:
      - "${PORT}:3000"
    depends_on:
      directus:
        condition: service_healthy
    environment:
      PORT: 3000
      DIRECTUS_URL: http://directus:8055
      DIRECTUS_ROOT_FOLDER: ${DIRECTUS_ROOT_FOLDER}
      DIRECTUS_USER: ${DIRECTUS_USER}
      DIRECTUS_PASSWORD: ${DIRECTUS_PASSWORD}
    networks:
      - mapoteca_net

networks:
  mapoteca_net:
    driver: bridge

volumes:
  db_data:
  directus_uploads:
  directus_extensions:
```

### Explicación de servicios

| Servicio        | Propósito                                           |
| --------------- | --------------------------------------------------- |
| `db`            | Base de datos PostgreSQL para Directus              |
| `directus`      | Directus CMS, gestor de contenido y archivos        |
| `mapoteca_api`  | API NestJS Mapoteca                                 |

### Red interna

Los tres servicios comparten la red `mapoteca_net`. Dentro de esa red, cada servicio se resuelve por su nombre:

| Desde          | Hacia Directus              | Hacia DB            |
| -------------- | --------------------------- | ------------------- |
| `mapoteca_api` | `http://directus:8055`      | No aplica directo   |
| `directus`     | —                           | `db:5432`           |

---

## 8. Paso a paso para levantar el entorno

### 8.1 Construir imágenes

```powershell
docker compose build
```

### 8.2 Levantar todos los servicios

```powershell
docker compose up -d
```

### 8.3 Verificar que los contenedores estén en ejecución

```powershell
docker compose ps
```

Todos los servicios deben aparecer en estado `running`.

### 8.4 Verificar logs

```powershell
# Todos los servicios
docker compose logs -f

# Solo la API
docker compose logs -f mapoteca_api

# Solo Directus
docker compose logs -f directus
```

### 8.5 Verificar la API

Abrir en el navegador:

```text
http://localhost:3000/swagger
```

### 8.6 Verificar Directus

Abrir en el navegador:

```text
http://localhost:8055
```

Acceder con las credenciales definidas en `DIRECTUS_ADMIN_EMAIL` y `DIRECTUS_ADMIN_PASSWORD`.

---

## 9. Configuración inicial de Directus

La primera vez que se levanta Directus con datos nuevos:

1. Acceder al panel de Directus.
2. Crear la carpeta raíz `Mapoteca`.
3. Crear subcarpetas de temáticas dentro de `Mapoteca` (por ejemplo: `Ambiental`, `Agropecuario`, `Riesgo`, `Planeación`).
4. Cargar documentos en las subcarpetas correspondientes.
5. Crear el usuario técnico definido en `DIRECTUS_USER` con los permisos de lectura necesarios.

---

## 10. Comandos útiles de operación

| Acción                        | Comando                                        |
| ----------------------------- | ---------------------------------------------- |
| Levantar entorno              | `docker compose up -d`                         |
| Detener entorno               | `docker compose down`                          |
| Detener y eliminar volúmenes  | `docker compose down -v`                       |
| Reconstruir solo la API       | `docker compose build mapoteca_api`            |
| Reiniciar solo la API         | `docker compose restart mapoteca_api`          |
| Ver logs en vivo              | `docker compose logs -f`                       |
| Acceder al contenedor de API  | `docker compose exec mapoteca_api sh`          |

---

## 11. Actualizar la API en producción

Cuando exista una nueva versión del código:

1. Detener el servicio de la API:

```powershell
docker compose stop mapoteca_api
```

2. Reconstruir la imagen:

```powershell
docker compose build mapoteca_api
```

3. Levantar el servicio actualizado:

```powershell
docker compose up -d mapoteca_api
```

4. Verificar logs y Swagger.

Directus y la base de datos no se interrumpen durante esta operación.

---

## 12. Persistencia de datos

Los volúmenes Docker garantizan que los datos no se pierdan al detener los contenedores:

| Volumen               | Contenido                        |
| --------------------- | -------------------------------- |
| `db_data`             | Base de datos PostgreSQL         |
| `directus_uploads`    | Archivos cargados en Directus    |
| `directus_extensions` | Extensiones instaladas           |

> Para hacer un respaldo, copiar los volúmenes o exportar la base de datos con `pg_dump`.

---

## 13. Buenas prácticas de seguridad

1. No exponer el puerto de la base de datos (`5432`) fuera del host.
2. Cambiar contraseñas por defecto antes de poner en producción.
3. Restringir el acceso al panel de Directus solo a redes internas.
4. Limitar acceso al Swagger si no se requiere exposición pública.
5. Usar un proxy inverso (Nginx o IIS) para terminar TLS antes de los contenedores.
6. Revisar y actualizar imágenes periódicamente para aplicar parches de seguridad.

---

## 14. Checklist final

1. Archivo `.env` configurado con valores reales.
2. `docker compose build` sin errores.
3. `docker compose up -d` con todos los servicios en estado `running`.
4. Directus accesible en `http://localhost:8055`.
5. Estructura de carpetas Mapoteca creada en Directus.
6. Usuario técnico de Directus creado con permisos correctos.
7. API accesible en `http://localhost:3000/swagger`.
8. Endpoint `GET /api/v1/mapoteca/tematicas` retorna 200.
9. Volúmenes persistentes verificados.
10. Logs sin errores de conexión entre contenedores.
