import { ApiProperty } from '@nestjs/swagger';

import { DocumentoResponseDto } from './documento-response.dto';

/**
 * DTO de detalle de documento.
 *
 * Extiende la información básica
 * del documento con propiedades
 * necesarias para su consulta.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DocumentoDetalleResponseDto extends DocumentoResponseDto {
  /**
   * URL pública para visualizar
   * el documento en Directus.
   */
  @ApiProperty({
    description: 'URL pública para consultar el documento.',
    example:
      'http://172.19.3.26:18055/cms-sigquindio/assets/7ae225e9-378b-47cb-b6db-10b637f8ae44',
  })
  urlConsulta!: string;
}
