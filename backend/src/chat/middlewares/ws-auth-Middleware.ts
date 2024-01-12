import { AuthWithWs } from '../dto/user-ws-dto';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger, prisma: PrismaService) =>
  async (socket: AuthWithWs, next) => {
    const token =
      socket.handshake.headers['authorization'] || socket.handshake.auth?.token;
    try {
      const actualToken = token.split(' ')[1];
      const payload = jwtService.verify(actualToken);
      const user = await prisma.user.findUnique({
        where: {
          id: +payload.sub,
        },
        select: {
          username: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      });
      if (!user) {
        logger.error(`-- User not found --`);
        throw new Error('User not found');
      }

      socket.id = payload.sub;
      socket.username = user.username;
      socket.avatar = user.profile.avatar;
      next();
    } catch {
      logger.error(`-- Invalid token --`);
      next(new Error('FORBIDDEN'));
    }
  };
