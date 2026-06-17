import { ApiProperty } from '@nestjs/swagger';

import { DocumentoResponseDto } from './documento-response.dto';

/**
 * DTO de respuesta paginada
 * para documentos.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class PagedDocumentoResponseDto {
  /**
   * Página actual.
   */
  @ApiProperty({
    example: 1,
  })
  page!: number;

  /**
   * Tamaño de página.
   */
  @ApiProperty({
    example: 10,
  })
  size!: number;

  /**
   * Total de registros.
   */
  @ApiProperty({
    example: 57,
  })
  total!: number;

  /**
   * Total de páginas.
   */
  @ApiProperty({
    example: 6,
  })
  totalPages!: number;

  /**
   * Registros de la página.
   */
  @ApiProperty({
    type: DocumentoResponseDto,
    isArray: true,
  })
  data!: DocumentoResponseDto[];
}
