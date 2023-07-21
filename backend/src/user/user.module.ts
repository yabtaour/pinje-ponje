import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [PrismaModule, ProfilesModule],
  providers: [UserService, PrismaService, ProfilesService],
  controllers: [UserController],
})
export class UserModule {}
