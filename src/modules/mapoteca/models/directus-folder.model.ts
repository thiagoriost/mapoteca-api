/**
 * Representa una carpeta almacenada
 * en Directus.
 *
 * Modelo utilizado para mapear la
 * respuesta retornada por la colección
 * de carpetas de Directus.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DirectusFolder {
  /**
   * Identificador único de la carpeta.
   */
  id!: string;

  /**
   * Nombre de la carpeta.
   */
  name!: string;

  /**
   * Identificador de la carpeta padre.
   *
   * Será nulo cuando corresponda
   * a una carpeta raíz.
   */
  parent?: string | null;
}
