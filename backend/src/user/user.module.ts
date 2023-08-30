import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { JwtAuthService } from 'src/auth/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, ProfilesModule],
  providers: [UserService, JwtService, JwtAuthService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
