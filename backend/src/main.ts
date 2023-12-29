import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './chat/SocketIoAdapter';
import { GlobalExceptionFilter } from './global-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // this section for socket.io configuration
  const HttpAdapter = app.getHttpAdapter();
  app.useWebSocketAdapter(new IoAdapter(HttpAdapter));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    credentials: true,
    origin: true, 
  });
  app.useGlobalFilters()
  
  // this section for global filter
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useWebSocketAdapter(new SocketIOAdapter(app));

    // this section for swagger configuration
  const options = new DocumentBuilder()
  .setTitle('pinjponj API')
  .setDescription('The pinjponj API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  // this section for cors configuration
  // await app.listen(3000, '127.0.0.1');
	await app.listen(3000);
}
bootstrap();