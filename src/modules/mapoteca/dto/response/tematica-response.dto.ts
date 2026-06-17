import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para una temática
 * de la Mapoteca.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class TematicaResponseDto {
  /**
   * Identificador único de la temática.
   */
  @ApiProperty({
    description: 'Identificador único de la temática.',
    example: 'b0b8e613-c374-488c-b95a-21e9d631cc9d',
  })
  id!: string;

  /**
   * Nombre de la temática.
   */
  @ApiProperty({
    description: 'Nombre de la temática.',
    example: 'Agropecuario',
  })
  nombre!: string;

  /**
   * Cantidad de documentos asociados
   * a la temática.
   */
  @ApiProperty({
    description: 'Cantidad de documentos asociados a la temática.',
    example: 25,
  })
  cantidadDocumentos!: number;
}
