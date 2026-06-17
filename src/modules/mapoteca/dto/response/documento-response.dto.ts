import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para documentos
 * de la Mapoteca.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DocumentoResponseDto {
  /**
   * Identificador único del documento.
   */
  @ApiProperty({
    description: 'Identificador único del documento.',
    example: '7ae225e9-378b-47cb-b6db-10b637f8ae44',
  })
  id!: string;

  /**
   * Título del documento.
   */
  @ApiProperty({
    description: 'Título del documento.',
    example: 'Sig Opiac I Fbd Admin Geoportal V 1.0 05022026',
  })
  titulo!: string;

  /**
   * Nombre original del archivo.
   */
  @ApiProperty({
    description: 'Nombre original del archivo.',
    example: 'SIG_OPIAC_I_FBD_AdminGeoportal_V_1.0_05022026.pdf',
  })
  nombreArchivo!: string;

  /**
   * Tipo MIME del documento.
   */
  @ApiProperty({
    description: 'Tipo MIME del documento.',
    example: 'application/pdf',
  })
  tipo!: string;

  /**
   * Tamaño del archivo expresado en bytes.
   */
  @ApiProperty({
    description: 'Tamaño del archivo expresado en bytes.',
    example: 164503,
  })
  tamano!: number;

  /**
   * Nombre de la temática asociada.
   */
  @ApiProperty({
    description: 'Nombre de la temática asociada.',
    example: 'Agropecuario',
  })
  tematica!: string;

  /**
   * Fecha de carga del documento.
   */
  @ApiProperty({
    description: 'Fecha y hora de carga del documento en formato ISO 8601.',
    example: '2026-05-27T15:35:40.678Z',
  })
  fechaCarga!: string;

  /**
   * Indica si el documento puede imprimirse.
   */
  @ApiProperty({
    description: 'Indica si el documento admite impresión.',
    example: true,
  })
  imprimible!: boolean;
}
