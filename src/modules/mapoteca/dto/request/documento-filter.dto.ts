import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * DTO de filtros para la consulta
 * de documentos de la Mapoteca.
 *
 * Permite realizar búsquedas por:
 * - Temática.
 * - Nombre del documento.
 * - Tipo MIME.
 * - Paginación.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DocumentoFilterDto {
  /**
   * Nombre de la temática.
   */
  @ApiPropertyOptional({
    description: 'Nombre de la temática.',
    example: 'Agropecuario',
  })
  @IsOptional()
  @IsString()
  tematica?: string;

  /**
   * Texto a buscar en el nombre
   * o título del documento.
   */
  @ApiPropertyOptional({
    description: 'Nombre o texto a buscar.',
    example: 'opiac',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  /**
   * Tipo MIME del documento.
   */
  @ApiPropertyOptional({
    description: 'Tipo MIME del documento.',
    example: 'application/pdf',
  })
  @IsOptional()
  @IsString()
  tipo?: string;

  /**
   * Año de carga del documento.
   */
  @ApiPropertyOptional({
    description: 'Año de carga del documento.',
    example: 2026,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  anio?: number;

  /**
   * Número de página.
   *
   * Valor por defecto: 1
   */
  @ApiPropertyOptional({
    description: 'Número de página.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  /**
   * Cantidad de registros por página.
   *
   * Valor por defecto: 10
   * Valor máximo: 100
   */
  @ApiPropertyOptional({
    description: 'Cantidad de registros por página.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  /**
   * Campo utilizado para ordenar
   * los resultados.
   *
   * Valores soportados:
   * - titulo
   * - tematica
   * - fechaCarga
   * - tamano
   */
  @ApiPropertyOptional({
    description: 'Campo utilizado para ordenar los resultados.',
    example: 'titulo',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  /**
   * Dirección del ordenamiento.
   *
   * Valores soportados:
   * - asc
   * - desc
   */
  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento.',
    example: 'asc',
  })
  @IsOptional()
  @IsString()
  direction?: string;
}
