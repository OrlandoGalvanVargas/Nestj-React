// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

     app.enableCors(); // 👈 esto habilita CORS

  app.useStaticAssets(join(__dirname, '..', 'wwwroot/ProductImages'), {
    prefix: '/ProductImages/',
  });

  await app.listen(3002);
}
bootstrap();


