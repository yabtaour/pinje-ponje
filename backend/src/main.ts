import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';
// import { IoAdapter } from '@nestjs/platform-socket.io'; 
import { SocketIOAdapter } from './chat/SocketIoAdapter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // this section for socket.io configuration
  // const HttpAdapter = app.getHttpAdapter();
  // app.useWebSocketAdapter(new IoAdapter(HttpAdapter));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    // credentials: true,
    origin: '*', 
  });
  // app.useGlobalFilters()
  
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
  await app.listen(3000, '10.0.2.15');
	// await app.listen(3000, '127.0.0.1');
}
bootstrap();