import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO base utilizado para estandarizar
 * las respuestas de la API.
 *
 * @template T Tipo de dato retornado.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class ApiResponseDto<T> {
  /**
   * Indica si la operación fue exitosa.
   */
  @ApiProperty({
    description: 'Indica si la operación fue exitosa.',
    example: true,
  })
  success!: boolean;

  /**
   * Datos retornados por la operación.
   */
  @ApiProperty({
    description: 'Datos retornados por la operación.',
  })
  data!: T;

  /**
   * Fecha y hora de generación
   * de la respuesta.
   */
  @ApiProperty({
    description: 'Fecha y hora de generación de la respuesta.',
    example: '2026-06-04T15:30:00.000Z',
  })
  timestamp!: string;
}
