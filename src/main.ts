import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(process.env.PORT);
  console.log(`Your application is running on port ${process.env.PORT ?? 3000}`)
}
bootstrap();
