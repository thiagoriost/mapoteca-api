/**
 * Constantes funcionales utilizadas
 * por la API de Mapoteca.
 *
 * Centraliza configuraciones de negocio
 * para evitar valores literales
 * distribuidos en la aplicación.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export const MAPOTECA_CONSTANTS = {

  /**
   * Nombre de la carpeta principal
   * de la Mapoteca en Directus.
   */
  ROOT_FOLDER: 'Mapoteca',

  /**
   * Tipos MIME permitidos para
   * operaciones de impresión.
   */
  PRINTABLE_TYPES: [

    'application/pdf',

    'image/jpeg',

    'image/jpg',

    'image/png',

    'image/tiff'

  ]

} as const;