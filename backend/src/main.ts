import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { IoAdapter } from '@nestjs/platform-socket.io'; 
import { IoAdapter } from '@nestjs/platform-socket.io/adapters/io-adapter';
import { SocketIOAdapter } from './chat/SocketIoAdapter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // this section for socket.io configuration
  // const HttpAdapter = app.getHttpAdapter();
  // app.useWebSocketAdapter(new IoAdapter(HttpAdapter));
  
  app.enableCors({
    // credentials: true,
    origin: '*', 
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
  .setTitle('PingPong API')
  .setDescription('bestNoobiBackendEver')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  // this section for cors configuration
  await app.listen(3000, '127.0.0.1');
}
bootstrap();