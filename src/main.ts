import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

/**
 * Punto de entrada de la aplicación.
 *
 * Responsable de:
 * - Inicializar NestJS.
 * - Configurar Swagger.
 * - Configurar validaciones globales.
 * - Configurar CORS.
 * - Iniciar el servidor HTTP.
 *
 * @author Carlos Alberto Aristizabal Vargas
 * @since 2026-06-11
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Habilita validaciones globales
   * para DTOs.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,
    }),
  );

  /**
   * Habilita consumo desde
   * aplicaciones externas.
   */
  app.enableCors();

  /**
   * Configuración de Swagger.
   */
  const swaggerConfig = new DocumentBuilder()

    .setTitle('Mapoteca API')

    .setDescription('API de consulta documental Mapoteca')

    .setVersion('1.0.0')

    .addBearerAuth()

    .build();

  const document = SwaggerModule.createDocument(
    app,

    swaggerConfig,
  );

  SwaggerModule.setup(
    'swagger',

    app,

    document,
  );

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`Mapoteca API ejecutándose en puerto ${port}`);
}

bootstrap();
