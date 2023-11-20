import { ExecutionContext, INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { createTokenMiddleware } from './middlewares/ws-auth-Middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: '*',
    };
    
    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const prisma = this.app.get(PrismaService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('chat').use(createTokenMiddleware(jwtService, this.logger, prisma));
    server.of('game').use(createTokenMiddleware(jwtService, this.logger, prisma));
		server.of('notification').use(createTokenMiddleware(jwtService, this.logger, prisma));
    server.of('status').use(createTokenMiddleware(jwtService, this.logger, prisma));

    return server;
  }
}