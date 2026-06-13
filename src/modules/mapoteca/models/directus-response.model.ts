/**
 * Representa la estructura estándar
 * de respuesta retornada por Directus.
 *
 * @template T Tipo de dato contenido
 * en la propiedad data.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DirectusResponse<T> {

  /**
   * Información retornada por Directus.
   */
  data!: T;

}