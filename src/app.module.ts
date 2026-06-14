import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { MapotecaModule } from './modules/mapoteca/mapoteca.module';

/**
 * Módulo raíz de la aplicación.
 *
 * Responsable de:
 * - Cargar variables de entorno.
 * - Registrar configuración global.
 * - Registrar módulos funcionales.
 * - Inicializar la aplicación.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
@Module({
  imports: [
    /**
     * Carga variables de entorno
     * desde el archivo .env
     * y las expone globalmente.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Módulo funcional encargado
     * de la gestión de la Mapoteca.
     */
    MapotecaModule,
  ],
})
export class AppModule {}
