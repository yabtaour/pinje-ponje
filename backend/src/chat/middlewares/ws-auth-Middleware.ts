import { AuthWithWs } from '../dto/user-ws-dto';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger, prisma: PrismaService) =>
  async (socket: AuthWithWs, next) => {
    const token = socket.handshake.headers['authorization'] || socket.handshake.auth?.token;

    // i need to check if user is in the database
    // to do: check if user is in the database
    try {
        const payload = jwtService.verify(token);
        console.log("payload : ", payload);
        const user = await prisma.user.findUnique({
          where : {
            id : +payload.sub,
          },
          select : {
              profile : {
                    select : {
                        username : true,
                    }
              }
          },
        });
        if (!user) {
            logger.error(`-- User not found --`);
            throw new Error('User not found');
        }
        logger.debug(`Client connected: ` +user.profile.username);
        socket.id = payload.sub;
        socket.username = user.profile.username;
        next();
    } catch {
        logger.error(`-- Invalid token --`);
        next(new Error('FORBIDDEN'));
    }
  };