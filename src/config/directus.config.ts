import {
  Injectable
} from '@nestjs/common';

import {
  ConfigService
} from '@nestjs/config';

import {
  DIRECTUS_ENDPOINTS
} from '../common/constants/directus.constants';

/**
 * Servicio encargado de centralizar
 * la configuración de integración
 * con Directus.
 *
 * Permite acceder de forma tipada
 * a las variables de entorno
 * requeridas por la aplicación.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
@Injectable()
export class DirectusConfig {

  constructor(
    private readonly configService:
      ConfigService
  ) {}

  /**
   * Obtiene la URL base de Directus.
   *
   * @returns URL configurada en la
   * variable de entorno DIRECTUS_URL.
   */
  get url(): string {

    return this.configService
      .getOrThrow<string>(
        'DIRECTUS_URL'
      );

  }

  /**
   * Obtiene el nombre de la carpeta
   * principal de la Mapoteca.
   *
   * @returns Nombre configurado en la
   * variable de entorno
   * DIRECTUS_ROOT_FOLDER.
   */
  get rootFolder(): string {

    return this.configService
      .getOrThrow<string>(
        'DIRECTUS_ROOT_FOLDER'
      );

  }

  /**
   * Construye la URL pública
   * de acceso a un recurso
   * almacenado en Directus.
   *
   * @param documentId Identificador
   * del documento.
   *
   * @returns URL del asset.
   */
  getAssetUrl(
    documentId: string
  ): string {

    return `${this.url}${DIRECTUS_ENDPOINTS.ASSETS}/${encodeURIComponent(documentId)}`;

  }

  /**
   * Construye la URL pública
   * de descarga de un documento
   * almacenado en Directus.
   *
   * @param documentId Identificador
   * del documento.
   *
   * @returns URL de descarga.
   */
  getDownloadUrl(
    documentId: string
  ): string {

    return `${this.url}${DIRECTUS_ENDPOINTS.ASSETS}/${encodeURIComponent(documentId)}?download`;

  }


}