# Despliegue en Produccion - API Mapoteca

## 1. Objetivo

Este documento describe el paso a paso para desplegar la API Mapoteca en produccion sobre Windows Server 2019 y propone una alternativa de despliegue local on-premise para mejorar la operacion y el rendimiento sin depender de una nube publica.

## 2. Requisitos previos

Antes de desplegar, validar lo siguiente:

1. Windows Server 2019 actualizado.
2. Acceso de administrador al servidor.
3. Node.js 20 LTS o superior instalado.
4. npm disponible.
5. Acceso de red hacia Directus.
6. Variables de entorno definidas para produccion.
7. Puerto de la API habilitado en firewall.
8. Directorio estable para la aplicacion y logs.

## 3. Variables de entorno requeridas

Crear un archivo `.env` para produccion con, al menos, estas variables:

```env
PORT=3000
DIRECTUS_URL=http://servidor-directus:8055
DIRECTUS_ROOT_FOLDER=Mapoteca
DIRECTUS_USER=usuario_tecnico
DIRECTUS_PASSWORD=clave_tecnica
```

### Recomendaciones

- No almacenar credenciales en texto plano fuera del servidor de produccion.
- Restringir permisos del archivo `.env` al usuario de servicio.
- Usar un directorio distinto para cada ambiente.

## 4. Paso a paso para despliegue en Windows Server 2019

### 4.1 Preparar el servidor

1. Iniciar sesion con una cuenta administradora.
2. Verificar instalacion de Node.js:

```powershell
node -v
npm -v
```

3. Si Node.js no existe, instalar la version LTS recomendada.
4. Crear una carpeta de despliegue, por ejemplo:

```text
C:\Servicios\mapoteca-api
```

5. Definir una carpeta para logs:

```text
C:\Servicios\mapoteca-api\logs
```

### 4.2 Copiar el codigo fuente

1. Clonar el repositorio en el servidor o copiar los archivos de una version aprobada.
2. Verificar que esten presentes:
- `package.json`
- `src/`
- `tsconfig.json`
- `nest-cli.json`

3. Copiar o crear el archivo `.env` en la raiz del despliegue.

### 4.3 Instalar dependencias

1. Abrir PowerShell en la carpeta del proyecto.
2. Ejecutar:

```powershell
npm install
```

3. Confirmar que la instalacion finalice sin errores.

### 4.4 Validar la compilacion

1. Ejecutar build de produccion:

```powershell
npm run build
```

2. Verificar que se genere la carpeta `dist`.
3. Si el build falla, corregir antes de continuar.

### 4.5 Probar en modo local antes de publicar

1. Levantar la aplicacion manualmente:

```powershell
npm run start:prod
```

2. Verificar disponibilidad en:

```text
http://localhost:3000/swagger
```

3. Validar al menos estos endpoints:
- `GET /api/v1/mapoteca/tematicas`
- `GET /api/v1/mapoteca/documentos`
- `GET /api/v1/mapoteca/documentos/{id}`
- `GET /api/v1/mapoteca/documentos/{id}/descargar`

### 4.6 Configurar ejecucion automatica como servicio

En Windows Server 2019, se recomienda ejecutar la API como servicio para que inicie con el sistema.

#### Opcion recomendada: NSSM

1. Instalar NSSM.
2. Crear el servicio con el ejecutable de Node.js.
3. Configurar como directorio de trabajo la carpeta del proyecto.
4. Definir el comando de inicio:

```text
node dist/main.js
```

5. Registrar variables de entorno del servicio.
6. Configurar reinicio automatico ante fallos.

#### Alternativa nativa

1. Crear una tarea programada o servicio personalizado.
2. Ejecutar el comando de inicio al arrancar el sistema.
3. Redirigir salida estandar y errores a archivos de log.

### 4.7 Configurar firewall y puerto

1. Abrir el puerto definido en `PORT`.
2. Permitir trafico solo desde las redes autorizadas.
3. Si existe proxy inverso, restringir el acceso directo al puerto interno.

### 4.8 Publicar la aplicacion

1. Iniciar el servicio.
2. Verificar que responda por el puerto configurado.
3. Probar Swagger y los endpoints funcionales.
4. Confirmar consumo correcto de variables de entorno.

### 4.9 Verificacion post-despliegue

1. Validar estado del servicio.
2. Revisar logs de arranque.
3. Validar conectividad con Directus.
4. Ejecutar pruebas funcionales basicas.
5. Confirmar que no existan errores 500 al invocar los endpoints principales.

### 4.10 Plan de rollback

Si el despliegue falla:

1. Detener el servicio.
2. Restaurar la version previa del codigo o carpeta de despliegue.
3. Restaurar el archivo `.env` previo si cambio.
4. Reiniciar el servicio.
5. Validar nuevamente los endpoints.

## 5. Buenas practicas para produccion

1. No ejecutar la API con `start:dev` en produccion.
2. Mantener `build` como paso obligatorio previo al despliegue.
3. Deshabilitar CORS abierto si solo se consume desde redes internas controladas.
4. Limitar acceso al Swagger si no es necesario exponerlo publicamente.
5. Rotar credenciales de Directus de forma periodica.
6. Centralizar logs de applicacion y errores.
7. Supervisar espacio en disco y memoria del servidor.

## 6. Opcion alternativa local on-premise para mejorar optimizacion

Si el objetivo es evitar la nube y mejorar la eficiencia operativa en un servidor local, la mejor opcion es un despliegue on-premise con estas caracteristicas:

### 6.1 Arquitectura sugerida

```text
Usuarios internos
   |
   v
Reverse Proxy local (IIS o Nginx en Windows)
   |
   v
API Mapoteca en Node.js como servicio
   |
   v
Directus en red interna o servidor vecino
```

### 6.2 Ventajas

1. Menor latencia dentro de la red institucional.
2. Control directo sobre infraestructura y accesos.
3. Menor dependencia de conectividad externa.
4. Mejor cumplimiento para entornos con restricciones de datos.
5. Posibilidad de integrar almacenamiento local y respaldos internos.

### 6.3 Como optimizar este escenario local

1. Ubicar API y Directus en la misma red local.
2. Usar un reverse proxy para terminar TLS y centralizar logs.
3. Ejecutar la API como servicio con reinicio automatico.
4. Limitar el puerto Node solo a localhost cuando exista proxy inverso.
5. Habilitar compresion y cache donde aplique.
6. Ajustar recursos del servidor segun carga real.
7. Monitorear CPU, RAM, disco y latencia de llamadas a Directus.

### 6.4 Variante recomendada para mejor estabilidad local

La variante mas estable para un servidor local es:

1. API NestJS en Windows Service con NSSM.
2. IIS como proxy inverso hacia `localhost:3000`.
3. Certificado TLS interno o corporativo.
4. Logs en disco local con rotacion programada.
5. Directus en otro servidor local o contenedor interno.

Esta variante mejora el aislamiento, permite administrar certificados desde IIS y reduce la exposicion directa del proceso Node.js.

## 7. Checklist final de puesta en produccion

1. Build exitoso.
2. Variables de entorno cargadas.
3. Servicio configurado para arrancar automaticamente.
4. Puerto habilitado en firewall.
5. Swagger verificado.
6. Endpoints principales verificados.
7. Conectividad con Directus validada.
8. Logs revisados.
9. Plan de rollback documentado.
