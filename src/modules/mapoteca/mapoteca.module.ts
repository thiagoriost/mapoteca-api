import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { MapotecaController } from './controllers/mapoteca/mapoteca.controller';

import { MapotecaService } from './services/mapoteca/mapoteca.service';

import { DirectusService } from './services/directus/directus.service';

import { DirectusConfig } from '../../config/directus.config';

/**
 * Módulo funcional de Mapoteca.
 *
 * Responsable de registrar:
 * - Controladores.
 * - Servicios de negocio.
 * - Servicios de integración.
 * - Configuración de Directus.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
@Module({
  imports: [
    /**
     * Cliente HTTP utilizado para
     * la integración con Directus.
     */
    HttpModule,
  ],

  controllers: [MapotecaController],

  providers: [MapotecaService, DirectusService, DirectusConfig],
})
export class MapotecaModule {}
