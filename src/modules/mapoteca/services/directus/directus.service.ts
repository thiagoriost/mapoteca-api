import {
  Injectable,
  Logger
} from '@nestjs/common';

import {
  HttpService
} from '@nestjs/axios';

import {
  firstValueFrom
} from 'rxjs';

import {
  DirectusConfig
} from '../../../../config/directus.config';

import {
  DirectusFolder
} from '../../models/directus-folder.model';

import {
  DirectusFile
} from '../../models/directus-file.model';

import {
  DirectusResponse
} from '../../models/directus-response.model';

import {
  DIRECTUS_ENDPOINTS
} from '../../../../common/constants/directus.constants';

import {
  DocumentNotFoundException
} from '../../../../common/exceptions/document-not-found.exception';

/**
 * Servicio encargado de la integración
 * con Directus.
 *
 * Responsabilidades:
 * - Consultar carpetas.
 * - Consultar documentos.
 * - Gestionar llamadas HTTP.
 * - Registrar eventos de integración.
 * - Propagar errores de infraestructura.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
@Injectable()
export class DirectusService {

  /**
   * Logger de la clase.
   */
  private readonly logger =
    new Logger(
      DirectusService.name
    );

  constructor(

    private readonly httpService:
      HttpService,

    private readonly directusConfig:
      DirectusConfig

  ) {}

  /**
   * Obtiene una carpeta por nombre.
   *
   * @param folderName Nombre de la carpeta.
   *
   * @returns Colección de carpetas encontradas.
   */
  async getFolderByName(
    folderName: string
  ): Promise<DirectusFolder[]> {

    try {

      const url =
        `${this.directusConfig.url}${DIRECTUS_ENDPOINTS.FOLDERS}?filter[name][_eq]=${encodeURIComponent(folderName)}`;

      this.logger.log(
        `Consultando carpeta ${folderName}`
      );

      const response =
        await firstValueFrom(

          this.httpService.get<
            DirectusResponse<
              DirectusFolder[]
            >
          >(url)

        );

      return response.data.data;

    } catch (error) {

      this.handleError(
        `Error consultando carpeta ${folderName}`,
        error
      );

    }

  }

  /**
   * Obtiene las subcarpetas de una carpeta.
   *
   * @param parentId Identificador de la carpeta padre.
   *
   * @returns Subcarpetas encontradas.
   */
  async getSubFolders(
    parentId: string
  ): Promise<DirectusFolder[]> {

    try {

      const url =
        `${this.directusConfig.url}${DIRECTUS_ENDPOINTS.FOLDERS}?filter[parent][_eq]=${encodeURIComponent(parentId)}`;

      this.logger.log(
        `Consultando subcarpetas de ${parentId}`
      );

      const response =
        await firstValueFrom(

          this.httpService.get<
            DirectusResponse<
              DirectusFolder[]
            >
          >(url)

        );

      return response.data.data;

    } catch (error) {

      this.handleError(
        `Error consultando subcarpetas de ${parentId}`,
        error
      );

    }

  }

  /**
   * Obtiene los documentos asociados
   * a una temática de la Mapoteca.
   *
   * @param folderName Nombre de la temática.
   *
   * @returns Colección de documentos encontrados.
   */
  async getFilesByFolder(
    folderName: string
  ): Promise<DirectusFile[]> {

    try {

      const url =
        `${this.directusConfig.url}${DIRECTUS_ENDPOINTS.FILES}?filter[folder][name][_eq]=${encodeURIComponent(folderName)}`;

      this.logger.log(
        `Consultando documentos de la temática ${folderName}`
      );

      const response =
        await firstValueFrom(

          this.httpService.get<
            DirectusResponse<
              DirectusFile[]
            >
          >(url)

        );

      return response.data.data;

    } catch (error) {

      this.handleError(
        `Error consultando documentos de la temática ${folderName}`,
        error
      );

    }

  }

  /**
   * Obtiene todos los documentos
   * registrados en Directus.
   *
   * @returns Colección completa
   * de documentos.
   */
  async getAllFiles():
    Promise<DirectusFile[]> {

    try {

      const url =
        `${this.directusConfig.url}${DIRECTUS_ENDPOINTS.FILES}`;

      this.logger.log(
        'Consultando todos los documentos'
      );

      const response =
        await firstValueFrom(

          this.httpService.get<
            DirectusResponse<
              DirectusFile[]
            >
          >(url)

        );

      return response.data.data;

    } catch (error) {

      this.handleError(
        'Error consultando documentos',
        error
      );

    }

  }

  /**
   * Registra y propaga errores
   * producidos durante la integración
   * con Directus.
   *
   * @param operation Operación ejecutada.
   * @param error Error capturado.
   */
  private handleError(
    operation: string,
    error: unknown
  ): never {

    this.logger.error(
      operation,
      error instanceof Error
        ? error.stack
        : JSON.stringify(error)
    );

    throw error;

  }

  /**
   * Obtiene un documento por su identificador.
   *
   * @param documentId Identificador del documento.
   *
   * @returns Documento encontrado.
   *
   * @throws DocumentNotFoundException
   * cuando el documento no existe.
   */
  async getFileById(
    documentId: string
  ): Promise<DirectusFile> {

    try {

      const url =
        `${this.directusConfig.url}${DIRECTUS_ENDPOINTS.FILES}/${encodeURIComponent(documentId)}`;

      this.logger.log(
        `Consultando documento ${documentId}`
      );

      const response =
        await firstValueFrom(

          this.httpService.get<
            DirectusResponse<
              DirectusFile
            >
          >(url)

        );

      const documento =
        response.data.data;

      if (!documento) {

        throw new DocumentNotFoundException(
          documentId
        );

      }

      return documento;

    } catch (error) {

      /**
       * Si Directus responde 404
       * convertimos la excepción
       * a una excepción funcional
       * de la API.
       */
      if (

        typeof error === 'object'
        && error !== null
        && 'response' in error

      ) {

        const axiosError =
          error as {

            response?: {
              status?: number;
            };

          };

        if (
          axiosError.response?.status === 404
        ) {

          throw new DocumentNotFoundException(
            documentId
          );

        }

      }

      this.handleError(
        `Error consultando documento ${documentId}`,
        error
      );

    }

  }

}