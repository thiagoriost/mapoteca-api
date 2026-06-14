import { Injectable, NotFoundException } from '@nestjs/common';

import { DirectusService } from '../directus/directus.service';

import { MAPOTECA_CONSTANTS } from '../../../../common/constants/mapoteca.constants';

import { TematicaResponseDto } from '../../dto/response/tematica-response.dto';

import { DocumentoResponseDto } from '../../dto/response/documento-response.dto';

import { DocumentoFilterDto } from '../../dto/request/documento-filter.dto';

import { DocumentNotFoundException } from '../../../../common/exceptions/document-not-found.exception';

import { DirectusConfig } from '../../../../config/directus.config';

import { DocumentoDetalleResponseDto } from '../../dto/response/documento-detalle-response.dto';

import { PagedDocumentoResponseDto } from '../../dto/response/paged-documento-response.dto';

import { DirectusFolder } from '../../models/directus-folder.model';

import { DirectusFile } from '../../models/directus-file.model';

/**
 * Servicio encargado de la lógica de negocio
 * de la Mapoteca.
 *
 * Responsabilidades:
 * - Obtener temáticas.
 * - Obtener documentos.
 * - Aplicar filtros de búsqueda.
 * - Transformar respuestas de Directus
 *   a DTOs de la API.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
@Injectable()
export class MapotecaService {
  constructor(
    private readonly directusService: DirectusService,

    private readonly directusConfig: DirectusConfig,
  ) {}

  /**
   * Obtiene las temáticas registradas
   * en la carpeta principal Mapoteca.
   *
   * @returns Colección de temáticas
   * con la cantidad real de documentos
   * asociados.
   */
  async obtenerTematicas(): Promise<TematicaResponseDto[]> {
    const subcarpetas = await this.obtenerTematicasMapoteca();

    return Promise.all(
      subcarpetas.map(async (carpeta) => {
        const documentos = await this.directusService.getFilesByFolder(
          carpeta.name,
        );

        return {
          id: carpeta.id,

          nombre: carpeta.name,

          cantidadDocumentos: documentos.length,
        };
      }),
    );
  }

  /**
   * Obtiene documentos de la Mapoteca
   * aplicando filtros opcionales.
   *
   * Filtros soportados:
   * - temática
   * - nombre
   * - tipo MIME
   * - paginación
   *
   * @param filters Filtros de búsqueda.
   *
   * @returns Colección paginada
   * de documentos.
   */
  async obtenerDocumentos(
    filters: DocumentoFilterDto,
  ): Promise<PagedDocumentoResponseDto> {
    const tematicas = await this.obtenerTematicasMapoteca();

    /**
     * Obtiene los documentos
     * asociados a cada temática
     * en paralelo.
     */
    const documentosPorTematica = await Promise.all(
      tematicas.map(async (tematica) => ({
        tematica,

        documentos: await this.directusService.getFilesByFolder(tematica.name),
      })),
    );

    const resultado: DocumentoResponseDto[] = [];

    for (const item of documentosPorTematica) {
      resultado.push(
        ...item.documentos.map((documento) =>
          this.mapearDocumento(documento, item.tematica.name),
        ),
      );
    }

    let documentosFiltrados = resultado;

    /**
     * Filtro por temática.
     */
    if (filters.tematica) {
      documentosFiltrados = documentosFiltrados.filter((documento) =>
        documento.tematica
          .toLowerCase()

          .includes(filters.tematica!.toLowerCase()),
      );
    }

    /**
     * Filtro por nombre.
     */
    if (filters.nombre) {
      documentosFiltrados = documentosFiltrados.filter(
        (documento) =>
          documento.titulo
            .toLowerCase()

            .includes(filters.nombre!.toLowerCase()) ||
          documento.nombreArchivo
            .toLowerCase()

            .includes(filters.nombre!.toLowerCase()),
      );
    }

    /**
     * Filtro por tipo MIME.
     */
    if (filters.tipo) {
      documentosFiltrados = documentosFiltrados.filter(
        (documento) =>
          documento.tipo.toLowerCase() === filters.tipo!.toLowerCase(),
      );
    }

    /**
     * Filtro por año de carga.
     */
    if (filters.anio) {
      documentosFiltrados = documentosFiltrados.filter(
        (documento) =>
          new Date(documento.fechaCarga).getFullYear() === filters.anio,
      );
    }

    /**
     * Ordenamiento.
     */
    if (filters.sort) {
      const direction = filters.direction?.toLowerCase() === 'desc' ? -1 : 1;

      documentosFiltrados.sort((a, b) => {
        switch (filters.sort) {
          case 'titulo':
            return a.titulo.localeCompare(b.titulo) * direction;

          case 'tematica':
            return a.tematica.localeCompare(b.tematica) * direction;

          case 'fechaCarga':
            return (
              (new Date(a.fechaCarga).getTime() -
                new Date(b.fechaCarga).getTime()) *
              direction
            );

          case 'tamano':
            return (a.tamano - b.tamano) * direction;

          default:
            return 0;
        }
      });
    }

    /**
     * Paginación.
     */
    const page = filters.page ?? 1;

    const size = filters.size ?? 10;

    const total = documentosFiltrados.length;

    const totalPages = Math.ceil(total / size);

    const start = (page - 1) * size;

    const end = start + size;

    return {
      page,

      size,

      total,

      totalPages,

      data: documentosFiltrados.slice(start, end),
    };
  }

  /**
   * Obtiene un documento de la Mapoteca
   * a partir de su identificador.
   *
   * @param documentId Identificador del documento.
   *
   * @returns Información del documento.
   *
   * @throws DocumentNotFoundException
   * cuando el documento no existe
   * dentro de la Mapoteca.
   */
  async obtenerDocumentoPorId(
    documentId: string,
  ): Promise<DocumentoDetalleResponseDto> {
    const tematicas = await this.obtenerTematicasMapoteca();

    /**
     * Busca el documento
     * recorriendo cada temática.
     */
    for (const tematica of tematicas) {
      const documentos = await this.directusService.getFilesByFolder(
        tematica.name,
      );

      const documento = documentos.find((item) => item.id === documentId);

      if (documento) {
        const documentoResponse = this.mapearDocumento(
          documento,

          tematica.name,
        );

        return {
          ...documentoResponse,

          urlConsulta: this.directusConfig.getAssetUrl(documento.id),
        };
      }
    }

    throw new DocumentNotFoundException(documentId);
  }

  /**
   * Obtiene las temáticas registradas
   * en la carpeta principal Mapoteca.
   *
   * @returns Colección de carpetas
   * temáticas de la Mapoteca.
   */
  private async obtenerTematicasMapoteca(): Promise<DirectusFolder[]> {
    const carpetas = await this.directusService.getFolderByName(
      MAPOTECA_CONSTANTS.ROOT_FOLDER,
    );

    if (!carpetas.length) {
      throw new NotFoundException('No existe la carpeta principal Mapoteca.');
    }

    const mapoteca = carpetas[0];

    return this.directusService.getSubFolders(mapoteca.id);
  }

  /**
   * Transforma un documento de Directus
   * al DTO de respuesta de la API.
   *
   * @param documento Documento de Directus.
   * @param tematica Nombre de la temática.
   *
   * @returns DTO de respuesta.
   */
  private mapearDocumento(
    documento: DirectusFile,
    tematica: string,
  ): DocumentoResponseDto {
    return {
      id: documento.id,

      titulo: documento.title,

      nombreArchivo: documento.filename_download,

      tipo: documento.type,

      tamano: documento.filesize,

      tematica,

      fechaCarga: documento.uploaded_on,

      imprimible: this.esImprimible(documento.type),
    };
  }

  /**
   * Determina si un documento
   * admite impresión.
   *
   * @param mimeType Tipo MIME.
   *
   * @returns true cuando el documento
   * puede imprimirse.
   */
  private esImprimible(mimeType: string): boolean {
    return (MAPOTECA_CONSTANTS.PRINTABLE_TYPES as readonly string[]).includes(
      mimeType,
    );
  }

  /**
   * Obtiene la URL de descarga
   * de un documento.
   *
   * @param documentId Identificador
   * del documento.
   *
   * @returns URL de descarga.
   */
  async obtenerUrlDescarga(documentId: string): Promise<string> {
    /**
     * Valida que el documento
     * exista dentro de Mapoteca.
     */
    await this.obtenerDocumentoPorId(documentId);

    return this.directusConfig.getDownloadUrl(documentId);
  }
}
