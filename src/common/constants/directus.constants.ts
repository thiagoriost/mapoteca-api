/**
 * Endpoints expuestos por Directus
 * utilizados por la API Mapoteca.
 *
 * Centraliza las rutas para evitar
 * valores literales distribuidos
 * en los servicios de integración.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export const DIRECTUS_ENDPOINTS = {
  /**
   * Gestión de carpetas.
   */
  FOLDERS: '/folders',

  /**
   * Gestión de archivos.
   */
  FILES: '/files',

  /**
   * Acceso a recursos físicos.
   */
  ASSETS: '/assets',

  /**
   * Autenticación.
   */
  LOGIN: '/auth/login',

  /**
   * Renovación de token.
   */
  REFRESH: '/auth/refresh',
} as const;
