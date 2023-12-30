import {
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateProfileDto } from './dto/update-profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(readonly prisma: PrismaService) {}

  async FindProfileById(user_id: number, searchid: number) {
    try {
      const profile = await this.prisma.user.findMany({
        where: {
          AND: [
            {
              id: searchid as number,
            },
            {
              NOT: {
                OR: [
                  {
                    blockedBy: {
                      some: { blockerId: user_id, blockedId: searchid },
                    },
                  },
                  {
                    blocking: {
                      some: { blockerId: searchid, blockedId: user_id },
                    },
                  },
                ],
              },
            },
          ],
        },
        select: {
          profile: true,
        },
      });
      if (profile.length === 0)
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      return profile[0];
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientUnknownRequestError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw e;
      } else throw e;
    }
  }

  async getAvatar(user_id: number) {
    try {
      const avatar = await this.prisma.profile.findUnique({
        where: { userid: user_id },
        select: {
          avatar: true,
        },
      });
      if (!avatar)
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      return avatar;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientUnknownRequestError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw e;
      } else throw e;
    }
  }

  async uploadAvatar(user_id: number, file: any) {
    try {
      if (!file || !file.path || !file.filename)
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);

      const path = '/avatars/' + file.filename;
      console.log(path, file);
      const profile = await this.prisma.profile.update({
        where: { userid: user_id },
        data: {
          avatar: path,
        },
      });
      return profile;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientUnknownRequestError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw e;
      } else throw e;
    }
  }

  async deleteAvatar(user_id: number) {
    try {
      const profile = await this.prisma.profile.update({
        where: { userid: user_id },
        data: {
          avatar: null,
        },
      });
      return profile;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientUnknownRequestError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw e;
      } else throw e;
    }
  }

  async updateProfile(
    @Param('user_id', ParseIntPipe) user_id: number,
    data: updateProfileDto,
  ) {
    try {
      const profile = await this.prisma.profile.update({
        where: { userid: user_id },
        data: {
          ...data,
        },
      });
      if (!profile)
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      return profile;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientUnknownRequestError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw e;
      } else throw e;
    }
  }
}
