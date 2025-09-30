import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WELCOME_HTML, NOT_FOUND_HTML } from './views/staticPages';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  // Middleware for Stripe webhook (must come before prefix)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('DERMA API')
    .setDescription('API documentation for my NestJS project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  // Serve pretty welcome page at root path
  const adapter: any = app.getHttpAdapter();
  const http = adapter.getInstance ? adapter.getInstance() : (adapter as any);
  http.get('/', (_req: any, res: any) => {
    res.set('Content-Type', 'text/html; charset=utf-8').send(WELCOME_HTML);
  });

  // Catch-all for non-API, non-static routes -> pretty HTML 404
  http.use((req: any, res: any, next: any) => {
    const p = req.path || '';
    if (p.startsWith('/api') || p.startsWith('/uploads')) return next();
    res.status(404).set('Content-Type', 'text/html; charset=utf-8').send(NOT_FOUND_HTML);
  });
  await app.listen(process.env.PORT ?? 5500);
}
bootstrap();
