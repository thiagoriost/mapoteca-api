import { NotFoundException } from '@nestjs/common';

/**
 * Excepción lanzada cuando un documento
 * solicitado no existe en la Mapoteca.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
export class DocumentNotFoundException extends NotFoundException {
  /**
   * Constructor de la excepción.
   *
   * @param documentId Identificador del documento.
   */
  constructor(documentId: string) {
    super(`Documento ${documentId} no encontrado`);
  }
}
