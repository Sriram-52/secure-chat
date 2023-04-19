import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  // Set the config options
  const adminConfig: admin.ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });

  app.enableCors();

  // add swagger
  const options = new DocumentBuilder()
    .setTitle('Secure Chat API')
    .setDescription('The Secure Chat API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/docs', app, document);

  await app.listen(configService.get<number>('PORT') || 8080);
}
bootstrap();
