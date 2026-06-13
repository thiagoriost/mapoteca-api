import {
  Controller,
  Get,
  Param,
  Query,
  Res
} from '@nestjs/common';

import type  {
  Response
} from 'express';

import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import {
  MapotecaService
} from '../../services/mapoteca/mapoteca.service';

import {
  TematicaResponseDto
} from '../../dto/response/tematica-response.dto';

import {
  DocumentoResponseDto
} from '../../dto/response/documento-response.dto';

import {
  DocumentoDetalleResponseDto
} from '../../dto/response/documento-detalle-response.dto';

import {
  DocumentoFilterDto
} from '../../dto/request/documento-filter.dto';

import {
   PagedDocumentoResponseDto
} from '../../dto/response/paged-documento-response.dto';

/**
 * Controlador encargado de exponer
 * los servicios de consulta de la Mapoteca.
 *
 * Responsabilidades:
 * - Consultar temáticas.
 * - Consultar documentos.
 * - Consultar documentos por identificador.
 * - Descargar documentos.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
@ApiTags('Mapoteca')
@Controller('api/v1/mapoteca')
export class MapotecaController {

  constructor(
    private readonly mapotecaService:
      MapotecaService
  ) {}

  /**
   * Obtiene las temáticas registradas
   * en la carpeta principal Mapoteca.
   *
   * @returns Colección de temáticas.
   */
  @Get('tematicas')
  @ApiOperation({
    summary: 'Consultar temáticas',
    description:
      'Obtiene las temáticas registradas en la carpeta principal de la Mapoteca.'
  })
  @ApiResponse({
    status: 200,
    description: 'Consulta exitosa.',
    type: TematicaResponseDto,
    isArray: true
  })
  @ApiResponse({
    status: 404,
    description:
      'No se encontró la carpeta principal de la Mapoteca.'
  })
  async obtenerTematicas():
    Promise<TematicaResponseDto[]> {

    return this.mapotecaService
      .obtenerTematicas();

  }

  /**
   * Obtiene documentos de la Mapoteca.
   *
   * Permite aplicar filtros opcionales:
   * - temática
   * - nombre
   * - tipo MIME
   * - año de carga
   * - ordenamiento
   * - paginación
   *
   * @param filters Filtros de búsqueda.
   *
   * @returns Colección de documentos.
   */
  @Get('documentos')
  @ApiOperation({
    summary: 'Consultar documentos',
    description:
      'Obtiene documentos de la Mapoteca aplicando filtros opcionales.'
  })
  @ApiQuery({
    name: 'tematica',
    required: false,
    type: String,
    description: 'Nombre de la temática.',
    example: 'Agropecuario'
  })
  @ApiQuery({
    name: 'nombre',
    required: false,
    type: String,
    description:
      'Texto a buscar en el título o nombre del archivo.',
    example: 'opiac'
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    type: String,
    description: 'Tipo MIME del documento.',
    example: 'application/pdf'
  })
  @ApiQuery({
    name: 'anio',
    required: false,
    type: Number,
    description: 'Año de carga del docuemento.',
    example: 2026
  })

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página.',
    example: 1
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description:
      'Cantidad de registros por página.',
    example: 10
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description:
      'Campo utilizado para ordenar los resultados.',
    example: 'titulo'
  })
  @ApiQuery({
    name: 'direction',
    required: false,
    type: String,
    description:
      'Dirección del ordenamiento.',
    example: 'asc'
  })
  @ApiResponse({
    status: 200,
    description: 'Consulta exitosa.',
    type: PagedDocumentoResponseDto 
  })
  async obtenerDocumentos(

    @Query()
    filters: DocumentoFilterDto

  ): Promise<PagedDocumentoResponseDto> {

    return this.mapotecaService
      .obtenerDocumentos(
        filters
      );

  }

  /**
   * Obtiene un documento de la Mapoteca
   * a partir de su identificador.
   *
   * @param id Identificador del documento.
   *
   * @returns Información detallada
   * del documento.
   */
  @Get('documentos/:id')
  @ApiOperation({
    summary:
      'Consultar documento por identificador',
    description:
      'Obtiene la información detallada de un documento específico de la Mapoteca.'
  })
  @ApiResponse({
    status: 200,
    description: 'Consulta exitosa.',
    type: DocumentoDetalleResponseDto
  })
  @ApiResponse({
    status: 404,
    description:
      'No se encontró el documento solicitado.'
  })
  async obtenerDocumentoPorId(

    @Param('id')
    id: string

  ): Promise<DocumentoDetalleResponseDto> {

    return this.mapotecaService
      .obtenerDocumentoPorId(
        id
      );

  }

  /**
   * Descarga un documento
   * de la Mapoteca.
   *
   * Redirecciona la solicitud
   * hacia la URL de descarga
   * administrada por Directus.
   *
   * @param id Identificador del documento.
   * @param response Respuesta HTTP.
   */
  @Get('documentos/:id/descargar')
  @ApiResponse({
    status: 302,
    description:
      'Redirección hacia la descarga del documento.'
  })
  @ApiOperation({
    summary: 'Descargar documento',
    description:
      'Redirecciona al recurso almacenado en Directus. Swagger UI puede mostrar errores CORS al probar este endpoint debido a la naturaleza de la redirección HTTP.'
})
  @ApiResponse({
    status: 404,
    description:
      'No se encontró el documento solicitado.'
  })
  async descargarDocumento(

    @Param('id')
    id: string,

    @Res()
    response: Response

  ): Promise<void> {

    const downloadUrl =
      await this.mapotecaService
        .obtenerUrlDescarga(
          id
        );

    response.redirect(
      downloadUrl
    );

  }

}