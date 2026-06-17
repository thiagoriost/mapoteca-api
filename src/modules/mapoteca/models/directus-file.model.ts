/**
 * Representa un documento almacenado
 * en Directus.
 *
 * Modelo utilizado para mapear la
 * respuesta retornada por la colección
 * de archivos de Directus.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DirectusFile {
  /**
   * Identificador único del archivo.
   */
  id!: string;

  /**
   * Título del documento.
   */
  title!: string;

  /**
   * Nombre original del archivo.
   */
  filename_download!: string;

  /**
   * Nombre físico almacenado
   * internamente por Directus.
   */
  filename_disk!: string;

  /**
   * Tipo MIME del documento.
   */
  type!: string;

  /**
   * Tamaño del archivo expresado
   * en bytes.
   */
  filesize!: number;

  /**
   * Identificador de la carpeta
   * asociada al documento.
   */
  folder!: string;

  /**
   * Fecha y hora de carga del documento
   * en formato ISO 8601.
   */
  uploaded_on!: string;
}
