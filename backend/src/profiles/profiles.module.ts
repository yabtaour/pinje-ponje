import { Module, forwardRef } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtAuthService } from 'src/auth/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  providers: [
    ProfilesService, UserService,
    JwtAuthService, JwtService,
  ],
  controllers: [ProfilesController],
  exports: [ProfilesService]
})
export class ProfilesModule {}
