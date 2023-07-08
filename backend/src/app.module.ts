import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// import { AuthService } from './auth/auth.service';
// import { UserModule } from './user/user.module';
// import { UsersService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule/*, UserModule*/, PassportModule],
  controllers: [AuthController],
  providers: [/*AuthService, UsersService*/],
})
export class AppModule {}
